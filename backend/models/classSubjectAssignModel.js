const pool = require("../config/db");

// ===============================
// Get All Assignments
// ===============================
const getAssignments = async () => {
    const result = await pool.query(`
        SELECT
            a.id,
            a.class_id,
            c.class_name,
            a.subject_id,
            s.subject_title,
            a.is_active,
            a.created_at,
            a.updated_at
        FROM class_subject_assignments a
        INNER JOIN study_classes c
            ON a.class_id = c.id
        INNER JOIN subjects s
            ON a.subject_id = s.id
        ORDER BY c.class_name, s.subject_title
    `);

    return result.rows;
};

// ===============================
// Get One Assignment
// ===============================
const getAssignment = async (id) => {
    const result = await pool.query(`
        SELECT
            a.id,
            a.class_id,
            c.class_name,
            a.subject_id,
            s.subject_title,
            a.is_active,
            a.created_at,
            a.updated_at
        FROM class_subject_assignments a
        INNER JOIN study_classes c
            ON a.class_id = c.id
        INNER JOIN subjects s
            ON a.subject_id = s.id
        WHERE a.id = $1
    `, [id]);

    return result.rows[0];
};

// ===============================
// Add Assignment
// ===============================
const addAssignment = async (class_id, subject_id, is_active) => {
    const result = await pool.query(`
        INSERT INTO class_subject_assignments
        (class_id, subject_id, is_active)
        VALUES ($1, $2, $3)
        RETURNING *
    `, [class_id, subject_id, is_active]);

    return result.rows[0];
};

// ===============================
// Update Assignment
// ===============================
const updateAssignment = async (
    id,
    class_id,
    subject_id,
    is_active
) => {
    const result = await pool.query(`
        UPDATE class_subject_assignments
        SET
            class_id = $1,
            subject_id = $2,
            is_active = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *
    `, [class_id, subject_id, is_active, id]);

    return result.rows[0];
};

// ===============================
// Delete Assignment
// ===============================
const deleteAssignment = async (id) => {
    const result = await pool.query(`
        DELETE FROM class_subject_assignments
        WHERE id = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};

module.exports = {
    getAssignments,
    getAssignment,
    addAssignment,
    updateAssignment,
    deleteAssignment
};