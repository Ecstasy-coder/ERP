const pool = require("../config/db");

// Get all subjects
const getAllSubjects = async () => {
    const result = await pool.query(
        "SELECT * FROM subjects ORDER BY id"
    );

    return result.rows;
};

// Add subject
const addSubject = async (subject_title, is_language, is_active) => {
    const result = await pool.query(
        `INSERT INTO subjects
        (subject_title, is_language, is_active)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [subject_title, is_language, is_active]
    );

    return result.rows[0];
};

// Update subject
const updateSubject = async (id, subject_title, is_language, is_active) => {
    const result = await pool.query(
        `UPDATE subjects
         SET subject_title = $1,
             is_language = $2,
             is_active = $3
         WHERE id = $4
         RETURNING *`,
        [subject_title, is_language, is_active, id]
    );

    return result.rows[0];
};

// Delete subject
const deleteSubject = async (id) => {
    const result = await pool.query(
        `DELETE FROM subjects
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllSubjects,
    addSubject,
    updateSubject,
    deleteSubject
};