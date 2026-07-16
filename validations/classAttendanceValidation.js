const { body, query } = require("express-validator");

const classAttendanceQueryValidation = [
  query("branch_id").optional({ nullable: true }).trim().notEmpty().withMessage("Branch is required"),
  query("class_id").optional({ nullable: true }).trim().notEmpty().withMessage("Class is required"),
  query("section_id").optional({ nullable: true }).trim().notEmpty().withMessage("Section is required"),
];

const classAttendanceValidation = [
  body("branch_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Branch must be a positive integer"),
  body("academic_year_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Academic year must be a positive integer"),
  body("class_id").isInt({ min: 1 }).withMessage("Class is required"),
  body("section_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Section must be a positive integer"),
  body("student_id").isInt({ min: 1 }).withMessage("Student is required"),
  body("attendance_date").notEmpty().withMessage("Attendance date is required"),
  body("attendance_status").isIn(["present", "absent"]).withMessage("Attendance status must be present or absent"),
];

module.exports = {
  classAttendanceQueryValidation,
  classAttendanceValidation,
};
