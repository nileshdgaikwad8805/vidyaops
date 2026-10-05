const { selectAllContent, upsertContent } = require("../db/repositories");

function handleGetContent(req, res) {
  try {
    const rows = selectAllContent.all();
    const contentMap = {};
    for (const row of rows) {
      contentMap[row.key_name] = row.content;
    }
    return res.status(200).json({ content: contentMap });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to fetch content." });
  }
}

function handleUpdateContent(req, res) {
  try {
    const payload = req.body;
    
    if (typeof payload !== "object" || payload === null) {
      return res.status(400).json({ error: "Invalid content payload." });
    }

    const keys = Object.keys(payload);
    for (const key of keys) {
      upsertContent.run(key, String(payload[key]));
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to update content." });
  }
}

module.exports = {
  handleGetContent,
  handleUpdateContent
};
