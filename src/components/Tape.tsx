import { brl, tapeItems } from '../data'

/** Fita de pregão no topo — menor preço de 1º ano por TLD, rolando em loop. */
export function Tape() {
  const items = tapeItems()
  const strip = [...items, ...items]
  return (
    <div className="overflow-hidden bg-ink py-1.5 text-paper" aria-hidden="true">
      <div className="tape-track flex w-max items-center gap-8 whitespace-nowrap font-mono text-[11px] tracking-wide">
        {strip.map((it, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-tag">{it.tld}</span>
            <span>{brl(it.price)}/ano</span>
            <span className="uppercase text-paper/70">{it.registrar}</span>
            <span className="text-paper/25">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
