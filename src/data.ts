// ---------------------------------------------------------------------------
// Dominômetro — dados do tracker
// Preços de referência coletados manualmente (set/2026). Sem backend: tudo
// estático e determinístico. Atualize a tabela abaixo para "reprecificar".
// ---------------------------------------------------------------------------

// Câmbio e imposto aplicados aos registradores que cobram em dólar.
// IOF em operações de crédito internacional cai 1 p.p./ano até zerar em 2029:
// 4,38% em 2025 → 3,38% em 2026 → 2,38% em 2027… (Decreto 11.153/2022).
export const USD_BRL = 5.34
export const IOF = 0.0338

export type Currency = 'BRL' | 'USD'

export interface Registrar {
  id: string
  name: string
  currency: Currency
  /** selo curto exibido na linha */
  note?: string
  link: (domain: string) => string
}

export const REGISTRARS: Record<string, Registrar> = {
  registrobr: {
    id: 'registrobr',
    name: 'Registro.br',
    currency: 'BRL',
    note: 'oficial do .br — pede CPF/CNPJ',
    link: (d) => `https://registro.br/cgi-bin/nicbr/busca.cgi?Dominio=${encodeURIComponent(d)}`,
  },
  cloudflare: {
    id: 'cloudflare',
    name: 'Cloudflare',
    currency: 'USD',
    note: 'preço de custo, sem markup',
    link: () => 'https://www.cloudflare.com/products/registrar/',
  },
  porkbun: {
    id: 'porkbun',
    name: 'Porkbun',
    currency: 'USD',
    link: (d) => `https://porkbun.com/checkout/search?q=${encodeURIComponent(d)}`,
  },
  dynadot: {
    id: 'dynadot',
    name: 'Dynadot',
    currency: 'USD',
    link: (d) => `https://www.dynadot.com/domain/search?domain=${encodeURIComponent(d)}`,
  },
  namecheap: {
    id: 'namecheap',
    name: 'Namecheap',
    currency: 'USD',
    link: (d) =>
      `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(d)}`,
  },
  godaddy: {
    id: 'godaddy',
    name: 'GoDaddy',
    currency: 'BRL',
    note: 'cobre em R$, renovação salgada',
    link: (d) => `https://br.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(d)}`,
  },
  hostinger: {
    id: 'hostinger',
    name: 'Hostinger',
    currency: 'BRL',
    note: 'cobre em R$',
    link: () => 'https://www.hostinger.com.br/registro-de-dominio',
  },
  hostgator: {
    id: 'hostgator',
    name: 'HostGator',
    currency: 'BRL',
    note: 'cobre em R$',
    link: () => 'https://www.hostgator.com.br/registro-de-dominio/',
  },
  locaweb: {
    id: 'locaweb',
    name: 'Locaweb',
    currency: 'BRL',
    note: 'cobre em R$',
    link: () => 'https://www.locaweb.com.br/registro-de-dominio-web/',
  },
}

export interface TldRow {
  tld: string
  /** registrar id → [1º ano, renovação anual] na moeda do registrador */
  prices: Record<string, [number, number]>
  /** aviso curto exibido junto às ofertas (ex.: mínimo de anos, restrições) */
  note?: string
}

// ---------------------------------------------------------------------------
// Extensões .br secundárias — todas vendidas só pelo Registro.br, a R$ 40/ano.
// ---------------------------------------------------------------------------

const BR_ONLY: string[] = [
  '.net.br', '.org.br', '.app.br', '.dev.br', '.art.br', '.tec.br', '.seg.br',
  '.log.br', '.adv.br', '.ind.br', '.inf.br', '.eco.br', '.mus.br', '.pro.br',
  '.tur.br', '.rec.br', '.srv.br', '.tv.br', '.fm.br', '.wiki.br',
]

const BR_ROW = (tld: string): TldRow => ({
  tld,
  note: 'só o Registro.br vende — preço fixo, sem promoção nem pegadinha',
  prices: { registrobr: [40, 40] },
})

// ---------------------------------------------------------------------------
// Tabela principal. [1º ano, renovação] na moeda de cobrança do registrador.
// ---------------------------------------------------------------------------

