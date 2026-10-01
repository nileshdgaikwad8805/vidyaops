const path = require("path");
const { loadAppConfig } = require("../config/app-config");
const { createPasswordHash } = require("../services/auth");
const { 
  selectAdminUser, 
  insertAdminUser, 
  selectWorkshopCount, 
  insertWorkshop 
} = require("./repositories");

const ROOT = path.join(__dirname, "../../");
const APP_CONFIG = loadAppConfig(ROOT);
const ADMIN_USERNAME = APP_CONFIG.adminUsername;
const ADMIN_PASSWORD = APP_CONFIG.adminPassword;

function seedAdminUserIfNeeded() {
  const existingAdmin = selectAdminUser.get();
  if (existingAdmin) {
    return;
  }

  insertAdminUser.run(ADMIN_USERNAME, createPasswordHash(ADMIN_PASSWORD));
  console.log("Admin user seeded.");
}

function seedWorkshopsIfNeeded() {
  if (selectWorkshopCount.get().count > 0) {
    return;
  }

  const seedRows = [
    [
      "Cloud Basics for College Students",
      "Free Workshop",
      "Introductory session covering cloud concepts, career paths, and practical starting points.",
      "Saturday, 10:00 AM",
      "2 Hours",
      "Beginner",
      "Reserve Seat",
      "contact.html",
      "",
      "",
      "",
      1,
    ],
    [
      "Hands-On Data Analysis Sprint",
      "Paid Workshop",
      "Learn practical data workflows, basic tools, and how to think analytically with guided exercises.",
      "Sunday, 11:30 AM",
      "3 Hours",
      "Beginner to Intermediate",
      "Enroll Now",
      "contact.html",
      "",
      "",
      "",
      1,
    ],
    [
      "Introduction to AI Tools and Use Cases",
      "Free Workshop",
      "Explore AI ideas, practical examples, and how students and freshers can start learning responsibly.",
      "Wednesday, 5:00 PM",
      "90 Minutes",
      "Beginner",
      "Reserve Seat",
      "contact.html",
      "",
      "",
      "",
      1,
    ],
    [
      "Cybersecurity Awareness and Foundations",
      "Paid Workshop",
      "Understand security basics, threat awareness, and how cybersecurity skills connect to career growth.",
      "Saturday, 4:00 PM",
      "2.5 Hours",
      "Beginner",
      "Enroll Now",
      "contact.html",
      "",
      "",
      "",
      1,
    ],
  ];

  seedRows.forEach((row) => insertWorkshop.run(...row));
  console.log("Workshops seeded.");
}

function runSeeds() {
  seedAdminUserIfNeeded();
  seedWorkshopsIfNeeded();
}

module.exports = {
  seedAdminUserIfNeeded,
  seedWorkshopsIfNeeded,
  runSeeds
};
