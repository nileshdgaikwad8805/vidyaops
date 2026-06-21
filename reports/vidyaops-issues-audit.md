# VidyaOps — Issues & Flaws Audit

> Full codebase audit before new improvements.  
> Audited: June 2026 · Branch: `codex/render-deploy-prep`

---

## Executive summary

The app has **two deployment modes** (static frontend vs full Express backend) but production is only partially wired. Several **security**, **payment**, and **deployment config** gaps should be fixed before adding features.

| Severity | Count | Fix first? |
|----------|-------|------------|
| Critical | 7 | Yes — block production trust |
| High | 12 | Yes — before new features |
| Medium | 14 | Next sprint |
| Low | 8 | As time allows |

**Recommended fix phases:** Production wiring → Security → Payments → Data integrity → SEO/polish

---

## Phase 0 — Production wiring (do first)

These explain why **vidyaops.com** behaves like a broken half-deploy today.

| # | Issue | Severity | Location | Fix |
|---|-------|----------|----------|-----|
| P0-1 | **Frontend not connected to backend** — `PUBLIC_API_BASE` is empty; live `/api/health` returns 404 | Critical | `config.js`, Vercel env | Set `PUBLIC_API_BASE` on Vercel to Render URL; redeploy both |
| P0-2 | **CORS will block split deploy** — empty `ALLOWED_ORIGINS` rejects all browser requests with an Origin header | Critical | `src/app.js`, `render.yaml` | Set `ALLOWED_ORIGINS=https://vidyaops.com,https://<render-app>.onrender.com` on Render |
| P0-3 | **June 2026 site fixes not deployed** — static fallbacks, config.js, copy cleanup still local only | High | `reports/vidyaops-site-fixes-2026-06-19.md` | Redeploy Vercel after merge |
| P0-4 | **`render.yaml` missing required env vars** — only PORT/HOST defined | High | `render.yaml` | Add placeholder env vars for secrets + `ALLOWED_ORIGINS` |
| P0-5 | **`vercel.json` has no `outputDirectory`** — ambiguous static vs Node deploy | High | `vercel.json` | Add `"outputDirectory": "public"` |
| P0-6 | **`robots.txt` / `sitemap.xml` not in `public/`** — 404 on static hosts | High | repo root vs `public/` | Copy into `public/` in `build:vercel` |
| P0-7 | **Missing logo asset** — all pages reference `assets/vidyaops-logo.jpeg` but only `favicon.svg` + `logo-mark.svg` exist | Critical | `public/assets/`, all HTML | Add logo file or switch references to existing asset |

---

## Critical — Security & payments

| # | Issue | Location | Impact | Fix |
|---|-------|----------|--------|-----|
| C-1 | **Default admin password `vidyaops123`** seeded if env missing | `app-config.js:39`, `src/db/seed.js` | Anyone can log into admin | Fail startup in production without strong `ADMIN_PASSWORD` |
| C-2 | **Payment verify not idempotent** — no check for `payment_pending` status or existing `provider_payment_id` | `public.controller.js:387-419` | Replay valid signature → duplicate onboarding emails | Gate on status; conditional UPDATE |
| C-3 | **No Razorpay server-side confirmation** — HMAC only, no API fetch for `captured`/amount | `payment.js`, `public.controller.js` | Forged/mismatched payments could pass | Verify via Razorpay API after signature check |
| C-4 | **Admin stored-XSS** — inquiry/lead/chat fields rendered via `innerHTML` without escaping | `public/js/admin.js:551-626` | Malicious form data executes in admin browser | Wrap all user fields with `escapeHtml()` |
| C-5 | **Netlify publishes repo root** — no `index.html` at root; may expose secrets | `netlify.toml` | Broken deploy + data exposure | `publish = "public"`, add build command |
| C-6 | **Volunteer form has no static fallback** — always hits API | `public/js/volunteer.js` | 404 on Vercel-only deploy | Add static-mode mailto/WhatsApp fallback like contact/enroll |
| C-7 | **Unauthenticated Gemini chat** — cost/abuse vector | `public.routes.js`, `public.controller.js` | Gemini quota burn, DB bloat | Per-IP/session limits, payload caps, optional CAPTCHA |

