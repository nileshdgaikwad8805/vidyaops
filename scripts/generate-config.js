const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

// The Angular app reads window.VIDYAOPS_CONFIG from a plain script tag, so the
// generated file has to land in the Angular public folder to end up in the build.
// It is also written next to the legacy static pages for the Netlify fallback.
const configTargets = [
  path.join(root, "public", "config.js"),
  path.join(root, "server", "public", "config.js"),
];

// Static hosts serve the legacy pages from server/public, so the SEO files have
// to be copied there as well as kept at the repo root.
const staticHosts = [
  path.join(root, "public"),
  path.join(root, "server", "public"),
];

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

for (const target of configTargets) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, "utf8");
}

const seoFiles = ["robots.txt", "sitemap.xml"];
for (const file of seoFiles) {
  const src = path.join(root, file);

  if (!fs.existsSync(src)) {
    continue;
  }

  for (const destDir of staticHosts) {
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, path.join(destDir, file));
    console.log(`Copied ${file} → ${path.relative(root, path.join(destDir, file))}`);
  }
}

console.log(`Generated config.js for ${platformTarget} with apiBase='${apiBase || "(same-origin)"}'`);
