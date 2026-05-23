import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../hooks/useLanguage';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE_EN = 'Neurodivergent Mindfulness';
const DEFAULT_TITLE_EL = 'Neurodivergent Mindfulness';
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
  let descEn = 'A mindful sanctuary for neurodivergent individuals. Ground yourself with trauma-informed breathwork, sensory practices, and philosophical reflections.';
  let descEl = 'Ένα καταφύγιο ενσυνειδητότητας για νευροδιαφορετικά άτομα. Γειωθείτε με ασφαλείς πρακτικές αναπνοής, αισθητηριακή εστίαση και φιλοσοφικούς στοχασμούς.';

  if (path.includes('/dashboard')) {
    titleEn = 'Dashboard | ' + DEFAULT_TITLE_EN;
    titleEl = 'Ταμπλό | ' + DEFAULT_TITLE_EL;
    descEn = 'Track your mindfulness journey with a neurodivergent-friendly dashboard. Follow your daily progress, grounding practices, and meditation consistency.';
    descEl = 'Παρακολουθήστε την πορεία ενσυνειδητότητας με το ταμπλό. Δείτε την καθημερινή σας πρόοδο, τις πρακτικές γείωσης και τη συνέπεια στον διαλογισμό σας.';
  } else if (path.includes('/method')) {
    titleEn = 'Method | ' + DEFAULT_TITLE_EN;
    titleEl = 'Μέθοδος | ' + DEFAULT_TITLE_EL;
    descEn = 'Explore the theoretical foundations of neurodivergent mindfulness. Learn the trauma-informed framework that adapts meditation to ADHD and autistic needs.';
    descEl = 'Εξερευνήστε τις θεωρητικές βάσεις της νευροδιαφορετικής ενσυνειδητότητας. Μάθετε το ασφαλές πλαίσιο προσαρμογής του διαλογισμού σε ΔΕΠΥ και αυτισμό.';
  } else if (path.includes('/practice')) {
    titleEn = 'Practice | ' + DEFAULT_TITLE_EN;
    titleEl = 'Πρακτική | ' + DEFAULT_TITLE_EL;
    descEn = 'Engage in guided breathwork and grounding exercises. Practical, sensory-friendly mindfulness tools designed specifically for neurodivergent nervous systems.';
    descEl = 'Εφαρμόστε καθοδηγούμενη αναπνοή και ασκήσεις γείωσης. Πρακτικά, φιλικά προς τις αισθήσεις εργαλεία ενσυνειδητότητας για νευροδιαφορετικά νευρικά συστήματα.';
  } else if (path.includes('/chapters')) {
    titleEn = 'Knowledge | ' + DEFAULT_TITLE_EN;
    titleEl = 'Γνώση | ' + DEFAULT_TITLE_EL;
    descEn = 'Dive deeper into reflective reading focusing on philosophy and mental health. A sanctuary for deep thought, self-exploration, and neurodivergent thinking.';
    descEl = 'Εμβαθύνετε σε αναγνώσματα φιλοσοφίας και ψυχικής υγείας. Ένα ασφαλές καταφύγιο εστίασης για τον στοχασμό, την αυτοεξερεύνηση και τη νευροδιαφορετική σκέψη.';
  }

  const title = language === 'en' ? titleEn : titleEl;
  const description = language === 'en' ? descEn : descEl;
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
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${baseUrl}${path}`} />
      <meta property="og:image" content={`${baseUrl}/og-image.png`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Neurodivergent Mindfulness" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${baseUrl}/og-image.png`} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      <link rel="canonical" href={`${baseUrl}${path}`} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="el" href={elUrl} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${path}`} />
      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": title,
          "url": `${baseUrl}${path}`,
          "description": description,
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}
      </script>
    </Helmet>
  );
};
