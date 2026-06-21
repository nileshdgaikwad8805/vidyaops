const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "config.js");
const publicConfigPath = path.join(root, "public", "config.js");

const apiBase = String(process.env.PUBLIC_API_BASE || "https://vidyaops.onrender.com").replace(/\/$/, "");
const runtimeMode = String(process.env.PUBLIC_RUNTIME_MODE || "static");
const platformTarget = String(process.env.PUBLIC_PLATFORM_TARGET || "vercel");

const contents =
  `window.VIDYAOPS_CONFIG = window.VIDYAOPS_CONFIG || ${JSON.stringify(
    {
      apiBase,
      runtimeMode,
      platformTarget,
    },
    null,
    2
  )};\n`;

fs.writeFileSync(configPath, contents, "utf8");
fs.writeFileSync(publicConfigPath, contents, "utf8");

// Copy SEO files into public/ so static hosts (Vercel/Netlify) serve them
const seoFiles = ["robots.txt", "sitemap.xml"];
for (const file of seoFiles) {
  const src = path.join(root, file);
  const dest = path.join(root, "public", file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} → public/${file}`);
  }
}

console.log(`Generated config.js for ${platformTarget} with apiBase='${apiBase || "(same-origin)"}'`);
