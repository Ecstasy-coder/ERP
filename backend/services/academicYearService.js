const AcademicYear = require("../models/academicYearModel");


// ===============================
// Get All Academic Years
// ===============================
const getAllAcademicYears = async () => {

    return await AcademicYear.getAllAcademicYears();

};


// ===============================
// Get Academic Year By ID
// ===============================
const getAcademicYearById = async (id) => {

    return await AcademicYear.getAcademicYearById(id);

};


// ===============================
// Create Academic Year
// ===============================
const createAcademicYear = async (academicYear) => {

    return await AcademicYear.createAcademicYear(academicYear);

};


// ===============================
// Update Academic Year
// ===============================
const updateAcademicYear = async (id, academicYear) => {

    return await AcademicYear.updateAcademicYear(id, academicYear);

};


// ===============================
// Delete Academic Year
// ===============================
const deleteAcademicYear = async (id) => {

    return await AcademicYear.deleteAcademicYear(id);

};


// ===============================
// Set Current Academic Year
// ===============================
const setCurrentAcademicYear = async (id) => {

    // Reset every academic year
    await AcademicYear.resetCurrentAcademicYear();

    // Set selected academic year as current
    return await AcademicYear.setCurrentAcademicYear(id);

};


module.exports = {

    getAllAcademicYears,

    getAcademicYearById,

    createAcademicYear,

    updateAcademicYear,

    deleteAcademicYear,

    setCurrentAcademicYear

};