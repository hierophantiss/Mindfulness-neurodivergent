// The <head> of a page for search engines and link previews: one shape and
// one way to write it, for the prerendered HTML (scripts/prerender.ts) and for
// the app when you move between pages (components/SEO.tsx). The words of each
// page are worked out once, at build time (scripts/seo-meta.ts), and written
// next to the page as JSON (seoJsonPath), which the app reads when it needs it.
// Light on purpose: no page data here.

export const SITE_URL = 'https://neurodivergent-mindfulness.org';

/** The app's name in each language, as in the manifests and the Store. */
export const SITE_NAME = { el: 'Ενσυνειδητότητα για Νευροδιαφορετικούς', en: 'Neurodivergent Mindfulness' } as const;
/** The book's name in each language, as on its cover. */
export const BOOK_NAME = { el: 'Οδηγός Ενσυνειδητότητας για Νευροδιαφορετικούς', en: 'A Mindfulness Guide for Neurodivergents' } as const;
/** The author's name in each language, as the books write it. */
export const AUTHOR_NAME = { el: 'Θεόδωρος Μπαϊρακτάρης', en: 'Theodoros Bairaktaris' } as const;

export const AUTHOR_ID = `${SITE_URL}/#author`;
export const BOOK_ID = `${SITE_URL}/#book`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const APP_ID = `${SITE_URL}/#app`;

export type Lang = 'el' | 'en';

export interface SeoHead {
  route: string;
  lang: Lang;
  title: string;
  description: string;
  noindex?: boolean;
  ogType: 'website' | 'article';
  canonical: string;
  alternates: { en: string; el: string; xDefault: string };
  jsonLd?: object;
}

/** A page's title with the app's name after it, unless that makes it longer than ~60 characters. */
export function withSiteName(title: string, lang: Lang, max = 60): string {
  const full = `${title} | ${SITE_NAME[lang]}`;
  return full.length <= max ? full : title;
}

/** Where the build writes a page's head: /el/chapters/1 → /seo/el/chapters/1.json ('/' → /seo/root.json). */
export function seoJsonPath(route: string): string {
  const clean = route.replace(/\/+$/, '') || '/';
  return clean === '/' ? '/seo/root.json' : `/seo${clean}.json`;
}

export const OG_IMAGE = `${SITE_URL}/og-image.png?v=3`;
const OG_ALT = {
  en: 'Mindfulness for neurodivergents – the sign of the Fourfold Axis: a blue circle, a gold triangle and axis, a rainbow infinity at the centre',
  el: 'Ενσυνειδητότητα για νευροδιαφορετικούς – το σήμα του Τετραπλού Άξονα: μπλε κύκλος, χρυσό τρίγωνο και άξονας, άπειρο σε ουράνιο τόξο στο κέντρο',
};

export type HeadTag =
  | { tag: 'title'; text: string }
  | { tag: 'meta'; attrs: Record<string, string> }
  | { tag: 'link'; attrs: Record<string, string> }
  | { tag: 'script'; attrs: Record<string, string>; text: string };

/** Every tag of the head, in order. */
export function headTags(h: SeoHead): HeadTag[] {
  const locale = h.lang === 'en' ? 'en_US' : 'el_GR';
  const other = h.lang === 'en' ? 'el_GR' : 'en_US';
  const tags: HeadTag[] = [
    { tag: 'title', text: h.title },
    { tag: 'meta', attrs: { name: 'description', content: h.description } },
    { tag: 'meta', attrs: { name: 'robots', content: h.noindex ? 'noindex, follow' : 'index, follow' } },
    { tag: 'meta', attrs: { name: 'author', content: AUTHOR_NAME[h.lang] } },
    { tag: 'meta', attrs: { property: 'og:title', content: h.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: h.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: h.canonical } },
    { tag: 'meta', attrs: { property: 'og:image', content: OG_IMAGE } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: OG_ALT[h.lang] } },
    { tag: 'meta', attrs: { property: 'og:type', content: h.ogType } },
    { tag: 'meta', attrs: { property: 'og:locale', content: locale } },
    { tag: 'meta', attrs: { property: 'og:locale:alternate', content: other } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: SITE_NAME[h.lang] } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: h.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: h.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: OG_IMAGE } },
    { tag: 'meta', attrs: { name: 'twitter:image:alt', content: OG_ALT[h.lang] } },
    { tag: 'link', attrs: { rel: 'canonical', href: h.canonical } },
    { tag: 'link', attrs: { rel: 'alternate', hreflang: 'en', href: h.alternates.en } },
    { tag: 'link', attrs: { rel: 'alternate', hreflang: 'el', href: h.alternates.el } },
    { tag: 'link', attrs: { rel: 'alternate', hreflang: 'x-default', href: h.alternates.xDefault } },
  ];
  if (h.jsonLd) {
    tags.push({ tag: 'script', attrs: { type: 'application/ld+json' }, text: JSON.stringify(h.jsonLd).replace(/</g, '\\u003c') });
  }
  return tags;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The head as HTML, each tag marked so the app knows it came with the page. */
export function headHtml(h: SeoHead, mark = 'data-seo="prerender"'): string {
  return headTags(h).map(t => {
    if (t.tag === 'title') return `<title ${mark}>${esc(t.text)}</title>`;
    const attrs = Object.entries(t.attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
    if (t.tag === 'script') return `<script ${mark} ${attrs}>${t.text}</script>`;
    return `<${t.tag} ${mark} ${attrs} />`;
  }).join('\n  ');
}
