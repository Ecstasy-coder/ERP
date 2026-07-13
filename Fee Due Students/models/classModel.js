const pool = require("../config/db");

// Create Class
const createClass = async (class_name) => {

    const result = await pool.query(
        `
        INSERT INTO fee_due_classes(class_name)
        VALUES($1)
        RETURNING *;
        `,
        [class_name]
    );

    return result.rows[0];

};

// Get All Classes
const getAllClasses = async () => {

    const result = await pool.query(
        `
        SELECT *
        FROM fee_due_classes
        ORDER BY class_name;
        `
    );

    return result.rows;

};

// Get Class By ID
const getClassById = async (id) => {

    const result = await pool.query(
        `
        SELECT *
        FROM fee_due_classes
        WHERE class_id=$1;
        `,
        [id]
    );

    return result.rows[0];

};

// Update Class
const updateClass = async (id, class_name) => {

    const result = await pool.query(
        `
        UPDATE fee_due_classes
        SET class_name=$1
        WHERE class_id=$2
        RETURNING *;
        `,
        [class_name, id]
    );

    return result.rows[0];

};

// Delete Class
const deleteClass = async (id) => {

    const result = await pool.query(
        `
        DELETE FROM fee_due_classes
        WHERE class_id=$1
        RETURNING *;
        `,
        [id]
    );

    return result.rows[0];

};

module.exports = {

    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass

};