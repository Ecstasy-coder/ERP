const holidayModel = require("../models/holidayModel");

// Get all holidays
const getAllHolidays = async () => {
    return await holidayModel.getAllHolidays();
};

// Get holiday by ID
const getHolidayById = async (id) => {
    const holiday = await holidayModel.getHolidayById(id);

    if (!holiday) {
        throw new Error("Holiday not found");
    }

    return holiday;
};

// Create holiday
const createHoliday = async (holidayData) => {


    const result = await holidayModel.createHoliday(holidayData);

   

    return result;

};

// Update holiday
const updateHoliday = async (id, holidayData) => {
    const holiday = await holidayModel.getHolidayById(id);

    if (!holiday) {
        throw new Error("Holiday not found");
    }

    return await holidayModel.updateHoliday(id, holidayData);
};

// Delete holiday
const deleteHoliday = async (id) => {
    const holiday = await holidayModel.getHolidayById(id);

    if (!holiday) {
        throw new Error("Holiday not found");
    }

    return await holidayModel.deleteHoliday(id);
};

module.exports = {
    getAllHolidays,
    getHolidayById,
    createHoliday,
    updateHoliday,
    deleteHoliday
};