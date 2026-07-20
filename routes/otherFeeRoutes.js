const express = require("express");

const router = express.Router();

const otherFeeController = require("../controllers/otherFeeController");

router.get("/", otherFeeController.getAllOtherFees);
router.post("/add", otherFeeController.addOtherFee);

module.exports = router;