const transportStudentModel = require("../models/transportStudentModel");

// =========================
// GET BY ROUTE REPORT
// =========================
const getTransportStudentsByRoute = async (req, res) => {

    try {

        const result = await transportStudentModel.getTransportStudentsByRoute(req.query);

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// GET ALL
// =========================
const getTransportStudents = async (req, res) => {

    try {

        const students = await transportStudentModel.getTransportStudents();

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// GET BY ID
// =========================
const getTransportStudentById = async (req, res) => {

    try {

        const student = await transportStudentModel.getTransportStudentById(req.params.id);

        if (!student) {

            return res.status(404).json({
                success: false,
                message: "Transport Student Not Found"
            });

        }

        res.status(200).json({
            success: true,
            data: student
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// CREATE
// =========================
const assignTransport = async (req, res) => {

    try {

        const transport = await transportStudentModel.assignTransport(req.body);

        res.status(201).json({
            success: true,
            message: "Transport Assigned Successfully",
            data: transport
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// UPDATE
// =========================
const updateTransport = async (req, res) => {

    try {

        const transport = await transportStudentModel.updateTransport(
            req.params.id,
            req.body
        );

        if (!transport) {

            return res.status(404).json({
                success: false,
                message: "Transport Record Not Found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Transport Updated Successfully",
            data: transport
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// DELETE
// =========================
const deleteTransport = async (req, res) => {

    try {

        const transport = await transportStudentModel.deleteTransport(req.params.id);

        if (!transport) {

            return res.status(404).json({
                success: false,
                message: "Transport Record Not Found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Transport Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getTransportStudentsByRoute,
    getTransportStudents,
    getTransportStudentById,
    assignTransport,
    updateTransport,
    deleteTransport
};
