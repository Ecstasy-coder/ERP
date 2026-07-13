 const pool = require("../config/db");

// =============================================
// Get All Teachers
// =============================================
const getAllTeachers = async () => {

    const query = `
        SELECT
            id,
            employee_code,
            teacher_name,
            branch,
            designation,
            primary_mobile,
            primary_email,
            employee_role,
            is_active
        FROM teachers
        ORDER BY id DESC;
    `;

    const result = await pool.query(query);

    return result.rows;
};

// =============================================
// Get Teacher By Id
// =============================================
const getTeacherById = async (id) => {

    const query = `
        SELECT *
        FROM teachers
        WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];

};

// =============================================
// Create Teacher
// =============================================
const createTeacher = async (teacher) => {

    const {

        employee_code,
        teacher_name,
        branch,
        gender,
        dob,
        primary_mobile,
        secondary_mobile,
        primary_email,
        secondary_email,
        address,
        aadhaar_no,
        employee_type,
        employee_role,
        designation,
        joining_date,
        relieving_date,
        salary,
        other_details,
        photo,
        is_active

    } = teacher;

    const query = `
        INSERT INTO teachers
        (
            employee_code,
            teacher_name,
            branch,
            gender,
            dob,
            primary_mobile,
            secondary_mobile,
            primary_email,
            secondary_email,
            address,
            aadhaar_no,
            employee_type,
            employee_role,
            designation,
            joining_date,
            relieving_date,
            salary,
            other_details,
            photo,
            is_active
        )
        VALUES
        (
            $1,$2,$3,$4,$5,
            $6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,
            $16,$17,$18,$19,$20
        )
        RETURNING *;
    `;

    const values = [

        employee_code,
        teacher_name,
        branch,
        gender,
        dob,
        primary_mobile,
        secondary_mobile,
        primary_email,
        secondary_email,
        address,
        aadhaar_no,
        employee_type,
        employee_role,
        designation,
        joining_date,
        relieving_date,
        salary,
        other_details,
        photo,
        is_active

    ];

    const result = await pool.query(query, values);

    return result.rows[0];

};

// =============================================
// Update Teacher
// =============================================
const updateTeacher = async (id, teacher) => {

    const {

        employee_code,
        teacher_name,
        branch,
        gender,
        dob,
        primary_mobile,
        secondary_mobile,
        primary_email,
        secondary_email,
        address,
        aadhaar_no,
        employee_type,
        employee_role,
        designation,
        joining_date,
        relieving_date,
        salary,
        other_details,
        photo,
        is_active

    } = teacher;

    const query = `
        UPDATE teachers
        SET
            employee_code = $1,
            teacher_name = $2,
            branch = $3,
            gender = $4,
            dob = $5,
            primary_mobile = $6,
            secondary_mobile = $7,
            primary_email = $8,
            secondary_email = $9,
            address = $10,
            aadhaar_no = $11,
            employee_type = $12,
            employee_role = $13,
            designation = $14,
            joining_date = $15,
            relieving_date = $16,
            salary = $17,
            other_details = $18,
            photo = $19,
            is_active = $20,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $21
        RETURNING *;
    `;

    const values = [

        employee_code,
        teacher_name,
        branch,
        gender,
        dob,
        primary_mobile,
        secondary_mobile,
        primary_email,
        secondary_email,
        address,
        aadhaar_no,
        employee_type,
        employee_role,
        designation,
        joining_date,
        relieving_date,
        salary,
        other_details,
        photo,
        is_active,
        id

    ];

    const result = await pool.query(query, values);

    return result.rows[0];

};

// =============================================
// Delete Teacher
// =============================================
const deleteTeacher = async (id) => {

    const query = `
        DELETE FROM teachers
        WHERE id = $1
        RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];

};

module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};