const studentModel = require("../models/studentModel");

// Create Student
const createStudent = async (req, res) => {

    try {

        const {
            student_name,
            father_name,
            mobile,
            branch_id,
            class_id
        } = req.body;

        if (
            !student_name ||
            !father_name ||
            !mobile ||
            !branch_id ||
            !class_id
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const student = await studentModel.createStudent(
            student_name,
            father_name,
            mobile,
            branch_id,
            class_id
        );

        res.status(201).json({
            success: true,
            message: "Student created successfully.",
            data: student
        });

    }catch (err) {

    console.error("Student Create Error:", err);

    return res.status(500).json({
        success: false,
        message: err.message,
        detail: err.detail || null
    });

}

};

// Get All Students
const getStudents = async (req, res) => {

    try {

        const students = await studentModel.getAllStudents();

        res.json({
            success: true,
            count: students.length,
            data: students
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to fetch students."
        });

    }

};

// Get Student By ID
const getStudent = async (req, res) => {

    try {

        const student = await studentModel.getStudentById(req.params.id);

        if (!student) {

            return res.status(404).json({
                success: false,
                message: "Student not found."
            });

        }

        res.json({
            success: true,
            data: student
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error."
        });

    }

};

// Update Student
const updateStudent = async (req, res) => {

    try {

        const {
            student_name,
            father_name,
            mobile,
            branch_id,
            class_id
        } = req.body;

        const student = await studentModel.updateStudent(
            req.params.id,
            student_name,
            father_name,
            mobile,
            branch_id,
            class_id
        );

        res.json({
            success: true,
            message: "Student updated successfully.",
            data: student
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to update student."
        });

    }

};

// Delete Student
const deleteStudent = async (req, res) => {

    try {

        await studentModel.deleteStudent(req.params.id);

        res.json({
            success: true,
            message: "Student deleted successfully."
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to delete student."
        });

    }

};

module.exports = {

    createStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent

};