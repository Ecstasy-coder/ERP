const pool = require("../config/db");

// ======================
// GET ALL CLASS SECTIONS
// ======================
const getAllClassSections = async () => {

    const query = `
        SELECT
            cs.id,
            cs.class_id,
            sc.class_name,
            cs.section_name,
            cs.status,
            cs.created_at,
            cs.updated_at
        FROM class_sections cs
        LEFT JOIN study_classes sc
            ON cs.class_id = sc.id
        ORDER BY cs.id ASC;
    `;

    const { rows } = await pool.query(query);

    return rows;
};

// ======================
// GET CLASS SECTION BY ID
// ======================
const getClassSectionById = async (id) => {

    const query = `
        SELECT
            cs.id,
            cs.class_id,
            sc.class_name,
            cs.section_name,
            cs.status,
            cs.created_at,
            cs.updated_at
        FROM class_sections cs
        LEFT JOIN study_classes sc
            ON cs.class_id = sc.id
        WHERE cs.id = $1;
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0];
};

// ======================
// CREATE CLASS SECTION
// ======================
const createClassSection = async (data) => {

    const query = `
        INSERT INTO class_sections
        (
            class_id,
            section_name,
            status
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        RETURNING *;
    `;

    const values = [
        data.class_id,
        data.section_name,
        data.status
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
};
// ======================
// UPDATE CLASS SECTION
// ======================
const updateClassSection = async (id, data) => {

    const query = `
        UPDATE class_sections
        SET
            class_id = $1,
            section_name = $2,
            status = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *;
    `;

    const values = [
        data.class_id,
        data.section_name,
        data.status,
        id
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
};

// ======================
// DELETE CLASS SECTION
// ======================
const deleteClassSection = async (id) => {

    const query = `
        DELETE
        FROM class_sections
        WHERE id = $1
        RETURNING *;
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0];
};

module.exports = {
    getAllClassSections,
    getClassSectionById,
    createClassSection,
    updateClassSection,
    deleteClassSection,
};