const express = require("express");

const router = express.Router();

const teacherController = require("../controllers/teacherController");

// ======================================
// Get All Teachers
// ======================================
router.get("/", teacherController.getAllTeachers);

// ======================================
// Get Teacher By Id
// ======================================
router.get("/:id", teacherController.getTeacherById);

// ======================================
// Create New Teacher
// ======================================
router.post("/", teacherController.createTeacher);

// ======================================
// Update Teacher
// ======================================
router.put("/:id", teacherController.updateTeacher);

// ======================================
// Delete Teacher
// ======================================
router.delete("/:id", teacherController.deleteTeacher);

module.exports = router;
