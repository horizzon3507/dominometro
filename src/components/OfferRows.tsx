import { brl, IOF, USD_BRL, type Offer } from '../data'

interface Props {
  offers: Offer[]
  domain: string
}

/** Lista de ofertas de um TLD/domínio — registrador, 1º ano, renovação, 4 anos. */
export function OfferRows({ offers, domain }: Props) {
  if (offers.length === 0) return null
  const bestLongTerm = offers.reduce((a, b) =>
    a.fourYearBRL <= b.fourYearBRL ? a : b,
  )

  return (
    <ul className="divide-y divide-ink/10">
      {offers.map((o) => {
        const usdOriginal = o.firstYearBRL / (USD_BRL * (1 + IOF))
        return (
          <li
            key={o.registrar.id}
            className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-3 transition-colors hover:bg-paper-dim/60 sm:grid-cols-[minmax(120px,1.5fr)_1fr_1fr_1fr_auto] sm:gap-x-5"
          >
            <div className="min-w-0">
              <p className="truncate font-bold tracking-tight">
                {o.registrar.name}
                {o === bestLongTerm && (
                  <span className="ml-2 inline-block -translate-y-0.5 bg-good px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink">
                    melhor 4 anos
                  </span>
                )}
                {o.trap && (
                  <span className="ml-2 inline-block -translate-y-0.5 bg-alert px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                    armadilha
                  </span>
                )}
              </p>
              <p className="mt-0.5 truncate font-mono text-[11px] text-ink-soft">
                {o.registrar.currency === 'USD'
                  ? `cobrado em US$ ${usdOriginal.toFixed(2)} + IOF → R$`
                  : o.registrar.note ?? 'cobre em R$'}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="stretch-cond font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                1º ano
              </p>
              <p className="font-mono text-sm font-semibold sm:text-base">
                {brl(o.firstYearBRL)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="stretch-cond font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                renovação
              </p>
              <p
                className={`font-mono text-sm sm:text-base ${
                  o.trap ? 'font-semibold text-alert-deep' : ''
                }`}
              >
                {brl(o.renewalBRL)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="stretch-cond font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                4 anos
              </p>
              <p className="font-mono text-sm sm:text-base">
                {brl(o.fourYearBRL)}
              </p>
            </div>

            <a
              href={o.registrar.link(domain)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`ver oferta de ${domain} na ${o.registrar.name} (abre em nova aba)`}
              className="col-span-2 justify-self-start border-2 border-ink px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-tag focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brblue focus-visible:ring-offset-2 sm:col-span-1 sm:justify-self-end"
            >
              ver oferta ↗
            </a>
          </li>
        )
      })}
    </ul>
  )
}