---

## High — Auth, sessions, abuse

| # | Issue | Location | Impact | Fix |
|---|-------|----------|--------|-----|
| H-1 | **In-memory admin sessions** — lost on restart; not multi-instance safe | `src/services/session.js` | Admin logged out on Render spin-down | SQLite sessions or signed JWT |
| H-2 | **Admin token in localStorage** — XSS-stealable | `admin-login.js`, `admin.controller.js` | Session hijack via XSS | HttpOnly cookie only; drop token from JSON body |
| H-3 | **CORS allows `*` with credentials** | `src/app.js:31-32` | Misconfigured prod opens cross-origin admin | Reject `*` when credentials enabled |
| H-4 | **Volunteer uploads can fill disk** — 10MB×2, no cleanup/quota | `volunteer.controller.js` | Disk exhaustion on Render free tier | Rate limit, storage cap, cleanup job |
| H-5 | **CSV export only last 20 rows** | `admin.controller.js`, `repositories.js` | Incomplete admin exports | Export full table or paginate |
| H-6 | **Nurture datetime format mismatch** — SQLite `datetime()` vs ISO in comparisons | `db/index.js`, `utils/index.js`, `jobs.js` | Emails sent at wrong times or never | Standardize on ISO UTC everywhere |
| H-7 | **SQLite no WAL / no transactions** on payment flows | `db/index.js`, `public.controller.js` | `SQLITE_BUSY`, partial enrollments | Enable WAL, wrap multi-step ops in transactions |
| H-8 | **Admin page exposed on static hosts** — no server-side gate on Vercel | `public/admin.html` | Admin UI shell visible before client redirect | Hide by default CSS; CDN block optional |
| H-9 | **Deployment docs contradict** — `serverless` vs `static` runtime mode | `DEPLOYMENT.md`, `VIDYAOPS_CONTEXT.md` | Wrong env vars in prod | Align on `static` for Vercel frontend |
| H-10 | **Client-only payment completion** — no Razorpay webhook | `enroll.js`, `public.controller.js` | Paid but browser closed → stuck `payment_pending` | Add webhook handler |
| H-11 | **Login lacks brute-force protection** | `src/app.js`, `admin.controller.js` | Password guessing | Dedicated rate limit on `/api/admin/login` |
| H-12 | **Static-mode detection inconsistent** — volunteer missing; no fetch-failure fallback | `public/js/*.js` | Silent failures when API misconfigured | Shared `isStaticMode()` helper + graceful degradation |

---

## Medium — Validation, email, data

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| M-1 | Weak email validation (`includes("@")`) | `src/utils/index.js` | Proper email validation |
| M-2 | HTML injection in outbound emails | `src/services/email.js` | Escape user content in HTML emails |
| M-3 | Follow-up email sent before DB insert | `public.controller.js` | Insert first, then send |
| M-4 | Razorpay signature compare not timing-safe | `payment.js:94` | Use `crypto.timingSafeEqual` |
| M-5 | Orphan `payment_pending` enrollments on order failure | `public.controller.js:336-364` | Roll back or cleanup job |
| M-6 | Password change doesn't invalidate sessions | `admin.controller.js` | Clear sessions on password update |
| M-7 | Multer errors unclear; partial files on disk | `volunteer.controller.js` | Error middleware + cleanup on failure |
| M-8 | File upload trusts MIME only | `volunteer.controller.js` | Magic-byte validation |
| M-9 | Unbounded chat history / message size | `public.controller.js` | Cap turns, length, payload |
| M-10 | Gemini calls have no timeout | `gemini.js` | `AbortSignal.timeout()` |
| M-11 | Gemini output parsing fragile | `gemini.js` | Structured JSON output + validation |
| M-12 | Error handler leaks internal messages | `src/app.js:110-116` | Generic client errors |
| M-13 | `handleAdminLeadUpdate` no existence check | `admin.controller.js` | Validate ID; check rows affected |
| M-14 | Learner access token in URL query string | `public.controller.js`, `learner-dashboard.js` | POST exchange or short-lived cookie |

