const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const DIST_DIR = path.join(ROOT, "dist", "vidyaops", "browser");

const isWindows = process.platform === "win32";

function runInShell(commandLine, cwd) {
  const result = spawnSync(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", commandLine], {
    cwd,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`Failed to run ${commandLine}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}

function runNode(scriptPath, cwd) {
  const result = spawnSync(process.execPath, [scriptPath], { cwd, stdio: "inherit" });

  if (result.error) {
    console.error(`Failed to run ${scriptPath}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}

function newestMtime(dir, extensions) {
  let newest = 0;

  const walk = (current) => {
    let entries;

    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")) {
        continue;
      }

      const fullPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (extensions.includes(path.extname(entry.name))) {
        newest = Math.max(newest, fs.statSync(fullPath).mtimeMs);
      }
    }
  };

  walk(dir);

  return newest;
}

function hasAngularBuild() {
  return fs.existsSync(path.join(DIST_DIR, "index.html"));
}

const sourceTime = newestMtime(SRC_DIR, [".ts", ".html", ".scss", ".css", ".json"]);
const buildTime = hasAngularBuild() ? fs.statSync(path.join(DIST_DIR, "index.html")).mtimeMs : 0;

if (!hasAngularBuild() || sourceTime > buildTime) {
  console.log("Building Angular app (dist/vidyaops is missing or stale)...");
  runInShell("npm install", ROOT);
  runInShell("npx ng build", ROOT);
} else {
  console.log("Angular build is up to date.");
}

runNode(path.join(ROOT, "server", "index.js"), ROOT);
