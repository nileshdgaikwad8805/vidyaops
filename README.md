# VidyaOps

Practical tech training in Cloud, Data Analysis, AI, and Cybersecurity for students, freshers, and professionals in Pune, Maharashtra.

## Tech Stack

- **Frontend:** Static HTML, CSS, JavaScript (Vercel)
- **Backend:** Node.js + Express + SQLite (Render)
- **Payments:** Razorpay
- **AI:** Google Gemini API (chatbot, lead scoring, content generation)
- **Email:** Resend API / SMTP

## Structure

```
public/          → Static frontend (HTML, CSS, JS, assets)
src/             → Backend Express app
  app.js         → Express setup (CORS, helmet, rate-limit, routes)
  controllers/   → Route handlers
  services/      → Gemini, email, payment, auth, session, banner
  db/            → SQLite schema, seed, repositories
  routes/        → Public + Admin API routes
  middleware/    → Auth middleware
  utils/         → Helpers
server.js        → Entry point
```

## Deployment

- Frontend: `npm run build:vercel` → deploys `public/` to Vercel
- Backend: Node.js app deployed to Render (free tier)
- See `DEPLOYMENT.md` for details.


