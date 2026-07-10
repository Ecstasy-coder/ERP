const express = require("express");
const router = express.Router();

const classAttendanceController = require("../controllers/classAttendanceController");
const validationMiddleware = require("../middleware/validationMiddleware");
const {
  classAttendanceQueryValidation,
  classAttendanceValidation,
} = require("../validations/classAttendanceValidation");

router.get("/students", classAttendanceQueryValidation, validationMiddleware, classAttendanceController.getStudentsForAttendance);
router.get("/report", classAttendanceQueryValidation, validationMiddleware, classAttendanceController.getAttendanceReport);
router.post("/", classAttendanceValidation, validationMiddleware, classAttendanceController.markAttendance);
router.get("/", classAttendanceQueryValidation, validationMiddleware, classAttendanceController.getStudentsForAttendance);

module.exports = router;
