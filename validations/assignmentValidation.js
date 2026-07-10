const { body, param, query } = require("express-validator");

const createAssignmentValidation = [
  body("class_id").isInt({ min: 1 }).withMessage("Class id is required"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("due_date").optional().isISO8601().withMessage("Due date must be a valid date"),
];

const assignmentQueryValidation = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("class_id").optional().isInt({ min: 1 }),
  query("search").optional().isString(),
];

const assignmentIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid assignment id"),
];

module.exports = {
  createAssignmentValidation,
  assignmentQueryValidation,
  assignmentIdValidation,
};
