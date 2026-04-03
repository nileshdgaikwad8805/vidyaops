const express = require('express');
const router = express.Router();
const { handleWorkshopList } = require('../controllers/workshop.controller');
const {
  handleProductCatalog,
  handleLearnerSession,
  handleChat,
  handleContactInquiry,
  handleLeadCapture,
  handleFreeEnrollment,
  handleRazorpayOrderCreate,
  handleRazorpayVerify
} = require('../controllers/public.controller');
const { handleGetContent } = require('../controllers/content.controller');

// Basic API routes
router.get('/workshops', handleWorkshopList);
router.get('/products', handleProductCatalog);
router.get('/learner/session', handleLearnerSession);
router.get('/content', handleGetContent);

// Actions
router.post('/chat', handleChat);
router.post('/contact', handleContactInquiry);
router.post('/leads', handleLeadCapture);

// Enrollments & Payments
router.post('/enrollments/free', handleFreeEnrollment);
router.post('/payments/razorpay/order', handleRazorpayOrderCreate);
router.post('/payments/razorpay/verify', handleRazorpayVerify);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    service: "vidyaops",
    time: new Date().toISOString(),
  });
});

module.exports = router;
