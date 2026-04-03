const path = require("path");
const { loadAppConfig } = require("../../app-config");
const { adminSessions } = require("../services/session");

const ROOT = path.join(__dirname, "../../");
const APP_CONFIG = loadAppConfig(ROOT);
const SESSION_COOKIE = APP_CONFIG.sessionCookie;

function getAdminSession(req) {
  const authorization = req.headers.authorization || "";
  const headerToken = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
  
  const token = headerToken || req.cookies[SESSION_COOKIE];
  if (!token) {
    return null;
  }

  return adminSessions.get(token) || null;
}

function requireAdmin(req, res, next) {
  const session = getAdminSession(req);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.adminSession = session;
  next();
}

module.exports = {
  getAdminSession,
  requireAdmin
};