export const TLDS: TldRow[] = [
  {
    tld: '.com',
    prices: {
      cloudflare: [10.44, 10.44],
      porkbun: [10.37, 11.24],
      dynadot: [9.99, 11.19],
      namecheap: [11.28, 15.88],
      godaddy: [24.99, 129.99],
      hostinger: [9.99, 74.99],
      hostgator: [54.9, 89.9],
      locaweb: [49.9, 79.9],
    },
  },
  {
    tld: '.com.br',
    prices: {
      registrobr: [40, 40],
      hostinger: [6.99, 54.99],
      godaddy: [11.99, 74.99],
      hostgator: [39.9, 69.9],
      locaweb: [40, 60],
    },
  },
  {
    tld: '.net',
    prices: {
      cloudflare: [11.22, 11.22],
      porkbun: [11.78, 12.56],
      dynadot: [9.99, 11.99],
      namecheap: [12.98, 14.98],
      godaddy: [21.99, 124.99],
      hostinger: [49.9, 69.9],
      hostgator: [69.9, 99.9],
      locaweb: [59.9, 89.9],
    },
  },
  {
    tld: '.org',
    prices: {
      cloudflare: [10.11, 10.11],
      porkbun: [9.13, 12.77],
      dynadot: [8.99, 12.99],
      namecheap: [7.48, 14.98],
      godaddy: [9.99, 114.99],
      hostinger: [39.9, 69.9],
      hostgator: [69.9, 99.9],
      locaweb: [59.9, 89.9],
    },
  },
  {
    tld: '.dev',
    prices: {
      cloudflare: [12.4, 12.4],
      porkbun: [12.15, 14.24],
      dynadot: [11.99, 14.99],
      namecheap: [12.98, 17.98],
      godaddy: [44.99, 109.99],
      hostinger: [49.9, 79.9],
    },
  },
  {
    tld: '.io',
    prices: {
      cloudflare: [45.0, 45.0],
      porkbun: [36.78, 47.68],
      dynadot: [38.99, 45.99],
      namecheap: [39.98, 44.98],
      godaddy: [129.99, 329.99],
      hostinger: [199.9, 239.9],
    },
  },
  {
    tld: '.app',
    prices: {
      cloudflare: [14.17, 14.17],
      porkbun: [13.48, 15.52],
      dynadot: [13.99, 16.99],
      namecheap: [12.98, 16.98],
      godaddy: [54.99, 109.99],
      hostinger: [49.9, 79.9],
    },
  },
  {
    tld: '.ai',
    note: 'mínimo de 2 anos — o registro de Anguila cobra por biênio',
    prices: {
      cloudflare: [74.0, 74.0],
      porkbun: [67.5, 74.5],
      dynadot: [69.99, 79.99],
      namecheap: [68.98, 79.98],
      godaddy: [349.99, 649.99],
    },
  },
  {
    tld: '.so',
    prices: {
      porkbun: [30.56, 35.79],
      dynadot: [31.99, 37.99],
      namecheap: [32.98, 38.98],
      godaddy: [129.99, 279.99],
    },
  },
  {
    tld: '.inc',
    note: 'TLD premium — preço alto de propósito, não é erro',
    prices: {
      namecheap: [1098.98, 1298.98],
      godaddy: [2999.99, 4999.99],
    },
  },
  {
    tld: '.ink',
    prices: {
      porkbun: [12.55, 15.62],
      namecheap: [13.98, 16.98],
      godaddy: [59.99, 199.99],
    },
  },
  {
    tld: '.one',
    prices: {
      porkbun: [9.87, 13.42],
      namecheap: [9.98, 15.98],
      godaddy: [24.99, 94.99],
    },
  },
  {
    tld: '.pro',
    prices: {
      porkbun: [4.55, 24.31],
      dynadot: [5.99, 23.99],
      namecheap: [5.98, 25.98],
      godaddy: [19.99, 139.99],
      locaweb: [49.9, 89.9],
    },
  },
  {
    tld: '.vip',
    prices: {
      porkbun: [5.13, 17.59],
      dynadot: [3.99, 16.99],
      namecheap: [3.98, 17.98],
      godaddy: [9.99, 89.99],
      hostinger: [14.99, 74.99],
    },
  },
  {
    tld: '.store',
    prices: {
      porkbun: [1.28, 46.13],
      dynadot: [1.49, 39.99],
      namecheap: [1.98, 46.98],
      godaddy: [4.99, 249.99],
      hostinger: [4.99, 199.9],
      hostgator: [9.9, 219.9],
    },
  },
  {
    tld: '.online',
    prices: {
      porkbun: [1.09, 37.44],
      dynadot: [1.49, 34.99],
      namecheap: [1.28, 39.98],
      godaddy: [2.99, 199.99],
      hostinger: [5.99, 179.9],
      hostgator: [19.9, 109.9],
      locaweb: [19.9, 99.9],
    },
  },
  {
    tld: '.xyz',
    prices: {
      porkbun: [1.98, 12.93],
      dynadot: [1.99, 11.99],
      namecheap: [1.88, 12.98],
      godaddy: [4.99, 99.99],
      hostinger: [4.99, 69.9],
      hostgator: [9.9, 89.9],
    },
  },
  {
    tld: '.site',
    prices: {
      porkbun: [1.19, 33.39],
      dynadot: [1.49, 29.99],
      namecheap: [0.98, 29.98],
      godaddy: [2.99, 179.99],
      hostinger: [4.99, 119.9],
      hostgator: [9.9, 129.9],
    },
  },
  {
    tld: '.info',
    prices: {
      porkbun: [3.68, 28.06],
      dynadot: [3.99, 24.99],
      namecheap: [3.98, 26.98],
      godaddy: [19.99, 139.99],
      locaweb: [29.9, 89.9],
    },
  },
  {
    tld: '.me',
    prices: {
      porkbun: [8.33, 20.95],
      dynadot: [5.99, 19.99],
      namecheap: [4.98, 21.98],
      godaddy: [9.99, 119.99],
      hostinger: [19.9, 69.9],
    },
  },
  {
    tld: '.co',
    prices: {
      porkbun: [28.47, 33.79],
      dynadot: [26.99, 31.99],
      namecheap: [29.98, 33.98],
      godaddy: [69.99, 169.99],
      hostinger: [89.9, 149.9],
    },
  },
  {
    tld: '.tv',
    prices: {
      porkbun: [33.31, 36.64],
      namecheap: [32.98, 39.98],
      godaddy: [99.99, 199.99],
    },
  },
  {
    tld: '.cc',
    prices: {
      porkbun: [10.75, 13.19],
      namecheap: [10.98, 15.98],
      godaddy: [39.99, 109.99],
    },
  },
  {
    tld: '.biz',
    prices: {
      porkbun: [15.15, 18.89],
      namecheap: [12.98, 19.98],
      godaddy: [49.99, 119.99],
      locaweb: [59.9, 99.9],
    },
  },
  {
    tld: '.name',
    prices: {
      porkbun: [11.12, 12.8],
      namecheap: [10.98, 12.98],
      godaddy: [34.99, 79.99],
    },
  },
  {
    tld: '.us',
    prices: {
      porkbun: [7.83, 12.02],
      namecheap: [3.98, 12.98],
      godaddy: [9.99, 109.99],
    },
  },
  {
    tld: '.ca',
    prices: {
      porkbun: [11.11, 14.01],
      namecheap: [11.98, 13.98],
      godaddy: [39.99, 69.99],
    },
  },
  {
    tld: '.in',
    prices: {
      porkbun: [7.52, 10.62],
      namecheap: [6.98, 10.98],
      godaddy: [19.99, 49.99],
    },
  },
  {
    tld: '.mx',
    prices: {
      porkbun: [38.96, 51.96],
      namecheap: [39.98, 51.98],
    },
  },
  {
    tld: '.eu',
    prices: {
      porkbun: [6.94, 9.3],
      namecheap: [5.98, 9.98],
      godaddy: [14.99, 39.99],
    },
  },
  {
    tld: '.de',
    prices: {
      porkbun: [6.64, 8.29],
      namecheap: [5.98, 7.98],
      godaddy: [19.99, 39.99],
    },
  },
  {
    tld: '.fr',
    prices: {
      porkbun: [10.95, 12.99],
      namecheap: [9.98, 12.98],
      godaddy: [29.99, 59.99],
    },
  },
  {
    tld: '.it',
    prices: {
      porkbun: [9.41, 11.73],
      namecheap: [8.98, 10.98],
    },
  },
  {
    tld: '.es',
    prices: {
      porkbun: [9.95, 11.86],
      namecheap: [8.98, 10.98],
    },
  },
  {
    tld: '.nl',
    prices: {
      porkbun: [11.14, 13.27],
      namecheap: [9.98, 12.98],
    },
  },
  {
    tld: '.ch',
    prices: {
      porkbun: [16.99, 19.99],
      namecheap: [14.98, 18.98],
    },
  },
  {
    tld: '.pt',
    prices: {
      namecheap: [11.98, 14.98],
      godaddy: [34.99, 79.99],
    },
  },
  {
    tld: '.lat',
    note: 'TLD da América Latina — identidade regional',
    prices: {
      porkbun: [31.36, 35.62],
      namecheap: [29.98, 34.98],
    },
  },
  {
    tld: '.rio',
    note: 'a extensão oficial da cidade do Rio de Janeiro',
    prices: {
      namecheap: [44.98, 49.98],
      godaddy: [159.99, 269.99],
    },
  },
  {
    tld: '.nyc',
    note: 'exige endereço em Nova York',
    prices: {
      porkbun: [25.41, 29.3],
      namecheap: [24.98, 28.98],
    },
  },
  {
    tld: '.london',
    prices: {
      porkbun: [31.92, 36.85],
      namecheap: [29.98, 34.98],
    },
  },
  {
    tld: '.miami',
    prices: {
      porkbun: [16.56, 21.56],
      namecheap: [14.98, 19.98],
    },
  },
  {
    tld: '.vegas',
    prices: {
      porkbun: [19.88, 24.87],
      namecheap: [18.98, 22.98],
    },
  },
  {
    tld: '.club',
    prices: {
      porkbun: [12.38, 18.44],
      dynadot: [2.49, 14.99],
      namecheap: [2.98, 15.98],
      godaddy: [19.99, 94.99],
    },
  },
  {
    tld: '.fun',
    prices: {
      porkbun: [0.99, 30.76],
      namecheap: [1.48, 30.98],
      godaddy: [4.99, 159.99],
    },
  },
  {
    tld: '.space',
    prices: {
      porkbun: [0.99, 27.31],
      namecheap: [1.18, 25.98],
      godaddy: [2.99, 119.99],
    },
  },
  {
    tld: '.icu',
    prices: {
      porkbun: [2.0, 15.19],
      namecheap: [1.98, 15.98],
      godaddy: [9.99, 79.99],
    },
  },
  {
    tld: '.cyou',
    prices: {
      porkbun: [1.98, 12.25],
      namecheap: [1.88, 11.98],
    },
  },
  {
    tld: '.sbs',
    prices: {
      porkbun: [1.49, 10.22],
      namecheap: [1.28, 9.98],
    },
  },
  {
    tld: '.cfd',
    prices: {
      porkbun: [1.28, 10.91],
      namecheap: [1.18, 10.98],
    },
  },
  {
    tld: '.shop',
    prices: {
      porkbun: [1.78, 43.74],
      dynadot: [2.49, 40.99],
      namecheap: [1.98, 44.98],
      godaddy: [4.99, 199.99],
      hostinger: [4.99, 179.9],
    },
  },
  {
    tld: '.blog',
    prices: {
      porkbun: [8.26, 32.31],
      dynadot: [7.99, 31.99],
      namecheap: [8.98, 33.98],
      godaddy: [34.99, 169.99],
    },
  },
  {
    tld: '.art',
    prices: {
      porkbun: [3.55, 19.97],
      dynadot: [3.49, 18.99],
      namecheap: [3.98, 19.98],
      godaddy: [9.99, 109.99],
    },
  },
  {
    tld: '.cloud',
    prices: {
      porkbun: [18.76, 23.04],
      namecheap: [21.98, 25.98],
      godaddy: [54.99, 139.99],
    },
  },
  {
    tld: '.digital',
    prices: {
      porkbun: [1.63, 34.63],
      namecheap: [1.98, 36.98],
      godaddy: [9.99, 179.99],
    },
  },
  {
    tld: '.page',
    prices: {
      porkbun: [10.95, 12.07],
      namecheap: [10.98, 13.98],
      godaddy: [24.99, 69.99],
    },
  },
  {
    tld: '.live',
    prices: {
      porkbun: [2.55, 31.83],
      namecheap: [2.98, 33.98],
      godaddy: [14.99, 159.99],
    },
  },
  {
    tld: '.news',
    prices: {
      porkbun: [10.14, 31.49],
      namecheap: [10.98, 33.98],
      godaddy: [44.99, 169.99],
    },
  },
  {
    tld: '.world',
    prices: {
      porkbun: [1.78, 37.98],
      namecheap: [1.98, 38.98],
      godaddy: [9.99, 179.99],
    },
  },
  {
    tld: '.life',
    prices: {
      porkbun: [1.99, 36.1],
      namecheap: [2.28, 36.98],
      godaddy: [9.99, 169.99],
    },
  },
  {
    tld: '.agency',
    prices: {
      porkbun: [2.78, 28.42],
      namecheap: [2.98, 31.98],
      godaddy: [9.99, 149.99],
    },
  },
  {
    tld: '.studio',
    prices: {
      porkbun: [16.67, 36.1],
      namecheap: [14.98, 34.98],
      godaddy: [59.99, 169.99],
    },
  },
  {
    tld: '.design',
    prices: {
      porkbun: [38.56, 53.15],
      namecheap: [39.98, 55.98],
      godaddy: [119.99, 269.99],
    },
  },
  {
    tld: '.email',
    prices: {
      porkbun: [4.95, 28.42],
      namecheap: [5.98, 31.98],
      godaddy: [19.99, 139.99],
    },
  },
  {
    tld: '.today',
    prices: {
      porkbun: [2.95, 25.89],
      namecheap: [3.48, 27.98],
      godaddy: [14.99, 129.99],
    },
  },
  {
    tld: '.link',
    prices: {
      porkbun: [4.98, 12.21],
      namecheap: [5.98, 12.98],
      godaddy: [9.99, 59.99],
    },
  },
  {
    tld: '.click',
    prices: {
      porkbun: [1.98, 13.11],
      namecheap: [2.48, 13.98],
    },
  },
  {
    tld: '.work',
    prices: {
      porkbun: [8.93, 11.19],
      namecheap: [8.98, 11.98],
      godaddy: [24.99, 54.99],
    },
  },
  {
    tld: '.top',
    prices: {
      porkbun: [2.13, 9.33],
      namecheap: [1.98, 9.98],
      godaddy: [4.99, 49.99],
    },
  },
  {
    tld: '.lol',
    prices: {
      porkbun: [1.98, 32.24],
      namecheap: [2.28, 33.98],
      godaddy: [9.99, 169.99],
    },
  },
  {
    tld: '.zip',
    prices: {
      porkbun: [11.15, 13.97],
      namecheap: [11.98, 15.98],
      godaddy: [34.99, 74.99],
    },
  },
  {
    tld: '.mov',
    prices: {
      porkbun: [11.75, 13.99],
      namecheap: [12.98, 15.98],
    },
  },
  {
    tld: '.wiki',
    prices: {
      porkbun: [10.36, 28.53],
      namecheap: [9.98, 29.98],
      godaddy: [34.99, 139.99],
    },
  },
  {
    tld: '.how',
    prices: {
      porkbun: [26.02, 30.26],
      namecheap: [24.98, 29.98],
    },
  },
  {
    tld: '.academy',
    prices: {
      porkbun: [15.49, 40.11],
      namecheap: [14.98, 41.98],
      godaddy: [54.99, 189.99],
    },
  },
  {
    tld: '.education',
    prices: {
      porkbun: [12.69, 32.31],
      namecheap: [10.98, 33.98],
      godaddy: [44.99, 169.99],
    },
  },
  {
    tld: '.school',
    prices: {
      porkbun: [12.69, 33.9],
      namecheap: [10.98, 35.98],
    },
  },
  {
    tld: '.legal',
    prices: {
      porkbun: [10.62, 64.7],
      namecheap: [9.98, 66.98],
      godaddy: [34.99, 299.99],
    },
  },
  {
    tld: '.cafe',
    prices: {
      porkbun: [10.62, 40.11],
      namecheap: [9.98, 40.98],
      godaddy: [34.99, 189.99],
    },
  },
  {
    tld: '.rest',
    prices: {
      namecheap: [26.98, 29.98],
      porkbun: [28.09, 31.12],
    },
  },
  {
    tld: '.bar',
    prices: {
      porkbun: [62.64, 75.27],
      namecheap: [59.98, 78.98],
    },
  },
  {
    tld: '.pizza',
    prices: {
      porkbun: [36.01, 58.17],
      namecheap: [38.98, 59.98],
      godaddy: [129.99, 269.99],
    },
  },
  {
    tld: '.guru',
    prices: {
      porkbun: [4.03, 38.67],
      namecheap: [3.98, 38.98],
      godaddy: [19.99, 189.99],
    },
  },
  {
    tld: '.expert',
    prices: {
      porkbun: [7.06, 58.31],
      namecheap: [6.98, 59.98],
      godaddy: [29.99, 279.99],
    },
  },
  {
    tld: '.tips',
    prices: {
      porkbun: [10.14, 25.89],
      namecheap: [9.98, 27.98],
      godaddy: [34.99, 129.99],
    },
  },
  {
    tld: '.zone',
    prices: {
      porkbun: [2.55, 36.1],
      namecheap: [1.98, 38.98],
      godaddy: [9.99, 179.99],
    },
  },
  {
    tld: '.social',
    prices: {
      porkbun: [7.06, 36.1],
      namecheap: [6.98, 38.98],
      godaddy: [29.99, 169.99],
    },
  },
  {
    tld: '.media',
    prices: {
      porkbun: [5.06, 38.67],
      namecheap: [4.98, 40.98],
      godaddy: [19.99, 189.99],
    },
  },
  {
    tld: '.marketing',
    prices: {
      porkbun: [7.06, 38.67],
      namecheap: [6.98, 40.98],
      godaddy: [29.99, 189.99],
    },
  },
  {
    tld: '.software',
    prices: {
      porkbun: [12.94, 36.1],
      namecheap: [12.98, 37.98],
      godaddy: [49.99, 179.99],
    },
  },
  {
    tld: '.systems',
    prices: {
      porkbun: [6.64, 32.31],
      namecheap: [5.98, 33.98],
      godaddy: [29.99, 159.99],
    },
  },
  {
    tld: '.network',
    prices: {
      porkbun: [4.55, 31.9],
      namecheap: [3.98, 33.98],
      godaddy: [9.99, 169.99],
    },
  },
  {
    tld: '.center',
    prices: {
      porkbun: [9.63, 24.73],
      namecheap: [8.98, 26.98],
      godaddy: [34.99, 129.99],
    },
  },
  {
    tld: '.team',
    prices: {
      porkbun: [4.55, 35.01],
      namecheap: [3.98, 36.98],
      godaddy: [19.99, 169.99],
    },
  },
  {
    tld: '.events',
    prices: {
      porkbun: [7.06, 38.67],
      namecheap: [6.98, 38.98],
      godaddy: [29.99, 189.99],
    },
  },
  {
    tld: '.photo',
    prices: {
      porkbun: [11.51, 31.9],
      namecheap: [9.98, 33.98],
      godaddy: [39.99, 159.99],
    },
  },
  {
    tld: '.pics',
    prices: {
      porkbun: [1.61, 32.31],
      namecheap: [1.98, 32.98],
    },
  },
  {
    tld: '.solutions',
    prices: {
      porkbun: [5.06, 29.56],
      namecheap: [4.98, 30.98],
      godaddy: [19.99, 139.99],
    },
  },
  {
    tld: '.company',
    prices: {
      porkbun: [7.06, 13.45],
      namecheap: [6.98, 14.98],
      godaddy: [29.99, 69.99],
    },
  },
  {
    tld: '.global',
    prices: {
      porkbun: [33.71, 84.3],
      namecheap: [29.98, 86.98],
      godaddy: [99.99, 399.99],
    },
  },
  {
    tld: '.tech',
    prices: {
      porkbun: [4.98, 55.98],
      dynadot: [5.49, 51.99],
      namecheap: [5.98, 54.98],
      godaddy: [29.99, 299.99],
      hostinger: [9.99, 219.9],
    },
  },
  {
    tld: '.host',
    prices: {
      porkbun: [13.45, 36.93],
      namecheap: [12.98, 39.98],
      godaddy: [49.99, 189.99],
    },
  },
  ...BR_ONLY.map(BR_ROW),
]

