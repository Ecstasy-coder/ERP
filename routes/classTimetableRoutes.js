const express = require("express");
const router = express.Router();

const classTimetableController = require("../controllers/classTimetableController");
const validationMiddleware = require("../middleware/validationMiddleware");
const {
  classTimetableValidation,
  classTimetableQueryValidation,
  classTimetableIdValidation,
} = require("../validations/classTimetableValidation");

router.post("/", classTimetableValidation, validationMiddleware, classTimetableController.createTimetable);
router.get("/", classTimetableQueryValidation, validationMiddleware, classTimetableController.getWeeklyTimetable);
router.get("/:id", classTimetableIdValidation, validationMiddleware, classTimetableController.getTimetableById);
router.put("/:id", classTimetableIdValidation, validationMiddleware, classTimetableController.updateTimetable);
router.delete("/:id", classTimetableIdValidation, validationMiddleware, classTimetableController.deleteTimetable);

module.exports = router;
