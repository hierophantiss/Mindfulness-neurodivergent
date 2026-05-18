import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../hooks/useLanguage';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE_EN = 'Awareness Gateway - Mindfulness for Neurodivergent Minds';
const DEFAULT_TITLE_EL = 'Awareness Gateway - Ενσυνειδητότητα για Νευροδιαφορετικούς';
const DEFAULT_DESC_EN = 'Trauma-informed mindfulness guide for ADHD & Autism.';
const DEFAULT_DESC_EL = 'Trauma-informed οδηγός ενσυνειδητότητας για ΔΕΠΥ & Αυτισμό.';
const DEFAULT_KW_EN = 'mindfulness, meditation, ADHD, autism, neurodivergent';
const DEFAULT_KW_EL = 'ενσυνειδητότητα, ΔΕΠΥ, αυτισμός, διαλογισμός, νευροδιαφορετικότητα';

export const SEO: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const path = location.pathname;

  let titleEn = DEFAULT_TITLE_EN;
  let titleEl = DEFAULT_TITLE_EL;

  if (path.includes('/dashboard')) {
    titleEn = 'Dashboard | ' + DEFAULT_TITLE_EN;
    titleEl = 'Ταμπλό | ' + DEFAULT_TITLE_EL;
  } else if (path.includes('/method')) {
    titleEn = 'Method | ' + DEFAULT_TITLE_EN;
    titleEl = 'Μέθοδος | ' + DEFAULT_TITLE_EL;
  } else if (path.includes('/practice')) {
    titleEn = 'Practice | ' + DEFAULT_TITLE_EN;
    titleEl = 'Πρακτική | ' + DEFAULT_TITLE_EL;
  } else if (path.includes('/chapters')) {
    titleEn = 'Knowledge | ' + DEFAULT_TITLE_EN;
    titleEl = 'Γνώση | ' + DEFAULT_TITLE_EL;
  }

  const title = language === 'en' ? titleEn : titleEl;
  const description = language === 'en' ? DEFAULT_DESC_EN : DEFAULT_DESC_EL;
  const keywords = language === 'en' ? DEFAULT_KW_EN : DEFAULT_KW_EL;

  const baseUrl = 'https://neurodivergent-mindfulness.org';
  const enUrl = `${baseUrl}/en${path === '/' ? '' : path}`;
  const elUrl = `${baseUrl}/el${path === '/' ? '' : path}`;

  return (
    <Helmet>
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={`${baseUrl}${path}`} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="el" href={elUrl} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${path}`} />
    </Helmet>
  );
};
