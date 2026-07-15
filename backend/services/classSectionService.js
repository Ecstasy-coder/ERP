const classSectionModel = require("../models/classSectionModel");

// ======================
// GET ALL CLASS SECTIONS
// ======================
const getAllClassSections = async () => {
    return await classSectionModel.getAllClassSections();
};

// ======================
// GET CLASS SECTION BY ID
// ======================
const getClassSectionById = async (id) => {
    return await classSectionModel.getClassSectionById(id);
};

// ======================
// CREATE CLASS SECTION
// ======================
const createClassSection = async (data) => {
    return await classSectionModel.createClassSection(data);
};

// ======================
// UPDATE CLASS SECTION
// ======================
const updateClassSection = async (id, data) => {
    return await classSectionModel.updateClassSection(id, data);
};

// ======================
// DELETE CLASS SECTION
// ======================
const deleteClassSection = async (id) => {
    return await classSectionModel.deleteClassSection(id);
};

module.exports = {
    getAllClassSections,
    getClassSectionById,
    createClassSection,
    updateClassSection,
    deleteClassSection,
};