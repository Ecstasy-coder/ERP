const { body, query, param } = require("express-validator");

const classAssignmentValidation = [
  body("branch_id").isInt({ min: 1 }).withMessage("Branch is required"),
  body("academic_year_id").isInt({ min: 1 }).withMessage("Academic year is required"),
  body("class_id").isInt({ min: 1 }).withMessage("Class is required"),
  body("section_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Section must be a positive integer"),
  body("title").notEmpty().withMessage("Assignment title is required"),
  body("assignment_date").notEmpty().withMessage("Assignment date is required"),
  body("due_date").optional({ nullable: true }).isDate().withMessage("Due date must be a valid date"),
];

const classAssignmentQueryValidation = [
  query("branch_id").isInt({ min: 1 }).withMessage("Branch is required"),
  query("class_id").isInt({ min: 1 }).withMessage("Class is required"),
  query("section_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Section must be a positive integer"),
];

const classAssignmentIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid assignment id"),
];

module.exports = {
  classAssignmentValidation,
  classAssignmentQueryValidation,
  classAssignmentIdValidation,
};