---

## Low — Polish & housekeeping

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| L-1 | `secure: true` cookie breaks local HTTP dev | `admin.controller.js` | `secure: NODE_ENV === 'production'` |
| L-2 | `SECURE_STATIC_FILES` config unused | `app-config.js` | Implement or remove |
| L-3 | `data/banners` directory never created | `banner.service.js` | `mkdirSync` before write |
| L-4 | `verifyPassword` throws on malformed hashes | `auth.js` | Guard buffer length before compare |
| L-5 | `node:sqlite` requires Node 22+ — no `engines` in package.json | `package.json`, `db/index.js` | Pin `"engines": { "node": ">=22" }` |
| L-6 | Chat role spoofing in history (prompt injection) | `public.controller.js` | Server-side history only |
| L-7 | Test scripts in `public/js/` reachable if URL guessed | `test-banner.js`, `test-volunteer.js` | Move to `scripts/` |
| L-8 | `enroll.html` wrong nav highlight (`data-page="contact"`) | `public/enroll.html` | Fix `data-page` value |
| L-9 | `enroll.html` missing canonical/robots meta | `public/enroll.html` | Add SEO meta |
| L-10 | `sitemap.xml` missing `enroll.html`; stale `lastmod` | `sitemap.xml` | Update sitemap |
| L-11 | Volunteer page orphaned — no nav link | `volunteer.html` | Add footer/about link |
| L-12 | Hardcoded `vidyaops.com` in SEO — breaks staging | sitemap, canonicals | Build-time `PUBLIC_SITE_URL` |
| L-13 | Netlify vs Vercel `X-Frame-Options` mismatch | `netlify.toml`, `vercel.json` | Align headers |
| L-14 | Global rate limit applies to admin dashboard | `src/app.js` | Exempt authenticated admin routes |

---

## Static vs API mode coverage

| Module | Static fallback? | Notes |
|--------|------------------|-------|
| `script.js` (contact) | Yes | mailto fallback |
| `script.js` (chatbot) | Yes | local FAQ |
| `workshops.js` | Yes | hardcoded cards |
| `enroll.js` | Yes | hardcoded products + mailto |
| **volunteer.js** | **No** | always fails on static |
| **admin.js** | **No** | requires live backend |

---

## Suggested fix order

### Sprint 1 — Unblock production (1–2 hours config + small code)

1. Add missing logo asset
2. Fix `vercel.json` output directory + copy SEO files in build
3. Fix `netlify.toml` publish path
4. Add volunteer static fallback
5. Escape admin `innerHTML` fields
6. Deploy + set Vercel `PUBLIC_API_BASE` and Render `ALLOWED_ORIGINS`

### Sprint 2 — Security hardening

1. Enforce strong admin password at startup
2. Payment idempotency + Razorpay API verify
3. Login rate limiting
4. Chat payload/rate limits
5. HTML escape in emails

### Sprint 3 — Reliability

1. SQLite WAL + transactions
2. Nurture datetime normalization
3. CSV export full data
4. Razorpay webhook
5. Session persistence

### Sprint 4 — SEO & polish

1. enroll.html SEO + nav fix
2. sitemap update
3. OG tags
4. Move test scripts out of public
5. Align deployment docs

---

## Open product decision (blocks architecture)

Before new features, decide:

| Option | Pros | Cons |
|--------|------|------|
| **A. Static frontend only** | Simple, cheap Vercel | No live forms, payments, chatbot, admin on production |
| **B. Vercel + Render full stack** | All features live | Requires env wiring, CORS, ongoing Render cost |
| **C. Render only (full app)** | Single deploy, SQLite works | Slower cold starts on free tier; no CDN edge for static |

Current live state matches **Option A** (partially). Most API-dependent features are degraded.

---

## Related docs

- `VIDYAOPS_CONTEXT.md` — project overview
- `DEPLOYMENT.md` — deployment guide
- `reports/vidyaops-site-fixes-2026-06-19.md` — recent fixes (pending deploy)
