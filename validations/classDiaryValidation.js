const { body, query, param } = require("express-validator");

const classDiaryValidation = [
  body("branch_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Branch must be a positive integer"),
  body("academic_year_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Academic year must be a positive integer"),
  body("class_id").isInt({ min: 1 }).withMessage("Class is required"),
  body("section_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Section must be a positive integer"),
  body("diary_date").notEmpty().withMessage("Diary date is required"),
  body("subject_id").isInt({ min: 1 }).withMessage("Subject is required"),
  body("message").notEmpty().withMessage("Message is required"),
];

const classDiaryQueryValidation = [
  query("branch_id").optional({ nullable: true }).trim().notEmpty().withMessage("Branch is required"),
  query("class_id").optional({ nullable: true }).trim().notEmpty().withMessage("Class is required"),
  query("section_id").optional({ nullable: true }).trim().notEmpty().withMessage("Section is required"),
];

const classDiaryIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid diary id"),
];

module.exports = {
  classDiaryValidation,
  classDiaryQueryValidation,
  classDiaryIdValidation,
};
