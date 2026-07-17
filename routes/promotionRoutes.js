const express = require("express");

const router = express.Router();

const promotionController = require("../controllers/promotionController");

// Display all students in promotion table
router.get("/students", promotionController.getStudents);

// Display complete student details
router.get("/student/:id", promotionController.getStudentDetails);

// Promote selected students
router.post("/promote", promotionController.promoteStudents);

module.exports = router;