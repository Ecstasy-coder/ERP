const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const validationMiddleware = require("../middleware/validationMiddleware");
const {
  markAttendanceValidation,
  bulkAttendanceValidation,
  attendanceQueryValidation,
} = require("../validations/attendanceValidation");

router.post("/", markAttendanceValidation, validationMiddleware, attendanceController.markAttendance);
router.post("/bulk", bulkAttendanceValidation, validationMiddleware, attendanceController.bulkAttendance);
router.put("/:id", attendanceController.updateAttendance);
router.get("/today", attendanceController.getTodayAttendance);
router.get("/monthly", attendanceQueryValidation, validationMiddleware, attendanceController.getMonthlyAttendance);
router.get("/report", attendanceQueryValidation, validationMiddleware, attendanceController.getAttendanceReport);

module.exports = router;
