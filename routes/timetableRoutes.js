const express = require("express");
const router = express.Router();

const timetableController = require("../controllers/timetableController");
const validationMiddleware = require("../middleware/validationMiddleware");
const {
  createTimetableValidation,
  timetableIdValidation,
} = require("../validations/timetableValidation");

router.post("/", createTimetableValidation, validationMiddleware, timetableController.createTimetable);
router.put("/:id", timetableIdValidation, validationMiddleware, timetableController.updateTimetable);
router.delete("/:id", timetableIdValidation, validationMiddleware, timetableController.deleteTimetable);
router.get("/class/:classId", timetableController.getWeeklyTimetable);

module.exports = router;
