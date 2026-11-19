import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../hooks/useLanguage';
import { useLocation } from 'react-router-dom';
import { SITE_URL, headTags, seoJsonPath, type SeoHead } from '../seo/head';

// The page's head (title, description, canonical, JSON-LD…) when you move
// between pages inside the app. The words are not kept here: the build
// works them out once (scripts/seo-meta.ts) and writes them both into each
// prerendered page and beside it as JSON, which is read from here. So the
// app and search engines always see the same head.

const cache = new Map<string, SeoHead | null>();

async function loadHead(route: string): Promise<SeoHead | null> {
  if (cache.has(route)) return cache.get(route)!;
  try {
    const res = await fetch(seoJsonPath(route), { headers: { Accept: 'application/json' } });
    const head = res.ok && (res.headers.get('content-type') || '').includes('json') ? (await res.json()) as SeoHead : null;
    cache.set(route, head);
    return head;
  } catch {
    // Offline: leave the head as it is.
    return null;
  }
}

export const SEO: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const lang = language === 'en' ? 'en' : 'el';
  // Router paths have the /en or /el prefix stripped (it is the basename).
  const cleanPath = location.pathname.replace(/^\/(en|el)(?=\/|$)/, '') || '/';
  const route = `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
  const canonicalUrl = `${SITE_URL}${route}`;

  // The bare root is the language-neutral entry: its HTML (the Greek home
  // page, x-default) stays as it came, whatever language the browser speaks.
  const isBareRoot = window.location.pathname.replace(/\/+$/, '') === '';

  // Pages built by scripts/prerender.ts already carry the right tags for
  // their address (marked data-seo="prerender"): those stay as they are, and
  // are replaced only once you move to another page or switch language.
  const prerenderedCanonical = document
    .querySelector('link[rel="canonical"][data-seo="prerender"]')?.getAttribute('href');
  const keepPrerendered = isBareRoot || prerenderedCanonical === canonicalUrl;

  const [head, setHead] = useState<SeoHead | null>(null);
  useEffect(() => {
    if (keepPrerendered) return;
    let alive = true;
    loadHead(route).then(h => {
      if (!alive || !h) return;
      // Only now, with the new head at hand, the old one goes.
      document.querySelectorAll('[data-seo="prerender"]').forEach(el => el.remove());
      setHead(h);
    });
    return () => { alive = false; };
  }, [route, keepPrerendered]);

  if (keepPrerendered || !head || head.route !== route) return null;

  return (
    <Helmet>
      {headTags(head).map((t, i) => {
        if (t.tag === 'title') return <title key={i}>{t.text}</title>;
        if (t.tag === 'script') return <script key={i} type={t.attrs.type}>{t.text}</script>;
        const attrs = Object.fromEntries(Object.entries(t.attrs).map(([k, v]) => [k === 'hreflang' ? 'hrefLang' : k, v]));
        return t.tag === 'meta' ? <meta key={i} {...attrs} /> : <link key={i} {...attrs} />;
      })}
    </Helmet>
  );
};
