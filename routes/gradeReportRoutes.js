const express = require("express");

const router = express.Router();

const {

    getAllGradeReports,
    getGradeReportByClass,
    getGradeReportById,
    createGradeReport,
    updateGradeReport,
    updateMarks,
    deleteGradeReport

} = require("../controllers/gradeReportController");

// ========================================
// GET ALL GRADE REPORTS
// ========================================
router.get("/", getAllGradeReports);

// ========================================
// GET GRADE REPORTS BY CLASS
// ========================================
router.get("/class/:className", getGradeReportByClass);

// ========================================
// GET GRADE REPORT BY ID
// ========================================
router.get("/:id", getGradeReportById);

// ========================================
// CREATE GRADE REPORT
// ========================================
router.post("/", createGradeReport);

// ========================================
// UPDATE GRADE REPORT
// ========================================
router.put("/:id", updateGradeReport);

// ========================================
// UPDATE MARKS ONLY
// ========================================
router.patch("/marks/:id", updateMarks);

// ========================================
// DELETE GRADE REPORT
// ========================================
router.delete("/:id", deleteGradeReport);

module.exports = router;