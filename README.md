# dominômetro

preço de domínio sem pegadinha.

Comparador de preço de domínio para brasileiros — [dominios.hory.one](https://dominios.hory.one) · [repo](https://github.com/horizzon3507/dompricing)

## o que faz

- **busca um domínio** (ex.: `minhaloja.com.br`) e mostra disponibilidade ao vivo + preço em cada registrador.
- **disponibilidade ao vivo, sem backend:**
  - **RDAP** (sucessor do WHOIS): descobre o servidor autoritativo de cada TLD via [bootstrap da IANA](https://data.iana.org/rdap/dns.json) e pergunta direto ao registro. `404` = livre, `200` = registrado.
  - **DNS-over-HTTPS** (fallback): consulta `NS` via `dns.google` e `cloudflare-dns.com`. `NXDOMAIN` = provavelmente livre; resposta com `Answer` = registrado.
  - regra de desempate: domínio registrado sem NS ativo conta como **ocupado** — o nome não está à venda mesmo sem DNS.
- **tudo em reais, com imposto na conta:** cobrança em dólar convertida por `câmbio × (1 + IOF)`. Referência atual: dólar a **R$ 5,34** + **IOF 3,38%** (cartão internacional, 2026).
- **1º ano vs. renovação, lado a lado:** cada oferta mostra 1º ano, renovação/ano e custo de 4 anos (1º ano + 3 renovações). **armadilha** = renovação **≥ 3×** o 1º ano, sinalizada na interface.
- **panorama por TLD:** ~120 extensões (inclui as `.br` secundárias), ordenável por menor 1º ano, menor 4 anos ou menor renovação.
- **link direto ao checkout** de cada registrador, já com o domínio pesquisado.

| registrador | cobra em | observação |
| --- | --- | --- |
| Registro.br | R$ | oficial do `.br` — pede CPF/CNPJ, R$ 40/ano fixo |
| Cloudflare | US$ | preço de custo, sem markup |
| Porkbun | US$ | — |
| Dynadot | US$ | — |
| Namecheap | US$ | — |
| GoDaddy | R$ | renovação costuma ser salgada |
| Hostinger | R$ | — |
| HostGator | R$ | — |
| Locaweb | R$ | — |

## sem backend, sem conta, sem cookie

Site 100% estático: abre e funciona. Disponibilidade é consultada do seu navegador direto ao RDAP/DNS; preços são tabela local. Nada é enviado a servidor próprio porque não existe servidor próprio.

## stack

React 19 + Vite 8 + Tailwind CSS 4 · `oxlint` no lint · `vitest` nos testes.

## atualizar preços (reprecificar)

Tudo mora em `src/data.ts`. Referência atual: **set/2026**.

| o que | onde |
| --- | --- |
| câmbio | `USD_BRL` (hoje `5.34`) |
| IOF cartão internacional | `IOF` (hoje `0.0338`) |
| preços por TLD | `TLDS`: `[1º ano, renovação]` na moeda de cobrança do registrador |
| registradores e links de checkout | `REGISTRARS` |

Conversão aplicada em `offersFor()`: se o registrador cobra em dólar, `valor × USD_BRL × (1 + IOF)`; se cobra em real, entra direto. `.br` secundárias (`.net.br`, `.org.br`, …) são só Registro.br a R$ 40/ano — geradas via `BR_ROW`.

## dev

| comando | faz |
| --- | --- |
| `npm install` | instala dependências |
| `npm run dev` | sobe o ambiente local |
| `npm run build` | typecheck (`tsc -b`) + build de produção |
| `npm test` | roda os testes (`vitest run`) |
| `npm run lint` | roda o `oxlint` |

## aviso honesto

Preços coletados manualmente, sujeitos a promoção e variação de câmbio — confirme o valor final no checkout antes de pagar.
