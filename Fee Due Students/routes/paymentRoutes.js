const express = require("express");

const router = express.Router();

const paymentController = require("../controllers/paymentController");

// ======================================
// Payment History
// ======================================

router.get("/", paymentController.getAllPayments);


// ======================================
// Create Payment
// ======================================

router.post("/", paymentController.createPayment);


// ======================================
// Generate Payment Link
// ======================================

router.put("/link/:paymentId", paymentController.generatePaymentLink);


// ======================================
// View Payment Page
// ======================================

router.get("/pay/:paymentId", paymentController.getPaymentById);


// ======================================
// Complete Payment
// ======================================

router.post("/pay/:paymentId", paymentController.completePayment);


module.exports = router;