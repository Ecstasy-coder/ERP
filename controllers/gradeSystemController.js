const gradeSystemService = require("../services/gradeSystemService");

// Get All Grades
const getAllGrades = async (req, res, next) => {
    try {

        const grades = await gradeSystemService.getAllGrades();

        res.status(200).json({
            success: true,
            count: grades.length,
            data: grades
        });

    } catch (error) {
        next(error);
    }
};

// Get Grade By Id
const getGradeById = async (req, res, next) => {
    try {

        const { id } = req.params;

        const grade = await gradeSystemService.getGradeById(id);

        res.status(200).json({
            success: true,
            data: grade
        });

    } catch (error) {
        next(error);
    }
};

// Create Grade
const createGrade = async (req, res, next) => {
    try {

        const {
            grade_name,
            min_marks,
            max_marks
        } = req.body;

        const grade = await gradeSystemService.createGrade(
            grade_name,
            min_marks,
            max_marks
        );

        res.status(201).json({
            success: true,
            message: "Grade created successfully.",
            data: grade
        });

    } catch (error) {
        next(error);
    }
};

// Update Grade
const updateGrade = async (req, res, next) => {
    try {

        const { id } = req.params;

        const {
            grade_name,
            min_marks,
            max_marks
        } = req.body;

        const grade = await gradeSystemService.updateGrade(
            id,
            grade_name,
            min_marks,
            max_marks
        );

        res.status(200).json({
            success: true,
            message: "Grade updated successfully.",
            data: grade
        });

    } catch (error) {
        next(error);
    }
};

// Delete Grade
const deleteGrade = async (req, res, next) => {
    try {

        const { id } = req.params;

        const response = await gradeSystemService.deleteGrade(id);

        res.status(200).json({
            success: true,
            message: response.message
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {

    getAllGrades,
    getGradeById,
    createGrade,
    updateGrade,
    deleteGrade

};