const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const ENV_PATH = path.join(ROOT, ".env");

if (fs.existsSync(ENV_PATH)) {
  const envText = fs.readFileSync(ENV_PATH, "utf8");
  envText.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

const { loadAppConfig } = require("./app-config");
require("./src/db/index"); // Initialize Database
const { runSeeds } = require("./src/db/seed");
const { runNurtureCycle } = require("./src/services/jobs");
const app = require("./src/app");

const APP_CONFIG = loadAppConfig(ROOT);
const PORT = APP_CONFIG.port;
const HOST = APP_CONFIG.host;
const DB_PATH = APP_CONFIG.dbPath;

// Run database seeds
runSeeds();

app.listen(PORT, HOST, () => {
  console.log(`VidyaOps Express server running at http://${HOST}:${PORT}`);
  console.log(`Database ready at ${DB_PATH}`);
  console.log(`Platform target: ${APP_CONFIG.platformTarget} (${APP_CONFIG.runtimeMode})`);
  
  if (APP_CONFIG.enableBackgroundJobs) {
    runNurtureCycle();
    setInterval(runNurtureCycle, 5 * 60 * 1000);
  } else {
    console.log("Background jobs are disabled for this runtime.");
  }
});
