const path = require('path');
const { generateTrainerBanner } = require('../server/services/banner.service');

async function runTest() {
  console.log("Testing generation directly...");
  try {
    const filename = "photo-1775237869452-262237161.jpg";
    const out = await generateTrainerBanner(999, "AI Banner Bot", "DevOps Engineering", filename);
    console.log("Success! File:", out);
  } catch (err) {
    console.error("Test execution failed:", err);
  }
}

runTest();
