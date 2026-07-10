const { body, param, query } = require("express-validator");

const createClassValidation = [
  body("class_name")
    .trim()
    .notEmpty()
    .withMessage("Class name is required")
    .isLength({ max: 100 })
    .withMessage("Class name must not exceed 100 characters"),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean"),
];

const updateClassValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid class id"),
  body("class_name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Class name must not exceed 100 characters"),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean"),
];

const listClassesValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("search").optional().isString().withMessage("Search must be a string"),
];

const classIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid class id"),
];

module.exports = {
  createClassValidation,
  updateClassValidation,
  listClassesValidation,
  classIdValidation,
};
