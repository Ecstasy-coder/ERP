const pool = require("../config/db");

// ==========================
// Get All Grade Reports
// ==========================
const getAllGradeReports = async () => {

    const query = `
        SELECT *
        FROM grade_report_design
        ORDER BY report_id ASC
    `;

    const result = await pool.query(query);

    return result.rows;
};

// ==========================
// Get Grade Reports By Class
// ==========================
const getGradeReportByClass = async (className) => {

    const query = `
        SELECT *
        FROM grade_report_design
        WHERE class_name = $1
        ORDER BY report_id ASC
    `;

    const result = await pool.query(query, [className]);

    return result.rows;
};

// ==========================
// Get Grade Report By Id
// ==========================
const getGradeReportById = async (id) => {

    const query = `
        SELECT *
        FROM grade_report_design
        WHERE report_id = $1
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

// ==========================
// Create Grade Report
// ==========================
const createGradeReport = async (

    className,
    subjectName,
    evaluationName,
    examTypeId,
    maxMarks

) => {

    const query = `
        INSERT INTO grade_report_design
        (
            class_name,
            subject_name,
            evaluation_name,
            exam_type_id,
            max_marks
        )
        VALUES
        ($1,$2,$3,$4,$5)
        RETURNING *
    `;

    const result = await pool.query(query, [

        className,
        subjectName,
        evaluationName,
        examTypeId,
        maxMarks

    ]);

    return result.rows[0];

};

// ==========================
// Update Grade Report
// ==========================
const updateGradeReport = async (

    id,
    className,
    subjectName,
    evaluationName,
    examTypeId,
    maxMarks

) => {

    const query = `
        UPDATE grade_report_design

        SET

        class_name = $1,
        subject_name = $2,
        evaluation_name = $3,
        exam_type_id = $4,
        max_marks = $5

        WHERE report_id = $6

        RETURNING *
    `;

    const result = await pool.query(query, [

        className,
        subjectName,
        evaluationName,
        examTypeId,
        maxMarks,
        id

    ]);

    return result.rows[0];

};

// ==========================
// Update Marks
// ==========================
const updateMarks = async (

    id,
    maxMarks

) => {

    const query = `
        UPDATE grade_report_design

        SET max_marks = $1

        WHERE report_id = $2

        RETURNING *
    `;

    const result = await pool.query(query, [

        maxMarks,
        id

    ]);

    return result.rows[0];

};

// ==========================
// Delete Grade Report
// ==========================
const deleteGradeReport = async (id) => {

    const query = `
        DELETE
        FROM grade_report_design
        WHERE report_id = $1
    `;

    await pool.query(query, [id]);

};

module.exports = {

    getAllGradeReports,

    getGradeReportByClass,

    getGradeReportById,

    createGradeReport,

    updateGradeReport,

    updateMarks,

    deleteGradeReport

};