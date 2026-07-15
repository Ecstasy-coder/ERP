const AcademicYearService = require("../services/academicYearService");


// =================================
// Get All Academic Years
// =================================
const getAcademicYears = async (req, res) => {

   

    try {

        const academicYears = await AcademicYearService.getAllAcademicYears();

        res.status(200).json(academicYears);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch Academic Years"
        });

    }

};


// =================================
// Get Academic Year By ID
// =================================
const getAcademicYearById = async (req, res) => {

    try {

        const { id } = req.params;

        const academicYear = await AcademicYearService.getAcademicYearById(id);

        if (!academicYear) {

            return res.status(404).json({
                message: "Academic Year not found"
            });

        }

        res.status(200).json(academicYear);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch Academic Year"
        });

    }

};


// =================================
// Create Academic Year
// =================================
const createAcademicYear = async (req, res) => {

    try {

        const academicYear = await AcademicYearService.createAcademicYear(req.body);

        res.status(201).json({

            message: "Academic Year Created Successfully",

            data: academicYear

        });

    } catch (error) {

        console.error("POST ERROR:");
        console.error(error);

        res.status(500).json({

            message: error.message,
            code: error.code,
            detail: error.detail

        });

    }

};


// =================================
// Update Academic Year
// =================================
const updateAcademicYear = async (req, res) => {

    try {

        const { id } = req.params;

        const academicYear = await AcademicYearService.updateAcademicYear(id, req.body);

        if (!academicYear) {

            return res.status(404).json({

                message: "Academic Year not found"

            });

        }

        res.status(200).json({

            message: "Academic Year Updated Successfully",

            data: academicYear

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to update Academic Year"

        });

    }

};


// =================================
// Delete Academic Year
// =================================
const deleteAcademicYear = async (req, res) => {

    try {

        const { id } = req.params;

        const academicYear = await AcademicYearService.deleteAcademicYear(id);

        if (!academicYear) {

            return res.status(404).json({

                message: "Academic Year not found"

            });

        }

        res.status(200).json({

            message: "Academic Year Deleted Successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to delete Academic Year"

        });

    }

};


// =================================
// Set Current Academic Year
// =================================
const setCurrentAcademicYear = async (req, res) => {

    try {

        const { id } = req.params;

        const academicYear = await AcademicYearService.setCurrentAcademicYear(id);

        if (!academicYear) {

            return res.status(404).json({

                message: "Academic Year not found"

            });

        }

        res.status(200).json({

            message: "Current Academic Year Updated Successfully",

            data: academicYear

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to update Current Academic Year"

        });

    }

};


module.exports = {

    getAcademicYears,

    getAcademicYearById,

    createAcademicYear,

    updateAcademicYear,

    deleteAcademicYear,

    setCurrentAcademicYear

};