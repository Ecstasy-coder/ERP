const { body, param, query } = require("express-validator");

const markAttendanceValidation = [
  body("student_id").isInt({ min: 1 }).withMessage("Student id is required"),
  body("class_id").isInt({ min: 1 }).withMessage("Class id is required"),
  body("attendance_date").notEmpty().withMessage("Attendance date is required"),
  body("attendance_status").trim().notEmpty().withMessage("Attendance status is required"),
];

const bulkAttendanceValidation = [
  body("*.student_id").isInt({ min: 1 }).withMessage("Student id is required"),
  body("*.class_id").isInt({ min: 1 }).withMessage("Class id is required"),
  body("*.attendance_date").notEmpty().withMessage("Attendance date is required"),
  body("*.attendance_status").trim().notEmpty().withMessage("Attendance status is required"),
];

const attendanceQueryValidation = [
  query("date").optional().notEmpty(),
  query("month").optional().isInt({ min: 1, max: 12 }),
  query("year").optional().isInt({ min: 2000 }),
];

module.exports = {
  markAttendanceValidation,
  bulkAttendanceValidation,
  attendanceQueryValidation,
};
