const pool = require("../config/db");

// Get all class-subject mappings
const getAllMappings = async () => {
    const result = await pool.query(
        "SELECT * FROM class_subject_mapping ORDER BY id"
    );

    return result.rows;
};

// Add a new class-subject mapping
const addMapping = async (class_name, subject_name) => {
    const result = await pool.query(
        `INSERT INTO class_subject_mapping
        (class_name, subject_name)
        VALUES ($1, $2)
        RETURNING *`,
        [class_name, subject_name]
    );

    return result.rows[0];
};

// Update class-subject mapping
const updateMapping = async (id, class_name, subject_name) => {
    const result = await pool.query(
        `UPDATE class_subject_mapping
         SET class_name = $1,
             subject_name = $2
         WHERE id = $3
         RETURNING *`,
        [class_name, subject_name, id]
    );

    return result.rows[0];
};

// Delete class-subject mapping
const deleteMapping = async (id) => {
    const result = await pool.query(
        `DELETE FROM class_subject_mapping
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllMappings,
    addMapping,
    updateMapping,
    deleteMapping
};