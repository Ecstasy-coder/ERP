const express = require("express");

const router = express.Router();

const reportHolidayController = require("../controllers/reportholidayController");

router.get("/", reportHolidayController.getHolidayReport);

module.exports = router;