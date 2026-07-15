const gradeModel = require("../models/gradeSystemModel");

// Get All Grades
const getAllGrades = async () => {
    return await gradeModel.getAllGrades();
};

// Get Grade By Id
const getGradeById = async (id) => {

    const grade = await gradeModel.getGradeById(id);

    if (!grade)
        throw new Error("Grade not found.");

    return grade;
};

// Create Grade
const createGrade = async (
    gradeName,
    minMarks,
    maxMarks
) => {

    if (!gradeName)
        throw new Error("Grade is required.");

    if (minMarks > maxMarks)
        throw new Error("Minimum marks cannot be greater than maximum marks.");

    const existing =
        await gradeModel.getGradeByName(gradeName);

    if (existing)
        throw new Error("Grade already exists.");

    return await gradeModel.createGrade(
        gradeName,
        minMarks,
        maxMarks
    );
};

// Update Grade
const updateGrade = async (
    id,
    gradeName,
    minMarks,
    maxMarks
) => {

    if (minMarks > maxMarks)
        throw new Error("Invalid marks range.");

    const existing =
        await gradeModel.getGradeByName(gradeName);

    if (existing && existing.grade_id != id)
        throw new Error("Grade already exists.");

    return await gradeModel.updateGrade(
        id,
        gradeName,
        minMarks,
        maxMarks
    );
};

// Delete Grade
const deleteGrade = async (id) => {

    const grade =
        await gradeModel.getGradeById(id);

    if (!grade)
        throw new Error("Grade not found.");

    await gradeModel.deleteGrade(id);

    return {
        message: "Grade deleted successfully."
    };
};

module.exports = {

    getAllGrades,

    getGradeById,

    createGrade,

    updateGrade,

    deleteGrade

};