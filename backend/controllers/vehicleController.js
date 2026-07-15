const vehicleModel = require("../models/vehicleModel");

// ======================================
// Add Vehicle
// ======================================
const addVehicle = async (req, res) => {
    try {

        const vehicle = await vehicleModel.addVehicle(req.body);

        res.status(201).json({
            success: true,
            message: "Vehicle added successfully",
            data: vehicle
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add vehicle",
            error: error.message
        });

    }
};

// ======================================
// Get All Vehicles
// ======================================
const getVehicles = async (req, res) => {
    try {

        const vehicles = await vehicleModel.getVehicles();

        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch vehicles",
            error: error.message
        });

    }
};

// ======================================
// Get Vehicle By ID
// ======================================
const getVehicleById = async (req, res) => {
    try {

        const vehicle = await vehicleModel.getVehicleById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            data: vehicle
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch vehicle",
            error: error.message
        });

    }
};

// ======================================
// Update Vehicle
// ======================================
const updateVehicle = async (req, res) => {
    try {

        const vehicle = await vehicleModel.updateVehicle(req.params.id, req.body);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: vehicle
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update vehicle",
            error: error.message
        });

    }
};

// ======================================
// Delete Vehicle
// ======================================
const deleteVehicle = async (req, res) => {
    try {

        const vehicle = await vehicleModel.deleteVehicle(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete vehicle",
            error: error.message
        });

    }
};

module.exports = {
    addVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};