const pool = require("../config/db");

// ==============================
// Get All Academic Years
// ==============================
const getAllAcademicYears = async () => {

    const result = await pool.query(`
        SELECT
            academic_year_id,
            academic_year,
            is_active,
            is_current,
            created_at,
            updated_at
        FROM academic_years
        ORDER BY academic_year_id ASC
    `);

    return result.rows;
};


// ==============================
// Get Academic Year By ID
// ==============================
const getAcademicYearById = async (id) => {

    const result = await pool.query(
        `
        SELECT
            academic_year_id,
            academic_year,
            is_active,
            is_current,
            created_at,
            updated_at
        FROM academic_years
        WHERE academic_year_id = $1
        `,
        [id]
    );

    return result.rows[0];
};


// ==============================
// Create Academic Year
// ==============================
const createAcademicYear = async (academicYear) => {

    const { academic_year, is_active } = academicYear;

    const result = await pool.query(
        `
        INSERT INTO academic_years
        (academic_year, is_active)
        VALUES ($1, $2)
        RETURNING *;
        `,
        [academic_year, is_active]
    );

    return result.rows[0];
};


// ==============================
// Update Academic Year
// ==============================
const updateAcademicYear = async (id, academicYear) => {

    const { academic_year, is_active } = academicYear;

    const result = await pool.query(
        `
        UPDATE academic_years
        SET
            academic_year = $1,
            is_active = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE academic_year_id = $3
        RETURNING *;
        `,
        [academic_year, is_active, id]
    );

    return result.rows[0];
};


// ==============================
// Delete Academic Year
// ==============================
const deleteAcademicYear = async (id) => {

    const result = await pool.query(
        `
        DELETE FROM academic_years
        WHERE academic_year_id = $1
        RETURNING *;
        `,
        [id]
    );

    return result.rows[0];
};


// ==============================
// Reset Current Academic Year
// ==============================
const resetCurrentAcademicYear = async () => {

    await pool.query(`
        UPDATE academic_years
        SET is_current = FALSE
    `);

};


// ==============================
// Set Current Academic Year
// ==============================
const setCurrentAcademicYear = async (id) => {

    const result = await pool.query(
        `
        UPDATE academic_years
        SET
            is_current = TRUE,
            updated_at = CURRENT_TIMESTAMP
        WHERE academic_year_id = $1
        RETURNING *;
        `,
        [id]
    );

    return result.rows[0];
};


module.exports = {

    getAllAcademicYears,

    getAcademicYearById,

    createAcademicYear,

    updateAcademicYear,

    deleteAcademicYear,

    resetCurrentAcademicYear,

    setCurrentAcademicYear

};