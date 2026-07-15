const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicleController");


// ====================================
// Add Vehicle
// POST /api/vehicles
// ====================================
router.post("/", vehicleController.addVehicle);

// ====================================
// Get All Vehicles
// GET /api/vehicles
// ====================================
router.get("/", vehicleController.getVehicles);

// ====================================
// Get Vehicle By ID
// GET /api/vehicles/:id
// ====================================
router.get("/:id", vehicleController.getVehicleById);

// ====================================
// Update Vehicle
// PUT /api/vehicles/:id
// ====================================
router.put("/:id", vehicleController.updateVehicle);

// ====================================
// Delete Vehicle
// DELETE /api/vehicles/:id
// ====================================
router.delete("/:id", vehicleController.deleteVehicle);

module.exports = router;