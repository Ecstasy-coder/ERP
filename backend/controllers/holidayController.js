const holidayService = require("../services/holidayService");

// Get all holidays
const getAllHolidays = async (req, res) => {
    try {
        const holidays = await holidayService.getAllHolidays();

        res.status(200).json({
            success: true,
            message: "Holidays fetched successfully",
            data: holidays
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get holiday by ID
const getHolidayById = async (req, res) => {
    try {
        const { id } = req.params;

        const holiday = await holidayService.getHolidayById(id);

        res.status(200).json({
            success: true,
            message: "Holiday fetched successfully",
            data: holiday
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ===========================
// Create Holiday (DEBUG)
// ===========================
const createHoliday = async (req, res) => {


    try {


        const holiday = await holidayService.createHoliday(req.body);


        return res.status(201).json({
            success: true,
            message: "Holiday added successfully",
            data: holiday
        });

    } catch (error) {


        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Update holiday
const updateHoliday = async (req, res) => {
    try {
        const { id } = req.params;

        const holiday = await holidayService.updateHoliday(id, req.body);

        res.status(200).json({
            success: true,
            message: "Holiday updated successfully",
            data: holiday
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// Delete holiday
const deleteHoliday = async (req, res) => {
    try {
        const { id } = req.params;

        const holiday = await holidayService.deleteHoliday(id);

        res.status(200).json({
            success: true,
            message: "Holiday deleted successfully",
            data: holiday
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllHolidays,
    getHolidayById,
    createHoliday,
    updateHoliday,
    deleteHoliday
};