// ---------------------------------------------------------------------------
// Checagem nativa de disponibilidade — sem backend.
//
// 1. RDAP (protocolo oficial dos registros, substituto do WHOIS): resolve o
//    servidor certo para cada TLD via bootstrap da IANA e pergunta se o domínio
//    existe. 404 = livre, 200 = registrado. Resposta autoritativa.
// 2. DNS-over-HTTPS (dns.google → cloudflare-dns.com): consulta NS. Resposta
//    com Answer = registrado; NXDOMAIN = provavelmente livre (registrador pode
//    ter domínio "em espera"/reservado que ainda não delega NS).
// ---------------------------------------------------------------------------

export type Availability =
  | { state: 'checking' }
  | { state: 'free'; via: 'rdap' | 'dns' }
  | { state: 'taken'; via: 'rdap' | 'dns'; expires?: string }
  | { state: 'unknown' }

const TIMEOUT_MS = 7000

async function getJSON(url: string, accept?: string): Promise<Response> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, {
      signal: ctrl.signal,
      headers: accept ? { accept } : undefined,
    })
  } finally {
    clearTimeout(timer)
  }
}

// --- RDAP via bootstrap da IANA ---------------------------------------------

let bootstrapPromise: Promise<Record<string, string[]>> | null = null

/** TLD → URLs base dos servidores RDAP (cache de módulo, 1 fetch por sessão) */
function rdapBootstrap(): Promise<Record<string, string[]>> {
  if (!bootstrapPromise) {
    bootstrapPromise = getJSON('https://data.iana.org/rdap/dns.json')
      .then((r) => r.json())
      .then((doc) => {
        const map: Record<string, string[]> = {}
        for (const service of doc.services ?? []) {
          const [tlds, urls] = service
          for (const tld of tlds) {
            map[tld] = urls
              .filter((u: string) => u.startsWith('https'))
              .map((u: string) => (u.endsWith('/') ? u : `${u}/`))
          }
        }
        return map
      })
      .catch(() => {
        bootstrapPromise = null // permite retry na próxima busca
        return {}
      })
  }
  return bootstrapPromise
}

type RdapVerdict = { state: 'free' | 'taken'; expires?: string } | undefined

async function rdapLookup(domain: string, tld: string): Promise<RdapVerdict> {
  const bases = (await rdapBootstrap())[tld.replace(/^\./, '')]
  if (!bases) return undefined
  for (const base of bases.slice(0, 2)) {
    try {
      const res = await getJSON(
        `${base}domain/${encodeURIComponent(domain)}`,
        'application/rdap+json',
      )
      if (res.status === 404) return { state: 'free' }
      if (res.ok) {
        const doc = await res.json()
        const expiry = doc.events?.find(
          (e: { eventAction?: string }) => e.eventAction === 'expiration',
        )?.eventDate
        return { state: 'taken', expires: expiry?.slice(0, 10) }
      }
    } catch {
      // timeout/rede/CORS → tenta o próximo servidor
    }
  }
  return undefined
}

// --- DNS-over-HTTPS ---------------------------------------------------------

interface DohResponse {
  Status: number
  Answer?: unknown[]
}

async function dohLookup(domain: string): Promise<'free' | 'taken' | undefined> {
  const providers = [
    `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=NS`,
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=NS`,
  ]
  for (const url of providers) {
    try {
      const res = await getJSON(url, 'application/dns-json')
      if (!res.ok) continue
      const doc: DohResponse = await res.json()
      if (doc.Status === 3) return 'free' // NXDOMAIN
      if (doc.Status === 0 && doc.Answer && doc.Answer.length > 0) return 'taken'
    } catch {
      // próximo provedor
    }
  }
  return undefined
}

// --- veredicto combinado ----------------------------------------------------

/**
 * Checa se `domain` está livre. RDAP é autoritativo; DNS é o fallback.
 * Regras: RDAP livre + DNS tomado acontece com domínio registrado sem NS —
 * nesse caso prevalece "taken" (o nome NÃO está à venda).
 */
export async function checkAvailability(domain: string): Promise<Availability> {
  const tld = domain.slice(domain.lastIndexOf('.'))
  const [rdap, dns] = await Promise.all([
    rdapLookup(domain, tld),
    dohLookup(domain),
  ])

  if (rdap?.state === 'free' && dns !== 'taken') return { state: 'free', via: 'rdap' }
  if (rdap?.state === 'taken' || dns === 'taken') {
    return { state: 'taken', via: rdap?.state === 'taken' ? 'rdap' : 'dns', expires: rdap?.state === 'taken' ? rdap.expires : undefined }
  }
  if (rdap?.state === 'free' || dns === 'free') {
    return { state: 'free', via: rdap ? 'rdap' : 'dns' }
  }
  return { state: 'unknown' }
}
