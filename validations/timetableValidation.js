const { body, param } = require("express-validator");

const createTimetableValidation = [
  body("class_id").isInt({ min: 1 }).withMessage("Class id is required"),
  body("day_name").trim().notEmpty().withMessage("Day name is required"),
  body("period_no").isInt({ min: 1 }).withMessage("Period number is required"),
  body("subject_name").trim().notEmpty().withMessage("Subject name is required"),
  body("start_time").notEmpty().withMessage("Start time is required"),
  body("end_time").notEmpty().withMessage("End time is required"),
];

const timetableIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid timetable id"),
];

module.exports = {
  createTimetableValidation,
  timetableIdValidation,
};
