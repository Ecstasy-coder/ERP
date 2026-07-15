const express = require("express");

const router = express.Router();

const termFeeController = require("../controllers/termFeeController");

const validateTermFee = require("../validations/termFeeValidation");

console.log("Term Fee Routes Loaded");


// ======================================
// Get All Term Fees
// ======================================
router.get(

    "/",

    termFeeController.getTermFees

);


// ======================================
// Get Term Fee By ID
// ======================================
router.get(

    "/:id",

    termFeeController.getTermFeeById

);


// ======================================
// Create Term Fee
// ======================================
router.post(

    "/",

    validateTermFee,

    termFeeController.createTermFee

);


// ======================================
// Update Term Fee
// ======================================
router.put(

    "/:id",

    validateTermFee,

    termFeeController.updateTermFee

);


// ======================================
// Delete Term Fee
// ======================================
router.delete(

    "/:id",

    termFeeController.deleteTermFee

);


module.exports = router;