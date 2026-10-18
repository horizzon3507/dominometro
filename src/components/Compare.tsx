import { useMemo, useState } from 'react'
import { IOF, TLDS, USD_BRL, offersFor } from '../data'
import { OfferRows } from './OfferRows'

type SortKey = 'first' | 'fourYear' | 'renewal'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'first', label: 'menor 1º ano' },
  { key: 'fourYear', label: 'menor 4 anos' },
  { key: 'renewal', label: 'menor renovação' },
]

/** Panorama: filtra um TLD entre ~85 opções, todos os registradores, ordenável. */
export function Compare() {
  const [tld, setTld] = useState('.com.br')
  const [sort, setSort] = useState<SortKey>('first')
  const [filter, setFilter] = useState('')

  const offers = useMemo(() => {
    const key = {
      first: (o: { firstYearBRL: number }) => o.firstYearBRL,
      fourYear: (o: { fourYearBRL: number }) => o.fourYearBRL,
      renewal: (o: { renewalBRL: number }) => o.renewalBRL,
    }[sort]
    return offersFor(tld).sort((a, b) => key(a) - key(b))
  }, [tld, sort])

  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase()
    const list = TLDS.filter(({ tld: t }) => t.includes(q))
    // TLD ativo sempre visível mesmo fora do filtro
    return list.some((t) => t.tld === tld)
      ? list
      : [...TLDS.filter((t) => t.tld === tld), ...list]
  }, [filter, tld])

  const activeNote = TLDS.find((t) => t.tld === tld)?.note

  return (
    <section id="panorama" className="border-b-2 border-ink px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="stretch-cond font-mono text-xs uppercase tracking-[0.3em] text-ink-soft">
              panorama
            </p>
            <h2 className="stretch-wide mt-2 font-display text-3xl font-black tracking-tight sm:text-4xl">
              Quanto custa {tld} hoje
            </h2>
          </div>

          <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
            ordenar
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="cursor-pointer border-2 border-ink bg-paper px-2 py-1.5 font-mono text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-brblue"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={`filtrar entre ${TLDS.length} extensões… (ex.: .br, .io, .store)`}
          aria-label="Filtrar extensões"
          className="mt-6 w-full max-w-sm border-2 border-ink bg-paper px-3 py-2 font-mono text-sm outline-none placeholder:text-ink-soft focus-visible:ring-2 focus-visible:ring-brblue"
        />

        <div className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1" role="group" aria-label="Extensões">
          {shown.map(({ tld: t }) => (
            <button
              key={t}
              type="button"
              aria-pressed={t === tld}
              onClick={() => setTld(t)}
              className={`border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brblue focus-visible:ring-offset-2 ${
                t === tld
                  ? '-translate-y-0.5 bg-ink text-tag shadow-[3px_3px_0_0_#00a859]'
                  : 'bg-paper hover:-translate-y-0.5 hover:bg-tag'
              }`}
            >
              {t}
            </button>
          ))}
          {shown.length === 0 && (
            <p className="py-2 font-mono text-xs text-ink-soft">
              nenhuma extensão "{filter}" — tente .com.br, .io, .store…
            </p>
          )}
        </div>

        <div className="mt-6 border-2 border-ink bg-paper shadow-[6px_6px_0_0_#14170f]">
          <div className="hidden grid-cols-[minmax(120px,1.5fr)_1fr_1fr_1fr_auto] gap-x-5 border-b-2 border-ink bg-paper-dim px-4 py-2 sm:grid">
            <span className="stretch-cond font-mono text-[10px] uppercase tracking-widest">
              registrador
            </span>
            {['1º ano', 'renovação/ano', '4 anos', ''].map((h, i) => (
              <span
                key={i}
                className="stretch-cond text-right font-mono text-[10px] uppercase tracking-widest"
              >
                {h}
              </span>
            ))}
          </div>
          <OfferRows offers={offers} domain={`exemplo${tld}`} />
        </div>

        {activeNote && (
          <p className="mt-4 inline-block border border-ink/30 bg-paper-dim/60 px-2.5 py-1 font-mono text-[11px] text-ink-soft">
            ⓘ {activeNote}
          </p>
        )}

        <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-soft">
          "4 anos" = 1º ano + 3 renovações. dólar a R${' '}
          {USD_BRL.toFixed(2).replace('.', ',')} + IOF de{' '}
          {(IOF * 100).toFixed(2).replace('.', ',')}% já convertidos. preços de
          referência — confirme no checkout.
        </p>
      </div>
    </section>
  )
}
