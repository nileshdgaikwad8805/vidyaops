const path = require("path");
const { loadAppConfig } = require("../../app-config");

const ROOT = path.join(__dirname, "../../");
const APP_CONFIG = loadAppConfig(ROOT);

function getBaseUrl(request) {
  if (APP_CONFIG.appBaseUrl) {
    return APP_CONFIG.appBaseUrl.replace(/\/$/, "");
  }

  if (!request) {
    return "";
  }

  const proto = request.headers["x-forwarded-proto"] || "http";
  const host = request.headers.host || "";
  return host ? `${proto}://${host}` : "";
}

function extractEmailAddress(value) {
  const text = String(value || "").trim();
  return text.includes("@") ? text : "";
}

function toIsoDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function nowIso() {
  return new Date().toISOString();
}

const NURTURE_DELAYS_DAYS = [2, 5, 10];

function escapeCsv(value) {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function toCsv(rows) {
  if (!rows.length) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const headerLine = headers.map(escapeCsv).join(",");
  const dataLines = rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(","));
  return [headerLine, ...dataLines].join("\n");
}

module.exports = {
  getBaseUrl,
  extractEmailAddress,
  toIsoDateOffset,
  nowIso,
  NURTURE_DELAYS_DAYS,
  toCsv,
};
