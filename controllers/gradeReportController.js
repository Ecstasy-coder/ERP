const gradeReportService = require("../services/gradeReportService");

// =======================================
// Get All Grade Reports
// =======================================
const getAllGradeReports = async (req, res, next) => {

    try {

        const reports = await gradeReportService.getAllGradeReports();

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });

    } catch (error) {

        next(error);

    }

};

// =======================================
// Get Grade Report By Class
// =======================================
const getGradeReportByClass = async (req, res, next) => {

    try {

        const { className } = req.params;

        const reports =
            await gradeReportService.getGradeReportByClass(className);

        res.status(200).json({

            success: true,
            count: reports.length,
            data: reports

        });

    } catch (error) {

        next(error);

    }

};

// =======================================
// Get Grade Report By Id
// =======================================
const getGradeReportById = async (req, res, next) => {

    try {

        const { id } = req.params;

        const report =
            await gradeReportService.getGradeReportById(id);

        res.status(200).json({

            success: true,
            data: report

        });

    } catch (error) {

        next(error);

    }

};

// =======================================
// Create Grade Report
// =======================================
const createGradeReport = async (req, res, next) => {

    try {

        const {

            class_name,
            subject_name,
            evaluation_name,
            exam_type_id,
            max_marks

        } = req.body;

        const report =
            await gradeReportService.createGradeReport(

                class_name,
                subject_name,
                evaluation_name,
                exam_type_id,
                max_marks

            );

        res.status(201).json({

            success: true,
            message: "Grade Report created successfully.",

            data: report

        });

    } catch (error) {

        next(error);

    }

};

// =======================================
// Update Grade Report
// =======================================
const updateGradeReport = async (req, res, next) => {

    try {

        const { id } = req.params;

        const {

            class_name,
            subject_name,
            evaluation_name,
            exam_type_id,
            max_marks

        } = req.body;

        const report =
            await gradeReportService.updateGradeReport(

                id,
                class_name,
                subject_name,
                evaluation_name,
                exam_type_id,
                max_marks

            );

        res.status(200).json({

            success: true,
            message: "Grade Report updated successfully.",

            data: report

        });

    } catch (error) {

        next(error);

    }

};

// =======================================
// Update Marks
// =======================================
const updateMarks = async (req, res, next) => {

    try {

        const { id } = req.params;

        const { max_marks } = req.body;

        const report =
            await gradeReportService.updateMarks(

                id,
                max_marks

            );

        res.status(200).json({

            success: true,
            message: "Marks updated successfully.",

            data: report

        });

    } catch (error) {

        next(error);

    }

};

// =======================================
// Delete Grade Report
// =======================================
const deleteGradeReport = async (req, res, next) => {

    try {

        const { id } = req.params;

        const response =
            await gradeReportService.deleteGradeReport(id);

        res.status(200).json({

            success: true,
            message: response.message

        });

    } catch (error) {

        next(error);

    }

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