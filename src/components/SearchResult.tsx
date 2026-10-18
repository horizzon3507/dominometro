import { useEffect, useState } from 'react'
import { brl, offersFor, TLDS } from '../data'
import { checkAvailability, type Availability } from '../check'
import { OfferRows } from './OfferRows'

interface Props {
  domain: string
}

const VERDICT: Record<
  Availability['state'],
  { label: string; cls: string }
> = {
  checking: { label: 'verificando no registro…', cls: 'bg-paper-dim text-ink' },
  free: { label: 'domínio livre', cls: 'bg-good text-ink' },
  taken: { label: 'domínio registrado', cls: 'bg-alert text-white' },
  unknown: { label: 'verificação indisponível', cls: 'bg-tag text-ink' },
}

const VIA: Record<string, string> = {
  rdap: 'confirmado no registro oficial (RDAP)',
  dns: 'via DNS — sem nameservers ativos',
}

/** Resultado da busca: disponibilidade real (RDAP/DNS) + etiqueta + ofertas. */
export function SearchResult({ domain }: Props) {
  const tld = domain.slice(domain.indexOf('.'))
  const row = TLDS.find((t) => t.tld === tld)
  const offers = offersFor(tld).sort((a, b) => a.firstYearBRL - b.firstYearBRL)
  const [avail, setAvail] = useState<Availability>({ state: 'checking' })

  useEffect(() => {
    let alive = true
    checkAvailability(domain)
      .then((r) => alive && setAvail(r))
      .catch(() => alive && setAvail({ state: 'unknown' }))
    return () => {
      alive = false
    }
  }, [domain])

  if (offers.length === 0) return null
  const cheapest = offers[0]
  const verdict = VERDICT[avail.state]

  return (
    <section id="resultado" className="border-b-2 border-ink px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <p className="stretch-cond font-mono text-xs uppercase tracking-[0.3em] text-ink-soft">
              resultado
            </p>
            <h2 className="stretch-wide mt-2 break-all font-display text-3xl font-black tracking-tight sm:text-5xl">
              {domain}
            </h2>
            <p className="mt-2 font-mono text-xs" aria-live="polite">
              <span
                className={`inline-block px-1.5 py-0.5 font-semibold uppercase tracking-wider ${verdict.cls} ${
                  avail.state === 'checking' ? 'animate-pulse' : ''
                }`}
              >
                {verdict.label}
              </span>{' '}
              <span className="ml-1 text-ink-soft">
                {avail.state === 'taken'
                  ? avail.expires
                    ? `vence ${avail.expires.split('-').reverse().join('/')} · dá pra esperar expirar ou tentar outro TLD`
                    : VIA[avail.via]
                  : avail.state === 'free'
                    ? VIA[avail.via]
                    : avail.state === 'unknown'
                      ? 'não conseguimos verificar agora — confirme direto no registrador'
                      : 'consultando o registro oficial (RDAP) e o DNS…'}
              </span>
            </p>
          </div>

          {/* etiqueta amarela de oferta — assinatura visual */}
          <div className="relative -rotate-2 border-2 border-ink bg-tag px-5 py-4 shadow-[5px_5px_0_0_#14170f]">
            <p className="stretch-cond font-mono text-[10px] font-semibold uppercase tracking-[0.25em]">
              menor 1º ano · {cheapest.registrar.name}
            </p>
            <p className="stretch-wide mt-1 font-display text-4xl font-black tracking-tight sm:text-5xl">
              {brl(cheapest.firstYearBRL)}
            </p>
            <p className="mt-1 font-mono text-[11px]">
              renova a {brl(cheapest.renewalBRL)}/ano
            </p>
            <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full border-2 border-ink bg-paper" />
          </div>
        </div>

        {avail.state === 'unknown' && (
          <div role="status" className="mt-4 border-2 border-ink bg-paper-dim px-3 py-2.5 shadow-[4px_4px_0_0_#14170f]">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider">
              <span className="mr-1.5 inline-block bg-tag px-1.5 py-0.5">⚠ atenção</span>
              Não conseguimos verificar a disponibilidade agora
            </p>
            <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-ink-soft">
              Pode ser rate-limit do RDAP, TLD sem RDAP público ou bloqueio de
              rede (CORS/offline). Confirme direto no registrador antes de
              contar com esse nome — os preços abaixo continuam valendo.
            </p>
          </div>
        )}

        {row?.note && (
          <p className="mt-4 inline-block border border-ink/30 bg-paper-dim/60 px-2.5 py-1 font-mono text-[11px] text-ink-soft">
            ⓘ {row.note}
          </p>
        )}

        <div className="mt-8 border-2 border-ink bg-paper shadow-[6px_6px_0_0_#14170f]">
          <OfferRows offers={offers} domain={domain} />
        </div>
      </div>
    </section>
  )
}
