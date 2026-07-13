const pool = require("../config/db");

// ============================
// Create Student
// ============================
exports.createStudent = async(req, res) => {
    try {

        const {
            branch,
            register_no,
            full_name,
            gender,
            primary_mobile,
            secondary_mobile,
            primary_email,
            secondary_email,
            dob,
            aadhaar_number,
            admission_date,
            current_academic_year,
            current_class,
            current_section,
            address,
            caste,
            sub_caste,
            admission_academic_year,
            admission_class,
            father_name,
            father_qualification,
            father_occupation,
            mother_name,
            mother_qualification,
            mother_occupation,
            sibling_details,
            first_language,
            second_language,
            third_language,
            other_details,
            is_active
        } = req.body;

        // Generate Admission Number
        const countResult = await pool.query(
            "SELECT COUNT(*) FROM students"
        );

        const nextNumber = Number(countResult.rows[0].count) + 1;

        const admission_no =
            "O26" + String(nextNumber).padStart(6, "0");

        // Photo Path
        let photo = null;

        if (req.file) {
            photo = req.file.path;
        }

        const query = `
        INSERT INTO students(
            branch,
            admission_no,
            register_no,
            full_name,
            gender,
            primary_mobile,
            secondary_mobile,
            primary_email,
            secondary_email,
            dob,
            aadhaar_number,
            admission_date,
            current_academic_year,
            current_class,
            current_section,
            address,
            caste,
            sub_caste,
            admission_academic_year,
            admission_class,
            father_name,
            father_qualification,
            father_occupation,
            mother_name,
            mother_qualification,
            mother_occupation,
            sibling_details,
            first_language,
            second_language,
            third_language,
            photo,
            other_details,
            is_active
        )

        VALUES(

            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
            $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
            $31,$32,$33

        )

        RETURNING *;
        `;

        const values = [
            branch,
            admission_no,
            register_no,
            full_name,
            gender,
            primary_mobile,
            secondary_mobile,
            primary_email,
            secondary_email,
            dob,
            aadhaar_number,
            admission_date,
            current_academic_year,
            current_class,
            current_section,
            address,
            caste,
            sub_caste,
            admission_academic_year,
            admission_class,
            father_name,
            father_qualification,
            father_occupation,
            mother_name,
            mother_qualification,
            mother_occupation,
            sibling_details ?
            JSON.stringify(sibling_details) :
            null,
            first_language,
            second_language,
            third_language,
            photo,
            other_details,
            is_active === "true"
        ];

        const result = await pool.query(query, values);

        res.status(201).json({
            success: true,
            message: "Student Created Successfully",
            data: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ============================
// Student List
// ============================
exports.getStudents = async(req, res) => {

    try {

        let {
            page = 1,
                limit = 10,
                search = "",
                branch = "",
                className = ""
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const offset = (page - 1) * limit;

        let query = `
            SELECT
                id,
                admission_no,
                register_no,
                full_name,
                father_name,
                gender,
                current_class,
                current_section,
                primary_mobile,
                is_active
            FROM students
            WHERE 1=1
        `;

        let values = [];
        let index = 1;

        // Search
        if (search) {
            query += `
                AND (
                    LOWER(full_name) LIKE LOWER($${index})
                    OR LOWER(admission_no) LIKE LOWER($${index})
                )
            `;
            values.push(`%${search}%`);
            index++;
        }

        // Branch Filter
        if (branch) {
            query += ` AND branch = $${index}`;
            values.push(branch);
            index++;
        }

        // Class Filter
        if (className) {
            query += ` AND current_class = $${index}`;
            values.push(className);
            index++;
        }

        query += `
            ORDER BY id DESC
            LIMIT $${index}
            OFFSET $${index + 1}
        `;

        values.push(limit);
        values.push(offset);

        const students = await pool.query(query, values);

        // Total Count

        let countQuery = `
            SELECT COUNT(*) FROM students
            WHERE 1=1
        `;

        let countValues = [];
        let cIndex = 1;

        if (search) {
            countQuery += `
                AND (
                    LOWER(full_name) LIKE LOWER($${cIndex})
                    OR LOWER(admission_no) LIKE LOWER($${cIndex})
                )
            `;
            countValues.push(`%${search}%`);
            cIndex++;
        }

        if (branch) {
            countQuery += ` AND branch=$${cIndex}`;
            countValues.push(branch);
            cIndex++;
        }

        if (className) {
            countQuery += ` AND current_class=$${cIndex}`;
            countValues.push(className);
        }

        const totalResult = await pool.query(countQuery, countValues);

        res.status(200).json({

            success: true,

            total: Number(totalResult.rows[0].count),

            page,

            limit,

            data: students.rows

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch students",

            error: error.message

        });

    }

};


// ============================
// Student Details
// ============================
exports.getStudentById = async(req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM students WHERE id=$1", [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });

        }

        res.json({

            success: true,

            data: result.rows[0]

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ============================
// Update Student
// ============================
exports.updateStudent = async(req, res) => {

    res.json({

        success: true,

        message: "Update Student API"

    });

};


// ============================
// Delete Student
// ============================
exports.deleteStudent = async(req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "DELETE FROM students WHERE id=$1", [id]
        );

        res.json({

            success: true,

            message: "Student Deleted Successfully"

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ============================
// Search Sibling
// ============================
exports.searchSibling = async(req, res) => {

    try {

        const { name = "", className = "" } = req.query;

        let query = `
            SELECT
                id,
                admission_no,
                full_name,
                father_name,
                current_class
            FROM students
            WHERE LOWER(full_name)
            LIKE LOWER($1)
        `;

        let values = [`%${name}%`];

        if (className) {

            query += " AND current_class=$2";

            values.push(className);

        }

        const result = await pool.query(query, values);

        res.json({

            success: true,

            total: result.rows.length,

            data: result.rows

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};