// ---------------------------------------------------------------------------
// Cálculos
// ---------------------------------------------------------------------------

export interface Offer {
  registrar: Registrar
  tld: string
  /** preço do 1º ano em R$, já com IOF quando cobrado em dólar */
  firstYearBRL: number
  /** renovação anual em R$, já com IOF quando cobrado em dólar */
  renewalBRL: number
  /** custo de 2 anos de posse (1º ano + 1 renovação) em R$ */
  twoYearBRL: number
  /** custo de 4 anos de posse (1º ano + 3 renovações) em R$ */
  fourYearBRL: number
  /** renovação ≥ 3× o primeiro ano = pegadinha de promoção */
  trap: boolean
}

export function offersFor(tld: string): Offer[] {
  const row = TLDS.find((t) => t.tld === tld)
  if (!row) return []
  return Object.entries(row.prices).map(([id, [first, renew]]) => {
    const registrar = REGISTRARS[id]
    const mult = registrar.currency === 'USD' ? USD_BRL * (1 + IOF) : 1
    const firstYearBRL = first * mult
    const renewalBRL = renew * mult
    return {
      registrar,
      tld,
      firstYearBRL,
      renewalBRL,
      twoYearBRL: firstYearBRL + renewalBRL,
      fourYearBRL: firstYearBRL + renewalBRL * 3,
      trap: renewalBRL >= firstYearBRL * 3,
    }
  })
}

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// ---------------------------------------------------------------------------
// Busca
// ---------------------------------------------------------------------------

