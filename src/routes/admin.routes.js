const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const {
  handleAdminLogin,
  handleAdminLogout,
  handleAdminSession,
  handleAdminOverview,
  handleAdminChangePassword,
  handleAdminTestEmail,
  handleCsvExport,
  handleAdminAiContent,
  handleAdminLeadUpdate
} = require('../controllers/admin.controller');
const {
  handleAdminWorkshopCreate,
  handleAdminWorkshopUpdate,
  handleAdminWorkshopDelete
} = require('../controllers/workshop.controller');
const { handleUpdateContent } = require('../controllers/content.controller');

// Open routes
router.post('/login', handleAdminLogin);
router.post('/logout', handleAdminLogout);

// Protected routes
router.use(requireAdmin);

router.get('/session', handleAdminSession);
router.get('/overview', handleAdminOverview);
router.post('/change-password', handleAdminChangePassword);
router.post('/test-email', handleAdminTestEmail);
router.post('/ai-content', handleAdminAiContent);
router.put('/leads/:id', handleAdminLeadUpdate);
router.get('/export/:kind', handleCsvExport);
router.put('/content', handleUpdateContent);

// Workshop admin routes
router.post('/workshops', handleAdminWorkshopCreate);
router.put('/workshops/:id', handleAdminWorkshopUpdate);
router.delete('/workshops/:id', handleAdminWorkshopDelete);

module.exports = router;
