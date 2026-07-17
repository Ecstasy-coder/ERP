const express = require("express");

const router = express.Router();

const {
    getFeeTypes,
    addStudentFee,
    getStudentFees,
    payFee,
    deleteFee
} = require("../controllers/feeController");


// ==========================================
// Fee Type Dropdown
// ==========================================
router.get("/types", getFeeTypes);


// ==========================================
// Add Student Fee
// ==========================================
router.post("/add", addStudentFee);


// ==========================================
// Get Student Fee Details
// ==========================================
router.get("/student/:studentId", getStudentFees);


// ==========================================
// Pay Fee
// ==========================================
router.put("/pay/:id", payFee);


// ==========================================
// Delete Fee
// ==========================================
router.delete("/delete/:id", deleteFee);


module.exports = router;