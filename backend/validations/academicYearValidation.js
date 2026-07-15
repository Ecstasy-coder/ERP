const validateAcademicYear = (req, res, next) => {
console.log("Validation Executed");
    console.log(req.body);

    const { academic_year, is_active } = req.body;

    // Academic Year Required
    if (!academic_year || academic_year.trim() === "") {

        return res.status(400).json({
            success: false,
            message: "Academic Year is required"
        });

    }

    // Format Validation (Example: 2025-26)
    const pattern = /^\d{4}-\d{2}$/;

    if (!pattern.test(academic_year)) {

        return res.status(400).json({
            success: false,
            message: "Academic Year must be in YYYY-YY format"
        });

    }

    // is_active Validation
    if (typeof is_active !== "boolean") {

        return res.status(400).json({
            success: false,
            message: "is_active must be true or false"
        });

    }

    next();

};

module.exports = validateAcademicYear;