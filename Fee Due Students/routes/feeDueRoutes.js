const express = require("express");

const router = express.Router();

const feeDueController = require("../controllers/feeDueController");

// ===================================
// ERP APIs
// ===================================

// ERP Fee Due List
router.get("/list", feeDueController.getFeeDueList);

// Dynamic Filter API
router.get("/filter", feeDueController.filterFeeDue);

// Search API
router.get("/search", feeDueController.searchFeeDue);

// ===================================
// CRUD APIs
// ===================================

// Create Fee Due
router.post("/", feeDueController.createFeeDue);

// Get All Fee Due
router.get("/", feeDueController.getAllFeeDue);

// Get Fee Due By Id
router.get("/:id", feeDueController.getFeeDueById);

// Update Fee Due
router.put("/:id", feeDueController.updateFeeDue);

// Delete Fee Due
router.delete("/:id", feeDueController.deleteFeeDue);

module.exports = router;