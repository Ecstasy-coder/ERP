const { body, param } = require("express-validator");

const assignTeacherValidation = [
  body("class_id").isInt({ min: 1 }).withMessage("Class id is required"),
  body("teacher_id").isInt({ min: 1 }).withMessage("Teacher id is required"),
  body("academic_year").trim().notEmpty().withMessage("Academic year is required"),
];

const teacherIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid teacher assignment id"),
];

module.exports = {
  assignTeacherValidation,
  teacherIdValidation,
};
