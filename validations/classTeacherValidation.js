const { body, param, query } = require("express-validator");

const createClassTeacherValidation = [
  body("branch_id").isInt({ min: 1 }).withMessage("Branch is required"),
  body("academic_year_id").isInt({ min: 1 }).withMessage("Academic year is required"),
  body("class_id").isInt({ min: 1 }).withMessage("Class is required"),
  body("section_id").isInt({ min: 1 }).withMessage("Section is required"),
  body("teacher_id").isInt({ min: 1 }).withMessage("Teacher is required"),
  body("subject_id").isInt({ min: 1 }).withMessage("Subject is required"),
  body("is_class_teacher").optional().isBoolean().withMessage("Class teacher flag must be boolean"),
  body("remarks").optional().isString().trim(),
];

const updateClassTeacherValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid assignment id"),
  body("branch_id").optional().isInt({ min: 1 }).withMessage("Branch is required"),
  body("academic_year_id").optional().isInt({ min: 1 }).withMessage("Academic year is required"),
  body("class_id").optional().isInt({ min: 1 }).withMessage("Class is required"),
  body("section_id").optional().isInt({ min: 1 }).withMessage("Section is required"),
  body("teacher_id").optional().isInt({ min: 1 }).withMessage("Teacher is required"),
  body("subject_id").optional().isInt({ min: 1 }).withMessage("Subject is required"),
  body("is_class_teacher").optional().isBoolean().withMessage("Class teacher flag must be boolean"),
  body("remarks").optional().isString().trim(),
];

const classTeacherIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid assignment id"),
];

const listClassTeacherValidation = [
  query("search").optional().isString().trim(),
  query("branch_id").optional().isInt({ min: 1 }),
  query("academic_year_id").optional().isInt({ min: 1 }),
  query("class_id").optional().isInt({ min: 1 }),
  query("section_id").optional().isInt({ min: 1 }),
  query("teacher_id").optional().isInt({ min: 1 }),
];

module.exports = {
  createClassTeacherValidation,
  updateClassTeacherValidation,
  classTeacherIdValidation,
  listClassTeacherValidation,
};
