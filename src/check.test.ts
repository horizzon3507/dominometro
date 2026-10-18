// Testes de unidade para checkAvailability (src/check.ts).
//
// Estratégia: fetch global é mockado via vi.stubGlobal. Como check.ts faz
// cache do bootstrap da IANA em variável de módulo (bootstrapPromise), cada
// teste reseta os módulos (vi.resetModules) e importa './check' de novo,
// garantindo bootstrap fresco por caso.
//
// Roteamento do mock por URL:
// - data.iana.org/rdap/dns.json → bootstrap da IANA
// - dns.google / cloudflare-dns.com → DNS-over-HTTPS
// - demais URLs https → lookup RDAP do domínio
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

function notFound(): Response {
  return { ok: false, status: 404, json: async () => ({}) } as Response
}

/** Importa checkAvailability com estado de módulo zerado (sem cache de bootstrap). */
async function loadCheckAvailability() {
  const mod = await import('./check')
  return mod.checkAvailability
}

function stubFetch(impl: (url: string) => Promise<Response>) {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string | URL | Request) => {
      const u = typeof url === 'string' ? url : url.toString()
      return impl(u)
    }),
  )
}

const BOOTSTRAP_COM = {
  services: [[['com'], ['https://rdap.verisign.com/com/v1/']]],
}

const NXDOMAIN = { Status: 3 }
const DNS_TAKEN = {
  Status: 0,
  Answer: [{ name: 'example.com.', type: 2, TTL: 3600, data: 'a.gtld-servers.net.' }],
}

beforeEach(() => {
  vi.resetModules()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('checkAvailability', () => {
  it('RDAP 404 → free via rdap', async () => {
    stubFetch(async (url) => {
      if (url.includes('data.iana.org/rdap/dns.json')) return jsonResponse(BOOTSTRAP_COM)
      if (url.includes('dns.google') || url.includes('cloudflare-dns.com'))
        return jsonResponse(NXDOMAIN)
      return notFound() // RDAP: domínio não existe
    })
    const checkAvailability = await loadCheckAvailability()
    await expect(checkAvailability('dominio-livre-xyz123.com')).resolves.toEqual({
      state: 'free',
      via: 'rdap',
    })
  })

  it('RDAP 200 com expiration → taken via rdap + expires', async () => {
    stubFetch(async (url) => {
      if (url.includes('data.iana.org/rdap/dns.json')) return jsonResponse(BOOTSTRAP_COM)
      if (url.includes('dns.google') || url.includes('cloudflare-dns.com'))
        return jsonResponse(DNS_TAKEN)
      return jsonResponse(
        {
          events: [{ eventAction: 'registration', eventDate: '2020-01-01T00:00:00Z' },
            { eventAction: 'expiration', eventDate: '2027-05-01T00:00:00Z' }],
        },
        200,
      )
    })
    const checkAvailability = await loadCheckAvailability()
    await expect(checkAvailability('google.com')).resolves.toEqual({
      state: 'taken',
      via: 'rdap',
      expires: '2027-05-01',
    })
  })

  it('DNS NXDOMAIN (Status 3) sem RDAP → free via dns', async () => {
    stubFetch(async (url) => {
      // Bootstrap sem o TLD → rdapLookup retorna undefined (sem veredicto)
      if (url.includes('data.iana.org/rdap/dns.json')) return jsonResponse({ services: [] })
      if (url.includes('dns.google') || url.includes('cloudflare-dns.com'))
        return jsonResponse(NXDOMAIN)
      throw new Error(`fetch inesperado: ${url}`)
    })
    const checkAvailability = await loadCheckAvailability()
    await expect(checkAvailability('dominio-livre-xyz123.com')).resolves.toEqual({
      state: 'free',
      via: 'dns',
    })
  })

  it('DNS com Answer sem RDAP → taken via dns', async () => {
    stubFetch(async (url) => {
      if (url.includes('data.iana.org/rdap/dns.json')) return jsonResponse({ services: [] })
      if (url.includes('dns.google') || url.includes('cloudflare-dns.com'))
        return jsonResponse(DNS_TAKEN)
      throw new Error(`fetch inesperado: ${url}`)
    })
    const checkAvailability = await loadCheckAvailability()
    await expect(checkAvailability('google.com')).resolves.toEqual({
      state: 'taken',
      via: 'dns',
      expires: undefined,
    })
  })

  it('RDAP free + DNS taken → prevalece taken via dns', async () => {
    stubFetch(async (url) => {
      if (url.includes('data.iana.org/rdap/dns.json')) return jsonResponse(BOOTSTRAP_COM)
      if (url.includes('dns.google') || url.includes('cloudflare-dns.com'))
        return jsonResponse(DNS_TAKEN)
      return notFound() // RDAP diz livre, mas o nome delega NS (registrado sem venda)
    })
    const checkAvailability = await loadCheckAvailability()
    await expect(checkAvailability('reservado-sem-ns.com')).resolves.toEqual({
      state: 'taken',
      via: 'dns',
      expires: undefined,
    })
  })

  it('tudo falha (rede/CORS/timeout) → unknown', async () => {
    stubFetch(async (url) => {
      if (url.includes('data.iana.org/rdap/dns.json'))
        throw new TypeError('Failed to fetch') // bootstrap falha → retry liberado, rdap undefined
      throw new TypeError('Failed to fetch') // RDAP e DoH falham
    })
    const checkAvailability = await loadCheckAvailability()
    await expect(checkAvailability('qualquer.com')).resolves.toEqual({ state: 'unknown' })
  })
})
