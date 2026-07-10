const { body, query, param } = require("express-validator");

const classDiaryValidation = [
  body("branch_id").isInt({ min: 1 }).withMessage("Branch is required"),
  body("academic_year_id").isInt({ min: 1 }).withMessage("Academic year is required"),
  body("class_id").isInt({ min: 1 }).withMessage("Class is required"),
  body("section_id").isInt({ min: 1 }).withMessage("Section is required"),
  body("diary_date").notEmpty().withMessage("Diary date is required"),
  body("subject_id").isInt({ min: 1 }).withMessage("Subject is required"),
  body("message").notEmpty().withMessage("Message is required"),
];

const classDiaryQueryValidation = [
  query("branch_id").isInt({ min: 1 }).withMessage("Branch is required"),
  query("class_id").isInt({ min: 1 }).withMessage("Class is required"),
  query("section_id").isInt({ min: 1 }).withMessage("Section is required"),
];

const classDiaryIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid diary id"),
];

module.exports = {
  classDiaryValidation,
  classDiaryQueryValidation,
  classDiaryIdValidation,
};
