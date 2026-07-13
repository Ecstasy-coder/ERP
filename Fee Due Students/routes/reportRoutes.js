const express = require("express");

const router = express.Router();

const reportController = require("../controllers/reportController");

// =======================================
// Reports APIs
// =======================================

// Fee Due Report
router.get("/feedue", reportController.getFeeDueReport);

// Payment Report
router.get("/payments", reportController.getPaymentReport);

// Student Report
router.get("/student/:id", reportController.getStudentReport);

// Branch Report
router.get("/branch/:id", reportController.getBranchReport);

module.exports = router;