import { useState, type FormEvent } from 'react'
import { TLDS } from '../data'

interface Props {
  onSearch: (raw: string) => void
}

/** Manchete + busca. A manchete é a tese do produto: isca de 1º ano. */
export function Hero({ onSearch }: Props) {
  const [value, setValue] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim()) onSearch(value)
  }

  return (
    <section className="border-b-2 border-ink px-4 pb-10 pt-12 sm:px-8 sm:pt-16">
      <div className="mx-auto max-w-5xl">
        <p className="rise stretch-cond font-mono text-xs uppercase tracking-[0.3em] text-ink-soft">
          comparador de domínios · Brasil · set/2026
        </p>

        <h1 className="rise stretch-wide mt-5 font-display text-[clamp(2.4rem,7.5vw,5.6rem)] font-black leading-[0.95] tracking-tight">
          O 1º ano custa R$&nbsp;4,99.
          <br />
          <span className="text-alert">
            A renovação, R$&nbsp;249,90.
          </span>
        </h1>

        <p className="rise mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          O Dominômetro compara registro <em className="not-italic text-ink">e</em>{' '}
          renovação nos registradores mais usados no Brasil — em reais, com IOF e
          câmbio já na conta — e confere se o domínio está livre direto no
          registro oficial (RDAP).
        </p>

        <form
          onSubmit={submit}
          role="search"
          className="rise mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="domain-search" className="sr-only">
            Buscar domínio
          </label>
          <input
            id="domain-search"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="minhaloja.com.br"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 border-2 border-ink bg-paper px-4 py-3.5 font-mono text-lg shadow-[4px_4px_0_0_#14170f] outline-none transition-shadow placeholder:text-ink-soft focus:shadow-[6px_6px_0_0_#14170f] focus-visible:ring-2 focus-visible:ring-brblue"
          />
          <button
            type="submit"
            className="border-2 border-ink bg-tag px-6 py-3.5 font-mono text-base font-bold uppercase tracking-wider shadow-[4px_4px_0_0_#14170f] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#14170f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brblue focus-visible:ring-offset-2 active:translate-y-0 active:shadow-[2px_2px_0_0_#14170f]"
          >
            comparar ↓
          </button>
        </form>

        <div className="rise mt-5 flex flex-wrap items-center gap-2">
          <span className="stretch-cond font-mono text-[11px] uppercase tracking-widest text-ink-soft">
            ou teste:
          </span>
          {['.com.br', '.com', '.dev', '.io', '.ai', '.app', '.store', '.online', '.xyz', '.pro'].map((tld) => (
            <button
              key={tld}
              type="button"
              aria-label={`buscar exemplo minhaloja${tld}`}
              onClick={() => {
                setValue(`minhaloja${tld}`)
                onSearch(`minhaloja${tld}`)
              }}
              className="border border-ink/25 bg-paper-dim/50 px-2.5 py-1 font-mono text-xs transition-colors hover:border-ink hover:bg-tag focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brblue"
            >
              {tld}
            </button>
          ))}
          <a
            href="#panorama"
            className="font-mono text-xs text-ink-soft underline decoration-ink/30 underline-offset-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brblue"
          >
            +{TLDS.length - 10} extensões no panorama ↓
          </a>
        </div>
      </div>
    </section>
  )
}
