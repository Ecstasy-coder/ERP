const driverModel = require("../models/driverModel");

// ================================
// Add Driver
// ================================
const addDriver = async (req, res) => {
    try {

        const driver = await driverModel.addDriver(req.body);

        res.status(201).json({
            success: true,
            message: "Driver added successfully",
            data: driver
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add driver",
            error: error.message
        });

    }
};

// ================================
// Get All Drivers
// ================================
const getDrivers = async (req, res) => {
    try {

        const drivers = await driverModel.getDrivers();

        res.status(200).json({
            success: true,
            count: drivers.length,
            data: drivers
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch drivers",
            error: error.message
        });

    }
};

// ================================
// Get Driver By ID
// ================================
const getDriverById = async (req, res) => {
    try {

        const driver = await driverModel.getDriverById(req.params.id);

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found"
            });
        }

        res.status(200).json({
            success: true,
            data: driver
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch driver",
            error: error.message
        });

    }
};

// ================================
// Update Driver
// ================================
const updateDriver = async (req, res) => {
    try {

        const driver = await driverModel.updateDriver(req.params.id, req.body);

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Driver updated successfully",
            data: driver
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update driver",
            error: error.message
        });

    }
};

// ================================
// Delete Driver
// ================================
const deleteDriver = async (req, res) => {
    try {

        const driver = await driverModel.deleteDriver(req.params.id);

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Driver deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete driver",
            error: error.message
        });

    }
};

module.exports = {
    addDriver,
    getDrivers,
    getDriverById,
    updateDriver,
    deleteDriver
};