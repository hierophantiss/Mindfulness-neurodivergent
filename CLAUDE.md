# Neurodivergent Mindfulness

The project's rules are in AGENTS.md (in Greek). Read them before any change:

@AGENTS.md

## Working on this repository

- `main` deploys straight to the live site (Cloudflare Pages) and, through it, to the
  Microsoft Store and Google Play apps. Work on a branch and open a pull request;
  the "Check" workflow (unit tests, build, browser checks) must pass.
- Two languages always (Greek and English). Colours only from the CSS variables in
  `src/index.css`. No Google Fonts, no tracking, nothing leaves the device unless the
  person does it (see `src/pages/Privacy.tsx`).
- Before pushing: `npm test`, `npm run build`, `npx playwright test`.
