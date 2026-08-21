import type { I18nText, Locale } from './profile';

/**
 * Articles published on LinkedIn, mirrored here as cards + a dedicated page.
 *
 * Maintained by hand. LinkedIn offers no usable automation for this: the Posts
 * API permission (`r_member_social`) is closed to new applications, the Member
 * Data Portability API is restricted to the EEA and Switzerland, and the public
 * author/activity listings answer HTTP 999 to any bot. Individual `/pulse/`
 * pages DO serve full OpenGraph metadata unauthenticated, so if this list ever
 * outgrows hand-editing, a script that reads `og:title` / `og:description` /
 * `og:image` from a pasted URL is the shortest path to semi-automating it.
 *
 * Covers are pulled from the LinkedIn article once and stored under
 * `public/articles/`. Hotlinking media.licdn.com does work, but it makes every
 * card depend on a signed third-party URL for as long as the site is up; a
 * ~50 KB local file is cheaper than that dependency.
 */
export interface Article {
  /** URL-safe id — also the hash route: #/articles/<slug>. */
  slug: string;
  title: I18nText;
  /** One-paragraph pitch shown on the card. */
  summary: I18nText;
  /** ISO date of publication, used for ordering and display. */
  date: string;
  /** Minutes, as a reading-time hint. */
  readingMinutes: number;
  url: string;
  cover: string;
  tags: string[];
  /** Pulls the card to the top of the list regardless of date. */
  featured?: boolean;
}

export const articles: Article[] = [
  {
    slug: 'parity-driven-development',
    title: {
      pt: 'Como parei de "torcer" pra IA acertar um refactor e comecei a exigir prova',
      en: 'How I stopped "hoping" AI would get a refactor right and started demanding proof',
    },
    summary: {
      pt: 'Um sistema legado parado há dois anos, um refactor de PHP para Bun/TypeScript e a pergunta que ninguém sabia responder: como provar que o novo faz exatamente o que o antigo fazia? A resposta virou o Parity-Driven Development, hoje parte do fluxo de migração do time.',
      en: 'A legacy system stalled for two years, a refactor from PHP to Bun/TypeScript, and the question nobody could answer: how do you prove the new one does exactly what the old one did? The answer became Parity-Driven Development, now part of the team migration flow.',
    },
    date: '2026-04-08',
    readingMinutes: 9,
    url: 'https://www.linkedin.com/pulse/como-parei-de-torcer-pra-ia-acertar-um-refactor-e-comecei-soares--gvucf',
    cover: '/articles/parity-driven-development.jpg',
    tags: ['PDD', 'Refactor', 'IA assistida', 'Bun'],
    featured: true,
  },
  {
    slug: 'claude-escola-particular',
    title: {
      pt: 'Como transformei o Claude em uma escola particular e tenho prova concreta disso',
      en: 'How I turned Claude into a private school, and have concrete proof of it',
    },
    summary: {
      pt: 'Leitura passiva não fixa nada. Construí um sistema de estudos onde o conteúdo que eu leio vira pergunta, a pergunta vira resposta minha e a resposta vira métrica de progresso. O resultado é o learning.blpsoares.dev, open source e parte do meu dia.',
      en: 'Passive reading sticks to nothing. I built a study system where what I read becomes a question, the question becomes my answer, and the answer becomes a progress metric. The result is learning.blpsoares.dev, open source and part of my daily routine.',
    },
    date: '2026-03-23',
    readingMinutes: 7,
    url: 'https://www.linkedin.com/pulse/como-transformei-o-claude-em-uma-escola-particular-e-tenho-soares--pylvf',
    cover: '/articles/claude-escola-particular.jpg',
    tags: ['Claude', 'MCP', 'Aprendizado', 'Open Source'],
  },
];

const pick = (text: I18nText, locale: Locale) => text[locale];

/** Featured first, then newest first. */
export const buildArticles = (l: Locale) =>
  [...articles]
    .sort((a, b) => {
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
      return b.date.localeCompare(a.date);
    })
    .map((a) => ({
      slug: a.slug,
      title: pick(a.title, l),
      summary: pick(a.summary, l),
      date: a.date,
      readingMinutes: a.readingMinutes,
      url: a.url,
      cover: a.cover,
      tags: a.tags,
      featured: !!a.featured,
    }));
