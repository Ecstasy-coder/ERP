const express = require("express");
const router = express.Router();

const holidayController = require("../controllers/holidayController");
const validateHoliday = require("../validations/holidayValidation");

router.get("/", holidayController.getAllHolidays);
router.get("/:id", holidayController.getHolidayById);

router.post("/", validateHoliday, holidayController.createHoliday);

router.put("/:id", validateHoliday, holidayController.updateHoliday);

router.delete("/:id", holidayController.deleteHoliday);

module.exports = router;