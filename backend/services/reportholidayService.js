const ReportHoliday = require("../models/reportholidayModel");

const getHolidayReport = async () => {

    const holidays = await ReportHoliday.getHolidayReport();

    return holidays;

};

module.exports = {
    getHolidayReport
};