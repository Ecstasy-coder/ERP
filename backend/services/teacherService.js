 const teacherModel = require("../models/teacherModel");

// ======================================
// Get All Teachers
// ======================================
const getAllTeachers = async () => {

    return await teacherModel.getAllTeachers();

};

// ======================================
// Get Teacher By Id
// ======================================
const getTeacherById = async (id) => {

    return await teacherModel.getTeacherById(id);

};

// ======================================
// Create Teacher
// ======================================
const createTeacher = async (teacherData) => {

    // Future Business Logic
    // Validation
    // Duplicate Employee Code Check
    // Duplicate Email Check

    return await teacherModel.createTeacher(teacherData);

};

// ======================================
// Update Teacher
// ======================================
const updateTeacher = async (id, teacherData) => {

    return await teacherModel.updateTeacher(id, teacherData);

};

// ======================================
// Delete Teacher
// ======================================
const deleteTeacher = async (id) => {

    return await teacherModel.deleteTeacher(id);

};

module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};