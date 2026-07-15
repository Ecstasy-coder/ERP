const pool = require("../config/db");

const normalizeBoolean = (value, defaultValue = true) => {
    if (value === undefined || value === null || value === "") {
        return defaultValue;
    }

    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "number") {
        return value === 1;
    }

    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();

        if (["true", "1", "yes", "y"].includes(normalized)) {
            return true;
        }

        if (["false", "0", "no", "n"].includes(normalized)) {
            return false;
        }
    }

    return defaultValue;
};


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
        // Photo Path (store accessible URL). Accept uploaded file or fallback to body value.
        let photo = null;

        console.log("Uploaded file:", req.file);

        if (req.file && req.file.filename) {
            photo = `/uploads/students/${req.file.filename}`;
        } else if (req.body && req.body.photo) {
            photo = req.body.photo;
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

        const normalizedIsActive = normalizeBoolean(is_active);

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
            normalizedIsActive
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
exports.updateStudent = async(req, res) => {

    try {

        const { id } = req.params;

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

        let photo = undefined;

        console.log("Uploaded file (update):", req.file);

        if (req.file && req.file.filename) {
            photo = `/uploads/students/${req.file.filename}`;
        } else if (req.body && req.body.photo) {
            photo = req.body.photo;
        }

        const fields = [];
        const values = [];
        let index = 1;

        const addField = (column, value) => {
            if (value !== undefined) {
                fields.push(`${column} = $${index}`);
                values.push(value);
                index++;
            }
        };

        addField("branch", branch);
        addField("register_no", register_no);
        addField("full_name", full_name);
        addField("gender", gender);
        addField("primary_mobile", primary_mobile);
        addField("secondary_mobile", secondary_mobile);
        addField("primary_email", primary_email);
        addField("secondary_email", secondary_email);
        addField("dob", dob);
        addField("aadhaar_number", aadhaar_number);
        addField("admission_date", admission_date);
        addField("current_academic_year", current_academic_year);
        addField("current_class", current_class);
        addField("current_section", current_section);
        addField("address", address);
        addField("caste", caste);
        addField("sub_caste", sub_caste);
        addField("admission_academic_year", admission_academic_year);
        addField("admission_class", admission_class);
        addField("father_name", father_name);
        addField("father_qualification", father_qualification);
        addField("father_occupation", father_occupation);
        addField("mother_name", mother_name);
        addField("mother_qualification", mother_qualification);
        addField("mother_occupation", mother_occupation);
        addField("sibling_details", sibling_details ? JSON.stringify(sibling_details) : null);
        addField("first_language", first_language);
        addField("second_language", second_language);
        addField("third_language", third_language);
        addField("photo", photo);
        addField("other_details", other_details);

        if (is_active !== undefined) {
            addField("is_active", normalizeBoolean(is_active));
        }

        if (fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update"
            });
        }

        values.push(id);

        const query = `
            UPDATE students
            SET ${fields.join(", ")}
            WHERE id = $${index}
            RETURNING *
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student Updated Successfully",
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