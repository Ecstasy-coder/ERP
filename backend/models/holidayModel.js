// const db = require("../config/db");

// // ===============================
// // Get All Holidays
// // ===============================
// const getAllHolidays = async () => {
//     const query = `
//         SELECT
//             holiday_id,
//             holiday_date,
//             description,
//             created_at
//         FROM holidays
//         ORDER BY holiday_date ASC;
//     `;

//     const result = await db.query(query);
//     return result.rows;
// };

// // ===============================
// // Get Holiday By ID
// // ===============================
// const getHolidayById = async (id) => {
//     const query = `
//         SELECT
//             holiday_id,
//             holiday_date,
//             description,
//             created_at
//         FROM holidays
//         WHERE holiday_id = $1;
//     `;

//     const result = await db.query(query, [id]);
//     return result.rows[0];
// };

// // ===============================
// // Create Holiday
// // ===============================
// const createHoliday = async (holiday) => {

//     console.log("========= MODEL HIT =========");
//     console.log(holiday);

//     const {
//         holiday_date,
//         description
//     } = holiday;

//     const query = `
//         INSERT INTO holidays
//         (
//             holiday_date,
//             description
//         )
//         VALUES
//         (
//             $1,
//             $2
//         )
//         RETURNING *;
//     `;

//     console.log("Executing SQL...");
//     console.log(query);

//     const result = await db.query(query, [
//         holiday_date,
//         description
//     ]);

//     console.log("SQL SUCCESS");
//     console.log(result.rows);

//     return result.rows[0];

// };
// //
// // ===============================
// // Update Holiday
// // ===============================
// const updateHoliday = async (id, holiday) => {
//     const {
//         holiday_date,
//         description
//     } = holiday;

//     const query = `
//         UPDATE holidays
//         SET
//             holiday_date = $1,
//             description = $2
//         WHERE holiday_id = $3
//         RETURNING *;
//     `;

//     const result = await db.query(query, [
//         holiday_date,
//         description,
//         id
//     ]);

//     return result.rows[0];
// };

// // ===============================
// // Delete Holiday
// // ===============================
// const deleteHoliday = async (id) => {
//     const query = `
//         DELETE FROM holidays
//         WHERE holiday_id = $1
//         RETURNING *;
//     `;

//     const result = await db.query(query, [id]);
//     return result.rows[0];
// };

// module.exports = {
//     getAllHolidays,
//     getHolidayById,
//     createHoliday,
//     updateHoliday,
//     deleteHoliday
// };

const db = require("../config/db");


// ===============================
// Get All Holidays
// ===============================
const getAllHolidays = async () => {
    const query = `
        SELECT
            ROW_NUMBER() OVER (ORDER BY holiday_date ASC) AS sno,
            holiday_id,
            holiday_date,
            description,
            created_at
        FROM holidays
        ORDER BY holiday_date ASC;
    `;

    const result = await db.query(query);
    return result.rows;
};

// ===============================
// Get Holiday By ID
// ===============================
const getHolidayById = async (id) => {

    const result = await db.query(
        `
        SELECT
            holiday_id,
            holiday_date,
            description,
            created_at
        FROM holidays
        WHERE holiday_id = $1
        `,
        [id]
    );

    return result.rows[0];
};

// ===============================
// Create Holiday
// ===============================
const createHoliday = async (holiday) => {

   

    const { holiday_date, description } = holiday;

    // Check duplicate (case insensitive)
    const duplicateResult = await db.query(
        `
        SELECT holiday_id
        FROM holidays
        WHERE holiday_date = $1
        AND LOWER(TRIM(description)) = LOWER(TRIM($2))
        `,
        [holiday_date, description]
    );

    if (duplicateResult.rows.length > 0) {
        throw new Error("Holiday already exists.");
    }

    // Insert holiday
    const result = await db.query(
        `
        INSERT INTO holidays
        (
            holiday_date,
            description
        )
        VALUES
        (
            $1,
            $2
        )
        RETURNING *;
        `,
        [holiday_date, description]
    );

    return result.rows[0];
};

// ===============================
// Update Holiday
// ===============================
const updateHoliday = async (id, holiday) => {

    const { holiday_date, description } = holiday;

    const result = await db.query(
        `
        UPDATE holidays
        SET
            holiday_date = $1,
            description = $2
        WHERE holiday_id = $3
        RETURNING *;
        `,
        [holiday_date, description, id]
    );

    return result.rows[0];
};

// ===============================
// Delete Holiday
// ===============================
const deleteHoliday = async (id) => {

    const result = await db.query(
        `
        DELETE FROM holidays
        WHERE holiday_id = $1
        RETURNING *;
        `,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllHolidays,
    getHolidayById,
    createHoliday,
    updateHoliday,
    deleteHoliday
};