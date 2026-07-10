const { query } = require("express-validator");

const classDetailsQueryValidation = [
  query("branch_id").isInt({ min: 1 }).withMessage("Branch is required"),
  query("class_id").isInt({ min: 1 }).withMessage("Class is required"),
  query("section_id").isInt({ min: 1 }).withMessage("Section is required"),
];

module.exports = {
  classDetailsQueryValidation,
};