/** separa "minhaloja.com.br" → { name: 'minhaloja', tld: '.com.br' } */
export function parseQuery(raw: string): { name: string; tld: string } {
  const q = raw.trim().toLowerCase().replace(/\s+/g, '')
  const match = TLDS.map((t) => t.tld)
    .sort((a, b) => b.length - a.length)
    .find((t) => q.endsWith(t))
  if (!match) return { name: q, tld: '.com' }
  const name = q.slice(0, q.length - match.length)
  return { name, tld: match }
}

/** menores preços de 1º ano por TLD — alimenta a fita de preços */
export function tapeItems(): { tld: string; price: number; registrar: string }[] {
  return TLDS.map(({ tld }) => {
    const best = offersFor(tld).reduce((a, b) =>
      a.firstYearBRL <= b.firstYearBRL ? a : b,
    )
    return { tld, price: best.firstYearBRL, registrar: best.registrar.name }
  })
}

/** as N piores "armadilhas de renovação" (maior salto renovação ÷ 1º ano) */
export function worstTraps(n = 3): { tld: string; offer: Offer }[] {
  return TLDS.flatMap(({ tld }) =>
    offersFor(tld).map((offer) => ({ tld, offer })),
  )
    .filter(({ offer }) => offer.trap)
    .sort((a, b) => b.offer.renewalBRL / b.offer.firstYearBRL - a.offer.renewalBRL / a.offer.firstYearBRL)
    .slice(0, n)
}
