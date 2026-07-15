const express = require("express");
const router = express.Router();

const feeStructureController = require("../controllers/feeStructureController");
const validateFeeStructure = require("../validations/feeStructureValidation");

console.log("Fee Structure Routes Loaded");

// ======================================
// Get Fee Structure
// ======================================
router.get("/", (req, res) => {

    console.log("GET Fee Structure");

    feeStructureController.getFeeStructure(req, res);

});


// ======================================
// Create Fee Structure
// ======================================
router.post(
    "/",
    (req, res, next) => {

        console.log("POST Fee Structure");

        next();

    },
    validateFeeStructure,
    feeStructureController.createFeeStructure
);


// ======================================
// Update Fee Structure
// ======================================
router.put(
    "/:id",
    validateFeeStructure,
    feeStructureController.updateFeeStructure
);


// ======================================
// Delete Fee Structure
// ======================================
router.delete(
    "/:id",
    feeStructureController.deleteFeeStructure
);


// ======================================
// Get Total Fee
// ======================================
router.get(
    "/total",
    feeStructureController.getTotalFee
);

module.exports = router;