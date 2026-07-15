const examTypeService = require("../services/examTypeService");

// Get All Exam Types
const getAllExamTypes = async (req, res, next) => {
    try {
        const examTypes = await examTypeService.getAllExamTypes();

        res.status(200).json({
            success: true,
            count: examTypes.length,
            data: examTypes
        });

    } catch (error) {
        next(error);
    }
};

// Get Exam Type By Id
const getExamTypeById = async (req, res, next) => {
    try {

        const { id } = req.params;

        const examType = await examTypeService.getExamTypeById(id);

        res.status(200).json({
            success: true,
            data: examType
        });

    } catch (error) {
        next(error);
    }
};

// Create Exam Type
const createExamType = async (req, res, next) => {
    try {

        const { exam_name } = req.body;

        const examType = await examTypeService.createExamType(exam_name);

        res.status(201).json({
            success: true,
            message: "Exam Type created successfully.",
            data: examType
        });

    } catch (error) {
        next(error);
    }
};

// Update Exam Type
const updateExamType = async (req, res, next) => {
    try {

        const { id } = req.params;
        const { exam_name } = req.body;

        const examType = await examTypeService.updateExamType(id, exam_name);

        res.status(200).json({
            success: true,
            message: "Exam Type updated successfully.",
            data: examType
        });

    } catch (error) {
        next(error);
    }
};

// Delete Exam Type
const deleteExamType = async (req, res, next) => {
    try {

        const { id } = req.params;

        const response = await examTypeService.deleteExamType(id);

        res.status(200).json({
            success: true,
            message: response.message
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllExamTypes,
    getExamTypeById,
    createExamType,
    updateExamType,
    deleteExamType
};