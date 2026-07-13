 const teacherService = require("../services/teacherService");

// ======================================
// Get All Teachers
// ======================================
exports.getAllTeachers = async (req, res) => {
    try {

        const teachers = await teacherService.getAllTeachers();

        res.status(200).json({
            success: true,
            count: teachers.length,
            data: teachers
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ======================================
// Get Teacher By Id
// ======================================
exports.getTeacherById = async (req, res) => {
    try {

        const id = req.params.id;

        const teacher = await teacherService.getTeacherById(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.status(200).json({
            success: true,
            data: teacher
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ======================================
// Create Teacher
// ======================================
exports.createTeacher = async (req, res) => {
    try {

        const teacher = await teacherService.createTeacher(req.body);

        res.status(201).json({
            success: true,
            message: "Teacher Added Successfully",
            data: teacher
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ======================================
// Update Teacher
// ======================================
exports.updateTeacher = async (req, res) => {
    try {

        const id = req.params.id;

        const teacher = await teacherService.updateTeacher(id, req.body);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Teacher Updated Successfully",
            data: teacher
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ======================================
// Delete Teacher
// ======================================
// exports.deleteTeacher = async (req, res) => {
//     try {

//         const id = req.params.id;

//         const teacher = await teacherService.deleteTeacher(id);

//         if (!teacher) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Teacher not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Teacher Deleted Successfully"
//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });

//     }
// };
exports.deleteTeacher = async (req, res) => {
    try {

        console.log("DELETE ID:", req.params.id);

        const id = req.params.id;

        const teacher = await teacherService.deleteTeacher(id);

        console.log("DELETE RESULT:", teacher);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Teacher Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};