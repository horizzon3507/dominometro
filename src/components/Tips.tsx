import { IOF, USD_BRL, brl, worstTraps } from '../data'

/** Três verdades do mercado brasileiro + as piores armadilhas de renovação. */
export function Tips() {
  const traps = worstTraps(3)

  return (
    <section id="dicas" className="px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="stretch-cond font-mono text-xs uppercase tracking-[0.3em] text-ink-soft">
          antes de comprar
        </p>
        <h2 className="stretch-wide mt-2 font-display text-3xl font-black tracking-tight sm:text-4xl">
          O que pesa no bolso brasileiro
        </h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <article className="border-2 border-ink bg-paper p-5 shadow-[4px_4px_0_0_#14170f]">
            <p className="stretch-cond font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-brblue">
              .com.br
            </p>
            <h3 className="stretch-wide mt-2 font-display text-xl font-extrabold tracking-tight">
              CPF ou CNPJ na mão
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Só o Registro.br (R$ 40/ano fixo) e parceiros vendem{' '}
              <code className="font-mono text-ink">.com.br</code>, com vínculo a
              CPF/CNPJ. Fora do país ninguém te vende esse TLD.
            </p>
          </article>

          <article className="border-2 border-ink bg-paper p-5 shadow-[4px_4px_0_0_#14170f]">
            <p className="stretch-cond font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-good-deep">
              câmbio + IOF
            </p>
            <h3 className="stretch-wide mt-2 font-display text-xl font-extrabold tracking-tight">
              Dólar morde {(IOF * 100).toFixed(2).replace('.', ',')}% a mais
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Cloudflare, Porkbun e Namecheap cobram em dólar: some o câmbio (R${' '}
              {USD_BRL.toFixed(2).replace('.', ',')}) e o IOF do cartão
              internacional. Todos os preços aqui já saem da conversa em reais.
            </p>
          </article>

          <article className="border-2 border-ink bg-paper p-5 shadow-[4px_4px_0_0_#14170f]">
            <p className="stretch-cond font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-alert-deep">
              pegadinha
            </p>
            <h3 className="stretch-wide mt-2 font-display text-xl font-extrabold tracking-tight">
              Promoção ≠ preço
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Domínio a R$ 5 no primeiro ano que renova a R$ 200 sai mais caro
              em 4 anos que um a R$ 60 fixo (R$ 605 vs R$ 240). Compare sempre
              a coluna "4 anos".
            </p>
          </article>
        </div>

        <div className="mt-8 border-2 border-alert bg-alert/5 p-5">
          <h3 className="stretch-wide font-display text-lg font-extrabold tracking-tight text-alert-deep">
            <span aria-hidden="true">⚠ </span>As piores armadilhas de renovação do momento
          </h3>
          <ul className="mt-3 divide-y divide-alert/20">
            {traps.map(({ tld, offer }) => (
              <li
                key={`${tld}-${offer.registrar.id}`}
                className="flex flex-wrap items-baseline justify-between gap-2 py-2.5 font-mono text-sm"
              >
                <span>
                  <strong className="font-bold">{tld}</strong> na{' '}
                  {offer.registrar.name}
                </span>
                <span className="text-ink-soft">
                  {brl(offer.firstYearBRL)} no 1º ano →{' '}
                  <strong className="font-bold text-alert-deep">
                    {brl(offer.renewalBRL)}
                  </strong>{' '}
                  na renovação ({Math.round(offer.renewalBRL / offer.firstYearBRL)}×)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
