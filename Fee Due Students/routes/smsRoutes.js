const express = require("express");

const router = express.Router();

const smsController = require("../controllers/smsController");

// Send SMS
router.post("/send", smsController.sendSMS);

// Get All SMS History
router.get("/history", smsController.getSMSHistory);

// Student SMS History
router.get("/history/:student_id", smsController.getStudentSMSHistory);

module.exports = router;