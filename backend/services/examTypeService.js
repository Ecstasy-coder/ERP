const examTypeModel = require("../models/examTypeModel");

// Get All Exam Types
const getAllExamTypes = async () => {
    return await examTypeModel.getAllExamTypes();
};

// Get Exam Type By Id
const getExamTypeById = async (id) => {

    const examType = await examTypeModel.getExamTypeById(id);

    if (!examType) {
        throw new Error("Exam Type not found.");
    }

    return examType;
};

// Create Exam Type
const createExamType = async (examName) => {

    if (!examName || examName.trim() === "") {
        throw new Error("Exam Type is required.");
    }

    const existing = await examTypeModel.getExamTypeByName(examName);

    if (existing) {
        throw new Error("Exam Type already exists.");
    }

    return await examTypeModel.createExamType(examName.trim());
};

// Update Exam Type
const updateExamType = async (id, examName) => {

    if (!examName || examName.trim() === "") {
        throw new Error("Exam Type is required.");
    }

    const existing = await examTypeModel.getExamTypeByName(examName);

    if (existing && existing.exam_type_id != id) {
        throw new Error("Exam Type already exists.");
    }

    const updated = await examTypeModel.updateExamType(id, examName.trim());

    if (!updated) {
        throw new Error("Exam Type not found.");
    }

    return updated;
};

// Delete Exam Type
const deleteExamType = async (id) => {

    const examType = await examTypeModel.getExamTypeById(id);

    if (!examType) {
        throw new Error("Exam Type not found.");
    }

    await examTypeModel.deleteExamType(id);

    return {
        message: "Exam Type deleted successfully."
    };
};

module.exports = {

    getAllExamTypes,
    getExamTypeById,
    createExamType,
    updateExamType,
    deleteExamType

};