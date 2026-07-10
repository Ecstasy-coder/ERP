const express = require("express");
const router = express.Router();

const classTeacherController = require("../controllers/classTeacherController");
const validationMiddleware = require("../middleware/validationMiddleware");
const {
  createClassTeacherValidation,
  updateClassTeacherValidation,
  classTeacherIdValidation,
  listClassTeacherValidation,
} = require("../validations/classTeacherValidation");

router.get("/", listClassTeacherValidation, validationMiddleware, classTeacherController.getAllAssignments);
router.get("/:id", classTeacherIdValidation, validationMiddleware, classTeacherController.getAssignmentById);
router.post("/", createClassTeacherValidation, validationMiddleware, classTeacherController.createAssignment);
router.put("/:id", updateClassTeacherValidation, validationMiddleware, classTeacherController.updateAssignment);
router.delete("/:id", classTeacherIdValidation, validationMiddleware, classTeacherController.deleteAssignment);

module.exports = router;
