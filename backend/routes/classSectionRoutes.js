const express = require("express");

const router = express.Router();

const classSectionController = require("../controllers/classSectionController");

// GET All Sections
router.get("/", classSectionController.getAllClassSections);

// GET Section By ID
router.get("/:id", classSectionController.getClassSectionById);

// CREATE Section
router.post("/", classSectionController.createClassSection);

// UPDATE Section
router.put("/:id", classSectionController.updateClassSection);

// DELETE Section
router.delete("/:id", classSectionController.deleteClassSection);

module.exports = router;