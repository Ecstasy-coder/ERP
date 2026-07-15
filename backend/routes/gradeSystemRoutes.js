const express = require("express");

const router = express.Router();

const {

    getAllGrades,
    getGradeById,
    createGrade,
    updateGrade,
    deleteGrade

} = require("../controllers/gradeSystemController");


// Get All Grades
router.get("/", getAllGrades);

// Get Grade By Id
router.get("/:id", getGradeById);

// Create Grade
router.post("/", createGrade);

// Update Grade
router.put("/:id", updateGrade);

// Delete Grade
router.delete("/:id", deleteGrade);

module.exports = router;