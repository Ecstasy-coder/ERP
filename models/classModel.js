const pool = require("../config/db");

// Get All Classes
const getClasses = async() => {
    const result = await pool.query(
        "SELECT * FROM study_classes ORDER BY id"
    );

    return result.rows;
};

// Get Single Class
const getClass = async(id) => {
    const result = await pool.query(
        "SELECT * FROM study_classes WHERE id=$1", [id]
    );

    return result.rows[0];
};

// Add Class
const addClass = async(class_name, is_active) => {

    const result = await pool.query(

        `INSERT INTO study_classes
        (class_name,is_active)

        VALUES($1,$2)

        RETURNING *`,

        [class_name, is_active]
    );

    return result.rows[0];
};

// Update

// const updateClass = async (
// id,
// class_name,
// is_active
// ) => {

// const result = await pool.query(

// `UPDATE study_classes

// SET

// class_name=$1,

// is_active=$2,

// updated_at=NOW()

// WHERE id=$3

// RETURNING *`,

// [class_name,is_active,id]

// );

// return result.rows[0];

// };

// // Delete

// const deleteClass = async(id)=>{

// await pool.query(

// "DELETE FROM study_classes WHERE id=$1",

// [id]

// );

// };
const updateClass = async(id, class_name, is_active) => {

    const result = await pool.query(
        `UPDATE study_classes
         SET class_name=$1,
             is_active=$2,
             updated_at=NOW()
         WHERE id=$3
         RETURNING *`, [class_name, is_active, id]
    );

    return result.rows[0];
};

const deleteClass = async(id) => {

    const result = await pool.query(
        "DELETE FROM study_classes WHERE id=$1 RETURNING *", [id]
    );

    return result.rows[0];
};

module.exports = {

    getClasses,

    getClass,

    addClass,

    updateClass,

    deleteClass

};