const pool = require("../config/db");

const getHolidayReport = async () => {

    const query = `
        SELECT
            TO_CHAR(holiday_date, 'DD/MM/YYYY') AS date,
            TRIM(TO_CHAR(holiday_date, 'Day')) AS day,
            description
        FROM holidays
        ORDER BY holiday_date;
    `;

    const result = await pool.query(query);

    return result.rows;
};

module.exports = {
    getHolidayReport
};