# VidyaOps Site Fixes - 2026-06-19

## Context

Reviewed the live VidyaOps website at `https://vidyaops.com` and fixed the first batch of production-facing issues before adding new integrations.

## Issues Found

- `config.js` was referenced by pages but returned `404_NOT_FOUND` on the live site.
- `/api/workshops` returned `404_NOT_FOUND`, which could leave the Workshops page without usable workshop cards.
- `/api/products` returned `404_NOT_FOUND`, which could leave the Enroll page without product cards or dropdown options.
- Contact page showed localhost/internal wording: `On localhost, this form saves directly into the VidyaOps app database.`
- Several pages contained draft/internal copy such as `This page...`, `These workshop cards...`, and `This section...`.
- Chatbot fallback messaging exposed local-server/Gemini setup wording to visitors.

## Fixes Completed

- Added `public/config.js` so static deployments can serve the runtime config file directly.
- Updated `scripts/generate-config.js` so `npm run build:vercel` writes config to both:
  - `config.js`
  - `public/config.js`
- Set generated frontend config default runtime mode to `static`.
- Added static fallback workshop cards in `public/js/workshops.js`.
- Added static fallback enrollment products in `public/js/enroll.js`.
- Updated enrollment fallback behavior so static deployments open a prefilled email inquiry instead of failing silently.
- Updated contact form fallback behavior so static deployments open a prefilled email inquiry instead of calling a missing API.
- Updated chatbot behavior so static deployments use local VidyaOps answers without calling missing chat APIs.
- Suppressed missing dynamic-content API errors in static mode.
- Rewrote internal/draft copy in:
  - `public/workshops.html`
  - `public/services.html`
  - `public/corporate-training.html`
  - `public/certifications.html`
  - `public/contact.html`

## Files Changed

- `config.js`
- `public/config.js`
- `scripts/generate-config.js`
- `public/js/workshops.js`
- `public/js/enroll.js`
- `public/js/script.js`
- `public/workshops.html`
- `public/services.html`
- `public/corporate-training.html`
- `public/certifications.html`
- `public/contact.html`

## Verification

Ran JavaScript syntax checks:

```powershell
node --check public\js\workshops.js
node --check public\js\enroll.js
node --check public\js\script.js
```

All syntax checks passed.

Ran build command:

```powershell
npm run build:vercel
```

Build passed and generated config files successfully.

Started local server with:

```powershell
npm start
```

Verified locally:

- `http://127.0.0.1:3000/config.js` returned runtime config.
- `http://127.0.0.1:3000/api/workshops` returned workshop data.
- `http://127.0.0.1:3000/api/products` returned product data.
- `http://127.0.0.1:3000/workshops.html` returned `200`.
- `http://127.0.0.1:3000/enroll.html` returned `200`.

The local server was stopped after verification.

## Deployment Note

These fixes are currently local in the repo. The live `vidyaops.com` website will reflect them after the project is deployed again.

## Suggested Next Work

- Decide whether `vidyaops.com` should remain a static frontend with email/WhatsApp fallbacks or use a deployed backend for real API-based contact, workshop, enrollment, payment, and chatbot flows.
- If backend APIs are required in production, configure the deployment target and environment variables for Express/API hosting.
- Review Services vs Programs page overlap and make each page more distinct.
- Continue with new integrations after this production cleanup is deployed.
