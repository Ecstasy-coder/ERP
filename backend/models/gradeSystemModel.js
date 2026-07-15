const pool = require("../config/db");

// Get All Grades
const getAllGrades = async () => {

    const result = await pool.query(`
        SELECT *
        FROM grade_system
        ORDER BY max_marks DESC
    `);

    return result.rows;
};

// Get Grade By Id
const getGradeById = async (id) => {

    const result = await pool.query(
        `SELECT *
         FROM grade_system
         WHERE grade_id=$1`,
        [id]
    );

    return result.rows[0];
};

// Check Duplicate Grade
const getGradeByName = async (gradeName) => {

    const result = await pool.query(
        `SELECT *
         FROM grade_system
         WHERE LOWER(grade_name)=LOWER($1)`,
        [gradeName]
    );

    return result.rows[0];
};

// Create Grade
const createGrade = async (gradeName, minMarks, maxMarks) => {

    const result = await pool.query(

        `INSERT INTO grade_system
        (grade_name,min_marks,max_marks)

        VALUES($1,$2,$3)

        RETURNING *`,

        [gradeName, minMarks, maxMarks]

    );

    return result.rows[0];
};

// Update Grade
const updateGrade = async (
    id,
    gradeName,
    minMarks,
    maxMarks
) => {

    const result = await pool.query(

        `UPDATE grade_system

        SET grade_name=$1,
            min_marks=$2,
            max_marks=$3

        WHERE grade_id=$4

        RETURNING *`,

        [
            gradeName,
            minMarks,
            maxMarks,
            id
        ]

    );

    return result.rows[0];
};

// Delete Grade
const deleteGrade = async (id) => {

    await pool.query(

        `DELETE FROM grade_system
         WHERE grade_id=$1`,

        [id]

    );
};

module.exports = {

    getAllGrades,

    getGradeById,

    getGradeByName,

    createGrade,

    updateGrade,

    deleteGrade

};