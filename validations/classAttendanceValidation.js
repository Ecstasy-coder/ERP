const { body, query } = require("express-validator");

const classAttendanceQueryValidation = [
  query("branch_id").optional().isInt({ min: 1 }).withMessage("Branch must be a positive integer"),
  query("class_id").optional().isInt({ min: 1 }).withMessage("Class must be a positive integer"),
  query("section_id").optional().isInt({ min: 1 }).withMessage("Section must be a positive integer"),
];

const classAttendanceValidation = [
  body("branch_id").isInt({ min: 1 }).withMessage("Branch is required"),
  body("academic_year_id").isInt({ min: 1 }).withMessage("Academic year is required"),
  body("class_id").isInt({ min: 1 }).withMessage("Class is required"),
  body("section_id").isInt({ min: 1 }).withMessage("Section is required"),
  body("student_id").isInt({ min: 1 }).withMessage("Student is required"),
  body("attendance_date").notEmpty().withMessage("Attendance date is required"),
  body("attendance_status").isIn(["present", "absent"]).withMessage("Attendance status must be present or absent"),
];

module.exports = {
  classAttendanceQueryValidation,
  classAttendanceValidation,
};
