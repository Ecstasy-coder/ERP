const { body, param, query } = require("express-validator");

const createDiaryValidation = [
  body("class_id").isInt({ min: 1 }).withMessage("Class id is required"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("diary_date").notEmpty().withMessage("Diary date is required"),
];

const diaryQueryValidation = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("date").optional().notEmpty(),
];

const diaryIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid diary id"),
];

module.exports = {
  createDiaryValidation,
  diaryQueryValidation,
  diaryIdValidation,
};
