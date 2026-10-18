import { Suspense, lazy, useState } from 'react'
import { parseQuery, REGISTRARS, TLDS } from './data'
import { Tape } from './components/Tape'
import { Hero } from './components/Hero'

const SearchResult = lazy(() =>
  import('./components/SearchResult').then((m) => ({ default: m.SearchResult })),
)
const Compare = lazy(() =>
  import('./components/Compare').then((m) => ({ default: m.Compare })),
)
const Tips = lazy(() =>
  import('./components/Tips').then((m) => ({ default: m.Tips })),
)

function SectionFallback() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <div className="animate-pulse rounded-xl border-2 border-ink/10 bg-ink/5 p-10" />
    </div>
  )
}

export default function App() {
  const [domain, setDomain] = useState<string | null>(null)

  const onSearch = (raw: string) => {
    const { name, tld } = parseQuery(raw)
    if (!name) return
    setDomain(`${name}${tld}`)
    requestAnimationFrame(() =>
      document.getElementById('resultado')?.scrollIntoView({ block: 'start' }),
    )
  }

  return (
    <div className="min-h-screen">
      <Tape />

      <header className="flex items-center justify-between border-b-2 border-ink bg-paper px-4 py-3 sm:px-8">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-2"
        >
          <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
            <path fill="#FFD500" d="M2 14.6 14.6 2H30v15.4L17.4 30z" />
            <circle cx="23" cy="9" r="3.4" fill="#14170F" />
          </svg>
          <span className="stretch-wide font-display text-xl font-black tracking-tight">
            dominômetro
          </span>
        </a>
        <nav
          aria-label="navegação principal"
          className="flex gap-5 font-mono text-xs font-semibold uppercase tracking-wider"
        >
          <a
            href="#panorama"
            className="transition-colors hover:text-good-deep focus-visible:ring-2 ring-brblue ring-offset-2"
          >
            panorama
          </a>
          <a
            href="#dicas"
            className="transition-colors hover:text-good-deep focus-visible:ring-2 ring-brblue ring-offset-2"
          >
            dicas
          </a>
        </nav>
      </header>

      <main>
        <Hero onSearch={onSearch} />
        {domain && (
          <Suspense fallback={<SectionFallback />}>
            <SearchResult key={domain} domain={domain} />
          </Suspense>
        )}
        <Suspense fallback={<SectionFallback />}>
          <Compare />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Tips />
        </Suspense>
      </main>

      <footer className="border-t-2 border-ink bg-ink px-4 py-10 text-paper sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="stretch-wide font-display text-3xl font-black tracking-tight">
              dominômetro<span className="text-tag">.</span>
            </p>
            <p className="mt-3 max-w-xs font-mono text-[11px] leading-relaxed text-paper/60">
              comparador de preço de domínio feito pra quem paga em real. sem
              backend, sem conta, sem cookie — abre e funciona.
            </p>
          </div>

          <div>
            <p className="stretch-cond font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-tag">
              como funciona
            </p>
            <ul className="mt-3 space-y-2 font-mono text-[11px] leading-relaxed text-paper/60">
              <li>· disponibilidade ao vivo via RDAP (registro oficial) e DNS</li>
              <li>· cobrança em dólar convertida com câmbio + IOF 2026</li>
              <li>· "armadilha" = renovação ≥ 3× o 1º ano</li>
            </ul>
          </div>

          <div>
            <p className="stretch-cond font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-tag">
              fontes
            </p>
            <ul className="mt-3 space-y-2 font-mono text-[11px] text-paper/60">
              {[
                ['bootstrap RDAP da IANA', 'https://data.iana.org/rdap/dns.json'],
                ['rdap.registro.br', 'https://rdap.registro.br'],
                ['google public dns', 'https://dns.google'],
              ].map(([label, url]) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (abre em nova aba)`}
                    className="underline decoration-paper/30 underline-offset-2 transition-colors hover:text-tag focus-visible:ring-2 ring-brblue ring-offset-2"
                  >
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-between gap-3 border-t border-paper/15 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper/70">
            {TLDS.length} extensões · {Object.keys(REGISTRARS).length}{' '}
            registradores · referência set/2026
          </p>
          <p className="font-mono text-[10px] text-paper/70">
            preços sujeitos a promoção e câmbio — confirme no checkout.
          </p>
        </div>
      </footer>
    </div>
  )
}
