const { body, param, query } = require("express-validator");

const createClassTeacherValidation = [
  body("branch_id").isInt({ min: 1 }).withMessage("Branch is required"),
  body("academic_year_id").isInt({ min: 1 }).withMessage("Academic year is required"),
  body("class_id").isInt({ min: 1 }).withMessage("Class is required"),
  body("section_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Section must be a positive integer"),
  body("teacher_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Teacher id must be a positive integer"),
  body("employee_code").optional({ nullable: true }).isString().trim().notEmpty().withMessage("Employee code is required when teacher_id is not provided"),
  body("teacher_code").optional({ nullable: true }).isString().trim().notEmpty().withMessage("Teacher code is required when teacher_id is not provided"),
  body("subject_id").isInt({ min: 1 }).withMessage("Subject is required"),
  body("is_class_teacher").optional().isBoolean().withMessage("Class teacher flag must be boolean"),
  body("remarks").optional().isString().trim(),
  body().custom((value, { req }) => {
    const hasTeacherId = req.body.teacher_id !== undefined && req.body.teacher_id !== null && req.body.teacher_id !== "";
    const hasEmployeeCode = req.body.employee_code !== undefined && req.body.employee_code !== null && req.body.employee_code !== "";
    const hasTeacherCode = req.body.teacher_code !== undefined && req.body.teacher_code !== null && req.body.teacher_code !== "";
    if (!hasTeacherId && !hasEmployeeCode && !hasTeacherCode) {
      throw new Error("Teacher reference is required");
    }
    return true;
  }),
];

const updateClassTeacherValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid assignment id"),
  body("branch_id").optional().isInt({ min: 1 }).withMessage("Branch is required"),
  body("academic_year_id").optional().isInt({ min: 1 }).withMessage("Academic year is required"),
  body("class_id").optional().isInt({ min: 1 }).withMessage("Class is required"),
  body("section_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Section must be a positive integer"),
  body("teacher_id").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Teacher id must be a positive integer"),
  body("employee_code").optional({ nullable: true }).isString().trim().notEmpty().withMessage("Employee code is required when teacher_id is not provided"),
  body("teacher_code").optional({ nullable: true }).isString().trim().notEmpty().withMessage("Teacher code is required when teacher_id is not provided"),
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
