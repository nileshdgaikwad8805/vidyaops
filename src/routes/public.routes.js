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

// Basic API routes
router.get('/workshops', handleWorkshopList);
router.get('/products', handleProductCatalog);
router.get('/learner/session', handleLearnerSession);

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
