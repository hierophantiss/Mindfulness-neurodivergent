# Mindfulness for Neurodivergent Minds

Δωρεάν, διγλωσσική (ελληνικά / αγγλικά) εφαρμογή mindfulness και εργασιακό
βιβλίο, φτιαγμένα για νευροδιαφορετικούς ανθρώπους. Ζει στο
[neurodivergent-mindfulness.org](https://neurodivergent-mindfulness.org).

- Χωρίς λογαριασμούς, χωρίς παρακολούθηση. Τα δεδομένα μένουν στη συσκευή
  (localStorage).
- Προσβάσιμη: μεγάλα μεγέθη, γραμματοσειρά OpenDyslexic, σχεδιασμός με
  trauma-informed προσέγγιση.
- Εγκατάσταση ως PWA και λειτουργία χωρίς σύνδεση.

## Τεχνολογίες

- React 19 + TypeScript, Vite 6, Tailwind CSS 4
- React Router για την πλοήγηση, prerender για SEO (διαδρομές στο
  `src/prerender-paths.json`)
- PWA μέσω `vite-plugin-pwa`
- Android μέσω Capacitor (`capacitor.config.ts`, φάκελος `android/`)
- Deploy σε Cloudflare Pages (`public/_headers`, `public/_redirects`, `CNAME`)

## Δομή

```
src/          κώδικας εφαρμογής (pages, components, data, hooks, contexts)
src/data/     περιεχόμενο: κεφάλαια, έννοιες, μαθήματα (EL/EN), videos
book/         τα master του εργασιακού βιβλίου (markdown + εικόνες)
tools/        παραγωγή PDF και EPUB από το markdown του βιβλίου
scripts/      generate-sitemap.ts, prerender.ts
public/       στατικά αρχεία, PDF/EPUB του βιβλίου, manifest, sitemap
```

## Εκτέλεση τοπικά

Προαπαιτούμενο: Node.js.

```bash
npm install
npm run dev       # http://localhost:3000
```

Η εφαρμογή δεν χρειάζεται API keys ή μεταβλητές περιβάλλοντος.

## Σενάρια

| Εντολή | Τι κάνει |
|---|---|
| `npm run dev` | Τοπικός server (Express + Vite) στη θύρα 3000 |
| `npm run build` | Sitemap, build Vite, prerender, και bundle του server |
| `npm run preview` | Προεπισκόπηση του build |
| `npm run lint` | Έλεγχος τύπων (`tsc --noEmit`) |
| `npm test` | Tests (Vitest) |

## Android

```bash
npm run build
npx cap sync android
```

Μετά ανοίγεις το `android/` στο Android Studio.

## Το βιβλίο (PDF και EPUB)

Τα master είναι τα `book/workbook_el.md` και `book/workbook_en.md`. Τα PDF και
EPUB στο `public/` παράγονται από αυτά. Οι οδηγίες και οι εντολές build είναι
στο [`tools/README.md`](tools/README.md). Οι διορθώσεις γίνονται πάντα στο
markdown.
