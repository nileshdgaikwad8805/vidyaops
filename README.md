# VidyaOps

Practical tech training in Cloud, Data Analysis, AI, and Cybersecurity for students, freshers, and professionals in Pune, Maharashtra.

## Tech Stack

- **Frontend:** Angular 18 SPA (`frontend/`, deployed on Vercel)
- **Backend:** Node.js + Express + SQLite (Render)
- **Payments:** Razorpay
- **AI:** Google Gemini API (chatbot, lead scoring, content generation)
- **Email:** Resend API / SMTP
- **Job agent:** Python (`jobs-agent/`, standalone CLI tool)

## Structure

```
frontend/       → Angular single-page app (Vercel production)
src/            → Backend Express app
  app.js         → Express setup (CORS, helmet, rate-limit, routes)
  controllers/   → Route handlers
  services/      → Gemini, email, payment, auth, session, banner
  db/            → SQLite schema, seed, repositories
  routes/        → Public + Admin API routes
  middleware/    → Auth middleware
  utils/         → Helpers
public/         → Static legacy assets served by the backend
jobs-agent/     → Python job-finding agent (standalone, not deployed)
scripts/        → Build/generate/update helper scripts
server.js       → Entry point
```

## Deployment

- Frontend: Angular app in `frontend/` deployed to Vercel
- Backend: Node.js app at repo root deployed to Render (free tier)
- Job agent: standalone Python tool, run manually
- See `DEPLOYMENT.md` for details.


