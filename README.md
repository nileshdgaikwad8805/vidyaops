# VidyaOps

Practical tech training in Cloud, Data Analysis, AI, and Cybersecurity for students, freshers, and professionals in Pune, Maharashtra.

## Tech Stack

- **Frontend:** Angular 18 SPA at the repo root (`src/`, deployed on Vercel)
- **Backend:** Node.js + Express + SQLite in `server/` (Render)
- **Payments:** Razorpay
- **AI:** Google Gemini API (chatbot, lead scoring, content generation)
- **Email:** Resend API / SMTP

## Structure

The repo root **is** the Angular workspace, exactly as `ng new` would scaffold it.
The Express backend lives in `server/`.

```
.
├── angular.json               # Angular workspace config
├── package.json               # Angular + Express deps in one manifest
├── proxy.conf.json            # ng serve -> localhost:10000 API proxy
├── tsconfig*.json
├── src/                       # ── Angular application ──
│   ├── index.html
│   ├── main.ts                # bootstrapApplication(AppComponent, appConfig)
│   ├── styles.scss
│   ├── assets/
│   ├── environments/          # environment.ts / .development.ts / .production.ts
│   └── app/
│       ├── app.component.*    # root component -> <router-outlet />
│       ├── app.config.ts      # providers: router, http, interceptors, title strategy
│       ├── app.config.spec.ts
│       ├── app.routes.ts      # top-level route table
│       ├── app.routes.spec.ts
│       ├── core/              # singletons: services, guards, interceptors, models
│       ├── features/          # routed feature areas (public pages)
│       └── shared/            # reusable components, layouts, directives, pipes
├── public/                    # Angular static assets (served at /)
├── server/                    # ── Express backend ──
│   ├── index.js               # entry point
│   ├── app.js                 # Express setup (CORS, helmet, rate-limit, routes)
│   ├── config/app-config.js   # env-driven runtime config
│   ├── controllers/           # Route handlers
│   ├── services/              # Gemini, email, payment, auth, session, banner, jobs
│   ├── db/                    # SQLite schema, seed, repositories
│   ├── routes/                # Public + Admin API routes
│   ├── middleware/            # Auth middleware
│   ├── utils/                 # Helpers
│   └── public/                # Legacy static pages + admin dashboard
├── data/                      # SQLite db, uploads, banners (gitignored)
├── scripts/                   # Build/generate/update helper scripts
└── tests/                     # Node smoke tests
```

### `src/app` layout

| Folder      | Contents                                                                     |
| ----------- | ---------------------------------------------------------------------------- |
| `core/`     | Provided in root: `services/`, `guards/`, `interceptors/`, `models/`, plus the custom `TitleStrategy`. No components. |
| `features/` | One folder per routed area. `features/public/pages/<page>/` holds each page component. |
| `shared/`   | Reused across features: `components/`, `layouts/`, `directives/`, `pipes/`.     |

## Adding a page

Content-driven pages (hero + sections + CTA from the CMS) are declared once in
`src/app/features/public/pages/content-page/content-page.routes.ts` and rendered by
`ContentPageComponent`. Add an entry to `CONTENT_PAGE_ROUTES` and the route, document
title, and tests pick it up automatically.

Pages with a unique template get their own folder under
`src/app/features/public/pages/` and a `loadComponent` entry in `app.routes.ts`.

## Scripts

| Command                | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `npm start`            | Build the Angular app if stale, then run the API+SSR   |
| `npm run dev`          | `ng serve` with the API proxy (API must run separately) |
| `npm run build`        | Production Angular build to `dist/vidyaops`           |
| `npm run build:vercel` | Generate `config.js`, then build                      |
| `npm run start:server` | Express only, serving an existing `dist/` build        |
| `npm test`             | Karma + Jasmine unit tests                             |

## Deployment

- Frontend: Angular app at the repo root, deployed to Vercel (`dist/vidyaops/browser`)
- Backend: Express app in `server/`, deployed to Render (free tier)
- See `DEPLOYMENT.md` for details.
