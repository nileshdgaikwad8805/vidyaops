const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { loadAppConfig } = require("../../app-config");
const { insertVolunteerTrainer } = require("../db/repositories");
const { generateTrainerBanner } = require("../services/banner.service");

const APP_CONFIG = loadAppConfig(path.join(__dirname, "../../"));

// Configure Multer storage
const uploadDirectory = path.join(__dirname, "../../data/uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  }
});

// Setup multer limits and filtering
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB global max
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "resume") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Resume must be a PDF file."));
      }
    } else if (file.fieldname === "photo") {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true);
      } else {
        cb(new Error("Photo must be JPG or PNG."));
      }
    } else {
      cb(new Error("Invalid file field."));
    }
  }
});

// Middleware to handle the specific fields
const uploadVolunteerFiles = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]);

async function handleVolunteerIntake(req, res) {
  try {
    const { name, email, phone, linkedin_url, topic_of_choice } = req.body;
    
    if (!name || !email || !linkedin_url || !topic_of_choice) {
      return res.status(400).json({ error: "Missing required text fields." });
    }

    if (!req.files || !req.files.resume || !req.files.photo) {
      return res.status(400).json({ error: "Both a PDF resume and an image photograph are required." });
    }

    const resumePath = req.files.resume[0].filename;
    const photoPath = req.files.photo[0].filename;

    const result = insertVolunteerTrainer.run(
      name.trim(),
      email.trim(),
      phone ? phone.trim() : "",
      linkedin_url.trim(),
      topic_of_choice.trim(),
      resumePath,
      photoPath
    );

    if (!result.lastInsertRowid) {
      return res.status(500).json({ error: "Failed to create trainer record." });
    }
    const newTrainerId = Number(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      trainerId: newTrainerId,
      message: "Trainer application submitted successfully."
    });

    // Trigger AI background job only in long-running runtime (not serverless)
    if (APP_CONFIG.enableBackgroundJobs) {
      setImmediate(() => {
        generateTrainerBanner(newTrainerId, name.trim(), topic_of_choice.trim(), photoPath)
          .catch(err => console.error("[Banner Job] Failed:", err));
      });
    }

    return;

  } catch (error) {
    console.error("Volunteer Intake Error:", error);
    return res.status(500).json({ error: error.message || "Unable to save volunteer application." });
  }
}

module.exports = {
  uploadVolunteerFiles,
  handleVolunteerIntake
};
