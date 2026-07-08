const fs = require('fs');
const path = require('path');

async function runTest() {
  try {
    const FormData = globalThis.FormData;
    const formData = new FormData();
    
    formData.append("name", "AI Tester");
    formData.append("email", "bot@vidyaops.com");
    formData.append("phone", "1234567890");
    formData.append("linkedin_url", "https://linkedin.com/bot");
    formData.append("topic_of_choice", "Test Automation");

    // Stub a fake PDF and PNG
    formData.append("resume", new Blob(["%PDF-1.4 Fake PDF Content..."], { type: "application/pdf" }), "test_resume.pdf");
    formData.append("photo", new Blob(["Fake PNG content"], { type: "image/png" }), "test_photo.png");

    console.log("Sending POST to http://127.0.0.1:3000/api/volunteer/apply...");
    const res = await fetch("http://127.0.0.1:3000/api/volunteer/apply", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);

    if (!res.ok) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Test Script Error:", error);
    process.exit(1);
  }
}

runTest();
