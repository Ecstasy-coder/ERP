const express = require("express");

const router = express.Router();

const {
    getAllExamTypes,
    getExamTypeById,
    createExamType,
    updateExamType,
    deleteExamType
} = require("../controllers/examTypeController");


// Get All Exam Types
router.get("/", getAllExamTypes);

// Get Exam Type By Id
router.get("/:id", getExamTypeById);

// Create Exam Type
router.post("/", createExamType);

// Update Exam Type
router.put("/:id", updateExamType);

// Delete Exam Type
router.delete("/:id", deleteExamType);

module.exports = router;