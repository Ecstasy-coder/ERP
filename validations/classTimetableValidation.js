const { body, query, param } = require("express-validator");

const classTimetableValidation = [
  body("branch_id").isInt({ min: 1 }).withMessage("Branch is required"),
  body("academic_year_id").isInt({ min: 1 }).withMessage("Academic year is required"),
  body("class_id").isInt({ min: 1 }).withMessage("Class is required"),
  body("section_id").isInt({ min: 1 }).withMessage("Section is required"),
  body("day_name").notEmpty().withMessage("Day is required"),
  body("period_no").isInt({ min: 1 }).withMessage("Period number is required"),
  body("start_time").notEmpty().withMessage("Start time is required"),
  body("end_time").notEmpty().withMessage("End time is required"),
  body("subject_id").isInt({ min: 1 }).withMessage("Subject is required"),
  body("teacher_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Teacher id must be valid"),
];

const classTimetableQueryValidation = [
  query("branch_id").isInt({ min: 1 }).withMessage("Branch is required"),
  query("class_id").isInt({ min: 1 }).withMessage("Class is required"),
  query("section_id").isInt({ min: 1 }).withMessage("Section is required"),
];

const classTimetableIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid timetable id"),
];

module.exports = {
  classTimetableValidation,
  classTimetableQueryValidation,
  classTimetableIdValidation,
};
