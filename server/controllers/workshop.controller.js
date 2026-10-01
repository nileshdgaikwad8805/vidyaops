const { generateWorkshopAutomation } = require("../services/gemini");
const {
  selectPublicWorkshops,
  insertWorkshop,
  selectWorkshopById,
  updateWorkshop,
  deleteWorkshop
} = require("../db/repositories");

function handleWorkshopList(req, res) {
  try {
    return res.status(200).json({
      workshops: selectPublicWorkshops.all(),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function handleAdminWorkshopCreate(req, res) {
  try {
    const { title = "", type = "", description = "", scheduleText = "", durationText = "", levelText = "", ctaText = "", ctaLink = "contact.html", isActive = false } = req.body;

    if (!title || !type || !description || !scheduleText || !durationText || !levelText || !ctaText) {
      return res.status(400).json({ error: "All workshop fields are required." });
    }

    const aiAssets = await generateWorkshopAutomation({
      title,
      type,
      description,
      scheduleText,
      durationText,
      levelText,
    });

    const result = insertWorkshop.run(
      title,
      type,
      description,
      scheduleText,
      durationText,
      levelText,
      ctaText,
      ctaLink,
      aiAssets.aiWorkshopDescription,
      aiAssets.aiAnnouncement,
      aiAssets.aiSocialPosts,
      isActive ? 1 : 0
    );

    return res.status(201).json({
      success: true,
      workshopId: Number(result.lastInsertRowid),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
}

async function handleAdminWorkshopUpdate(req, res) {
  try {
    const workshopId = parseInt(req.params.id, 10);
    const { title = "", type = "", description = "", scheduleText = "", durationText = "", levelText = "", ctaText = "", ctaLink = "contact.html", isActive = false } = req.body;

    if (!title || !type || !description || !scheduleText || !durationText || !levelText || !ctaText) {
      return res.status(400).json({ error: "All workshop fields are required." });
    }

    const existingWorkshop = selectWorkshopById.get(workshopId);
    if (!existingWorkshop) {
      return res.status(404).json({ error: "Workshop not found." });
    }

    const aiAssets = await generateWorkshopAutomation({
      title,
      type,
      description,
      scheduleText,
      durationText,
      levelText,
    });

    updateWorkshop.run(
      title,
      type,
      description,
      scheduleText,
      durationText,
      levelText,
      ctaText,
      ctaLink,
      aiAssets.aiWorkshopDescription,
      aiAssets.aiAnnouncement,
      aiAssets.aiSocialPosts,
      isActive ? 1 : 0,
      workshopId
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
}

function handleAdminWorkshopDelete(req, res) {
  try {
    const workshopId = parseInt(req.params.id, 10);
    deleteWorkshop.run(workshopId);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
}

module.exports = {
  handleWorkshopList,
  handleAdminWorkshopCreate,
  handleAdminWorkshopUpdate,
  handleAdminWorkshopDelete
};
