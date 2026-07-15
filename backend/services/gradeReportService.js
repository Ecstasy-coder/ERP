const gradeReportModel = require("../models/gradeReportModel");

// =====================================
// Get All Grade Reports
// =====================================
const getAllGradeReports = async () => {

    return await gradeReportModel.getAllGradeReports();

};

// =====================================
// Get Grade Report By Class
// =====================================
const getGradeReportByClass = async (className) => {

    if (!className) {
        throw new Error("Class is required.");
    }

    return await gradeReportModel.getGradeReportByClass(className);

};

// =====================================
// Get Grade Report By Id
// =====================================
const getGradeReportById = async (id) => {

    const report = await gradeReportModel.getGradeReportById(id);

    if (!report) {
        throw new Error("Grade Report not found.");
    }

    return report;

};

// =====================================
// Create Grade Report
// =====================================
const createGradeReport = async (

    className,
    subjectName,
    evaluationName,
    examTypeId,
    maxMarks

) => {

    if (
        !className ||
        !subjectName ||
        !evaluationName ||
        !examTypeId
    ) {
        throw new Error("All fields are required.");
    }

    if (maxMarks < 0) {
        throw new Error("Marks cannot be negative.");
    }

    return await gradeReportModel.createGradeReport(

        className,
        subjectName,
        evaluationName,
        examTypeId,
        maxMarks

    );

};

// =====================================
// Update Grade Report
// =====================================
const updateGradeReport = async (

    id,
    className,
    subjectName,
    evaluationName,
    examTypeId,
    maxMarks

) => {

    const report = await gradeReportModel.getGradeReportById(id);

    if (!report) {
        throw new Error("Grade Report not found.");
    }

    if (maxMarks < 0) {
        throw new Error("Marks cannot be negative.");
    }

    return await gradeReportModel.updateGradeReport(

        id,
        className,
        subjectName,
        evaluationName,
        examTypeId,
        maxMarks

    );

};

// =====================================
// Update Marks Only
// =====================================
const updateMarks = async (

    id,
    maxMarks

) => {

    const report = await gradeReportModel.getGradeReportById(id);

    if (!report) {
        throw new Error("Grade Report not found.");
    }

    if (maxMarks < 0) {
        throw new Error("Marks cannot be negative.");
    }

    return await gradeReportModel.updateMarks(

        id,
        maxMarks

    );

};

// =====================================
// Delete Grade Report
// =====================================
const deleteGradeReport = async (id) => {

    const report = await gradeReportModel.getGradeReportById(id);

    if (!report) {
        throw new Error("Grade Report not found.");
    }

    await gradeReportModel.deleteGradeReport(id);

    return {

        message: "Grade Report deleted successfully."

    };

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