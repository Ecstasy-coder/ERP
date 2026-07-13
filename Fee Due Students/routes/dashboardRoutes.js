const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

// =======================================
// Dashboard Summary
// =======================================

router.get("/", dashboardController.getDashboardSummary);

// =======================================
// Branch Dashboard
// =======================================

router.get("/branch", dashboardController.getBranchDashboard);

// =======================================
// Class Dashboard
// =======================================

router.get("/class", dashboardController.getClassDashboard);

// =======================================
// Recent Payments
// =======================================

router.get("/recent-payments", dashboardController.getRecentPayments);

module.exports = router;