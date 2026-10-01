const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const { loadAppConfig } = require('../app-config');
const adminRoutes = require('./routes/admin.routes');
const publicRoutes = require('./routes/public.routes');
const { getAdminSession } = require('./middleware/auth');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const ROOT = path.join(__dirname, '../');
const APP_CONFIG = loadAppConfig(ROOT);
const DATA_DIR = APP_CONFIG.dataDir;
const SEO_FILES = {
  "/robots.txt": path.join(ROOT, "robots.txt"),
  "/sitemap.xml": path.join(ROOT, "sitemap.xml"),
};

const app = express();

// Trust Render's proxy so rate limiter reads real client IP
app.set('trust proxy', 1);

// Set HTTP response headers to secure the app
app.use(helmet());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowed = APP_CONFIG.allowedOrigins.includes("*") ||
      APP_CONFIG.allowedOrigins.includes(origin);
      
    if (allowed) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limit API requests to prevent brute force & DDOS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes." }
});

// Mount API routes
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api', apiLimiter, publicRoutes);

// Runtime client config
app.get('/config.js', (req, res) => {
  const baseUrl = APP_CONFIG.publicApiBase || "";
  const content = `window.VIDYAOPS_CONFIG = window.VIDYAOPS_CONFIG || ${JSON.stringify(
    {
      apiBase: baseUrl,
      runtimeMode: APP_CONFIG.runtimeMode,
      platformTarget: APP_CONFIG.platformTarget,
    },
    null,
    2
  )};\n`;
  res.type('application/javascript').send(content);
});

Object.entries(SEO_FILES).forEach(([routePath, filePath]) => {
  app.get(routePath, (req, res, next) => {
    const publicPath = path.join(ROOT, "public", path.basename(routePath));
    const resolvedPath = fs.existsSync(publicPath) ? publicPath : (fs.existsSync(filePath) ? filePath : null);

    if (!resolvedPath) {
      return next();
    }

    res.sendFile(resolvedPath);
  });
});

// Protect files from unauthorized access at root level
app.use((req, res, next) => {
  const pathname = req.path;
  const blockedFiles = new Set(["server.js", ".env", "package.json", "render.yaml", "netlify.toml", "vercel.json"]);
  const isBlocklisted = blockedFiles.has(path.basename(pathname)) || path.basename(pathname).startsWith(".");
  
  if (isBlocklisted && pathname !== "/") {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Handle protected page logic
  if (pathname === "/admin.html") {
    if (!getAdminSession(req)) {
      return res.redirect('/admin-login.html');
    }
  }

  next();
});

const PUBLIC_DIR = path.join(ROOT, 'public');
const FRONTEND_DIST = path.join(ROOT, 'frontend', 'dist', 'frontend', 'browser');

// Admin dashboard has no Angular equivalent, so it keeps living in public/.
const ADMIN_STATIC_DIRS = ['js', 'css', 'assets'];

if (fs.existsSync(FRONTEND_DIST)) {
  ['/admin.html', '/admin-login.html'].forEach((pageRoute) => {
    app.get(pageRoute, (req, res, next) => {
      const pagePath = path.join(PUBLIC_DIR, pageRoute.slice(1));
      if (!fs.existsSync(pagePath)) return next();
      res.sendFile(pagePath);
    });
  });

  ADMIN_STATIC_DIRS.forEach((dirName) => {
    const dirPath = path.join(PUBLIC_DIR, dirName);
    if (fs.existsSync(dirPath)) {
      app.use(`/${dirName}`, express.static(dirPath, { index: false }));
    }
  });

  app.use(express.static(FRONTEND_DIST, { index: 'index.html' }));

  // SPA fallback: match the Vercel rewrite so every route resolves to the Angular shell.
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
} else {
  app.use(express.static(PUBLIC_DIR, { index: 'index.html' }));
}

app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.message && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: "Not allowed by CORS" });
  }
  // Properly handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: "File too large. Maximum size is 10MB." });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: "Unexpected file field." });
  }
  // Handle multer file filter errors (custom Error messages from fileFilter)
  if (err.message && (err.message.includes('Resume must be') || err.message.includes('Photo must be') || err.message.includes('Invalid file'))) {
    return res.status(400).json({ error: err.message });
  }
  console.error("Express Error Middleware caught:", err);
  res.status(500).json({ error: err.message || 'Something broke!' });
});

module.exports = app;
