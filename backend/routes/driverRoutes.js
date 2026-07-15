const express = require("express");
const router = express.Router();

const driverController = require("../controllers/driverController");

// ====================================
// Add Driver
// POST /api/drivers
// ====================================
router.post("/", driverController.addDriver);

// ====================================
// Get All Drivers
// GET /api/drivers
// ====================================
router.get("/", driverController.getDrivers);

// ====================================
// Get Driver By ID
// GET /api/drivers/:id
// ====================================
router.get("/:id", driverController.getDriverById);

// ====================================
// Update Driver
// PUT /api/drivers/:id
// ====================================
router.put("/:id", driverController.updateDriver);

// ====================================
// Delete Driver
// DELETE /api/drivers/:id
// ====================================
router.delete("/:id", driverController.deleteDriver);

module.exports = router;