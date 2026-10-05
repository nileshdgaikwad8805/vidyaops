const crypto = require("crypto");
const path = require("path");
const { loadAppConfig } = require("../config/app-config");

const ROOT = path.join(__dirname, "../../");
const APP_CONFIG = loadAppConfig(ROOT);

const RAZORPAY_KEY_ID = APP_CONFIG.razorpayKeyId;
const RAZORPAY_KEY_SECRET = APP_CONFIG.razorpayKeySecret;
const razorpayConfigured = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

const PRODUCT_CATALOG = [
  {
    id: "free-community-workshop",
    type: "free",
    category: "Community Workshop",
    name: "Free Community Workshop Pass",
    priceInr: 0,
    description:
      "An open-entry VidyaOps community workshop for students, freshers, and knowledge seekers who want a low-risk first step.",
    includes: [
      "Live community workshop access",
      "Skill guidance from VidyaOps AI",
      "Post-workshop next-step recommendations",
    ],
    ctaLabel: "Register Free",
  },
  {
    id: "paid-ai-workshop",
    type: "paid",
    category: "Paid Workshop",
    name: "AI Career Starter Workshop",
    priceInr: 1499,
    description:
      "A paid practical workshop focused on AI fundamentals, tool exposure, guided exercises, and clearer career direction.",
    includes: [
      "Guided live workshop",
      "Practical exercises and assignments",
      "Learner dashboard access and onboarding",
    ],
    ctaLabel: "Pay & Enroll",
  },
  {
    id: "paid-cloud-workshop",
    type: "paid",
    category: "Paid Workshop",
    name: "Cloud Foundations Workshop",
    priceInr: 1999,
    description:
      "A hands-on cloud workshop for learners who want stronger practical clarity before moving into deeper training paths.",
    includes: [
      "Structured workshop delivery",
      "Foundational cloud roadmap",
      "Access to onboarding and next-step guidance",
    ],
    ctaLabel: "Pay & Enroll",
  },
];

function getProductById(productId) {
  return PRODUCT_CATALOG.find((product) => product.id === productId) || null;
}

async function createRazorpayOrder({ amountInr, receipt, notes }) {
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountInr * 100,
      currency: "INR",
      receipt,
      notes,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.description || payload?.error?.reason || "Unable to create Razorpay order.");
  }

  return payload;
}

function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const digest = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return digest === signature;
}

module.exports = {
  razorpayConfigured,
  PRODUCT_CATALOG,
  getProductById,
  createRazorpayOrder,
  verifyRazorpaySignature,
  RAZORPAY_KEY_ID
};
