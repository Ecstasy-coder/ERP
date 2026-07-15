const express = require("express");
const router = express.Router();

const classSubjectController = require("../controllers/classSubjectController");

// Get all mappings
router.get("/", classSubjectController.getAllMappings);

// Add mapping
router.post("/", classSubjectController.addMapping);

// Update mapping
router.put("/:id", classSubjectController.updateMapping);

// Delete mapping
router.delete("/:id", classSubjectController.deleteMapping);

module.exports = router;