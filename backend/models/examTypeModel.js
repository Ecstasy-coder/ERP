const pool = require("../config/db");

// Get All Exam Types
const getAllExamTypes = async () => {
    const query = `
        SELECT *
        FROM exam_types
        ORDER BY exam_type_id ASC
    `;

    const result = await pool.query(query);
    return result.rows;
};

// Get Exam Type By Id
const getExamTypeById = async (id) => {
    const query = `
        SELECT *
        FROM exam_types
        WHERE exam_type_id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
};

// Check Duplicate Exam Type
const getExamTypeByName = async (examName) => {
    const query = `
        SELECT *
        FROM exam_types
        WHERE LOWER(exam_name)=LOWER($1)
    `;

    const result = await pool.query(query, [examName]);
    return result.rows[0];
};

// Create Exam Type
const createExamType = async (examName) => {

    const query = `
        INSERT INTO exam_types(exam_name)
        VALUES($1)
        RETURNING *
    `;

    const result = await pool.query(query, [examName]);

    return result.rows[0];
};

// Update Exam Type
const updateExamType = async (id, examName) => {

    const query = `
        UPDATE exam_types
        SET exam_name=$1
        WHERE exam_type_id=$2
        RETURNING *
    `;

    const result = await pool.query(query, [examName, id]);

    return result.rows[0];
};

// Delete Exam Type
const deleteExamType = async (id) => {

    const query = `
        DELETE FROM exam_types
        WHERE exam_type_id=$1
    `;

    await pool.query(query, [id]);
};

module.exports = {

    getAllExamTypes,
    getExamTypeById,
    getExamTypeByName,
    createExamType,
    updateExamType,
    deleteExamType

};