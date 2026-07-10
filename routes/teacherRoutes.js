const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacherController");
const validationMiddleware = require("../middleware/validationMiddleware");
const {
  assignTeacherValidation,
  teacherIdValidation,
} = require("../validations/teacherValidation");

router.post("/", assignTeacherValidation, validationMiddleware, teacherController.assignTeacher);
router.put("/:id", teacherIdValidation, validationMiddleware, teacherController.updateTeacherAssignment);
router.delete("/:id", teacherIdValidation, validationMiddleware, teacherController.removeTeacherAssignment);
router.get("/class/:classId", teacherController.getTeachersByClass);

module.exports = router;
