# Solatide — Client (storefront + admin hub)

Local working notes for AI assistants. **Not committed** (in `.gitignore`).
Sister repo: `../Server` (API). Both are released together with one version; the full project
notes and hard rules are in `../Server/CLAUDE.md` — they apply here too.

## Project (short)
- Australian research-peptide store. Client contact: **Gracie** (non-technical).
- Live checkout: **Order Request**. Analytics: M1 + M2 live; M3 visitor panel on
  `feat/analytics-m3` (not live). Release history: `CHANGELOG.md` (identical to Server's).

## Stack
React + Vite, Tailwind, React Router, lucide-react icons. One codebase, two builds:
- **Storefront** (`VITE_APP_ROLE=store`): **prerendered** with Puppeteer (`prerender.js`) into
  static HTML and **hydrated**; API data used by a page is embedded (`getRouteData`) so the first
  render matches the HTML. Deployed as atomic releases by `scripts/deploy-store.sh` (symlink switch).
- **Admin hub** (`VITE_APP_ROLE=admin`): `src/pages/admin`, `src/components/admin`,
  `src/layouts/AdminLayout.jsx`, routes in `src/routes/AdminRoutes.jsx`.
- API calls: `src/services/api.js` (`VITE_API_URL`). Storefront tracking: `src/utils/analytics.js`
  (batched events via `sendBeacon`, heartbeat, "left" signal, `sentAt` ordering).

## Hard rules (see ../Server/CLAUDE.md for the full list)
- Never commit, push, tag or merge — the user does. No AI attribution.
- Ports 5000 / 5173 are the user's dev servers; test servers use 5175 (store) / 5176 (admin)
  against a throwaway test API (5096–5099) on the Docker test DB only.
- Don't break the current flow; say what changes for customers/admins.

## Commands
```bash
npx eslint <changed files>   # lint what you touched (many files have older warnings; don't add new ones)
npx vite build               # build check
npm run build:store          # storefront build + prerender + SEO validation (needs an API)
npm run build:admin          # admin build
```
- Local check: `VITE_APP_ROLE=store VITE_API_URL=http://127.0.0.1:5099 npx vite --port 5175`
  (admin: `VITE_APP_ROLE=admin … --port 5176`), then drive with Puppeteer from the scratchpad.
- The admin scrolls inside its own container: for screenshots scroll the element into view
  rather than relying on element screenshots.

## Conventions
- Admin UI: existing card/section styles (see Settings pages), `useToast` / `useConfirm` from
  `components/admin/feedback`, `AdminPrimaryButton` / `AdminSecondaryButton`.
- React lint rule `set-state-in-effect`: load data in effects via promise callbacks, not by
  calling a state-setting function directly.
- Storefront changes need a storefront rebuild to reach the prerendered HTML.
- After a change, add it under **[Unreleased]** in this `CHANGELOG.md` and `../Server/CHANGELOG.md`.
