const pool = require("../config/db");

// =======================================
// Create Fee Due
// =======================================

const createFeeDue = async (

    student_id,
    term_id,
    fee_due

) => {

    const result = await pool.query(

        `
        INSERT INTO fee_due_details
        (
            student_id,
            term_id,
            fee_due
        )

        VALUES ($1,$2,$3)

        RETURNING *;
        `,

        [
            student_id,
            term_id,
            fee_due
        ]

    );

    return result.rows[0];

};


// =======================================
// Check Duplicate Fee Due
// =======================================

const checkDuplicateFeeDue = async (

    student_id,
    term_id

) => {

    const result = await pool.query(

        `
        SELECT *

        FROM fee_due_details

        WHERE student_id = $1
        AND term_id = $2;
        `,

        [
            student_id,
            term_id
        ]

    );

    return result.rows[0];

};


// =======================================
// Get All Fee Due
// =======================================

const getAllFeeDue = async () => {

    const result = await pool.query(

        `
        SELECT

            fd.fee_due_id,

            s.student_id,
            s.student_name,
            s.father_name,
            s.mobile,

            b.branch_name,

            c.class_name,

            t.term_name,

            fd.fee_due

        FROM fee_due_details fd

        INNER JOIN fee_due_students s
            ON fd.student_id = s.student_id

        INNER JOIN fee_due_branches b
            ON s.branch_id = b.branch_id

        INNER JOIN fee_due_classes c
            ON s.class_id = c.class_id

        INNER JOIN fee_due_terms t
            ON fd.term_id = t.term_id

        ORDER BY s.student_name;
        `

    );

    return result.rows;

};


// =======================================
// ERP Fee Due List
// =======================================

const getFeeDueList = async () => {

    const result = await pool.query(

        `
        SELECT

            fd.fee_due_id,

            s.student_id,
            s.student_name,
            s.father_name,
            s.mobile,

            b.branch_id,
            b.branch_name,

            c.class_id,
            c.class_name,

            t.term_id,
            t.term_name,

            fd.fee_due,

            COALESCE(fp.payment_status,'Pending') AS payment_status

        FROM fee_due_details fd

        INNER JOIN fee_due_students s
            ON fd.student_id = s.student_id

        INNER JOIN fee_due_branches b
            ON s.branch_id = b.branch_id

        INNER JOIN fee_due_classes c
            ON s.class_id = c.class_id

        INNER JOIN fee_due_terms t
            ON fd.term_id = t.term_id

        LEFT JOIN fee_due_payments fp
            ON fp.student_id = fd.student_id
            AND fp.term_id = fd.term_id

        ORDER BY

            b.branch_name,
            c.class_name,
            s.student_name;
        `

    );

    return result.rows;

};


// =======================================
// Dynamic Filter API
// =======================================

const filterFeeDue = async (

    branch_id,
    class_id,
    term_id

) => {

    let query = `

        SELECT

            fd.fee_due_id,

            s.student_id,
            s.student_name,
            s.father_name,
            s.mobile,

            b.branch_id,
            b.branch_name,

            c.class_id,
            c.class_name,

            t.term_id,
            t.term_name,

            fd.fee_due,

            COALESCE(fp.payment_status,'Pending') AS payment_status

        FROM fee_due_details fd

        INNER JOIN fee_due_students s
            ON fd.student_id = s.student_id

        INNER JOIN fee_due_branches b
            ON s.branch_id = b.branch_id

        INNER JOIN fee_due_classes c
            ON s.class_id = c.class_id

        INNER JOIN fee_due_terms t
            ON fd.term_id = t.term_id

        LEFT JOIN fee_due_payments fp
            ON fp.student_id = fd.student_id
            AND fp.term_id = fd.term_id

        WHERE 1=1

    `;

    const values = [];

    let index = 1;

    if (branch_id) {

        query += ` AND b.branch_id = $${index}`;

        values.push(branch_id);

        index++;

    }

    if (class_id) {

        query += ` AND c.class_id = $${index}`;

        values.push(class_id);

        index++;

    }

    if (term_id) {

        query += ` AND t.term_id = $${index}`;

        values.push(term_id);

        index++;

    }

    query += `

        ORDER BY

            b.branch_name,

            c.class_name,

            s.student_name;

    `;

    const result = await pool.query(query, values);

    return result.rows;

};


// =======================================
// Search API
// =======================================

const searchFeeDue = async (keyword) => {

    const result = await pool.query(

        `
        SELECT

            fd.fee_due_id,

            s.student_id,
            s.student_name,
            s.father_name,
            s.mobile,

            b.branch_id,
            b.branch_name,

            c.class_id,
            c.class_name,

            t.term_id,
            t.term_name,

            fd.fee_due,

            COALESCE(fp.payment_status,'Pending') AS payment_status

        FROM fee_due_details fd

        INNER JOIN fee_due_students s
            ON fd.student_id = s.student_id

        INNER JOIN fee_due_branches b
            ON s.branch_id = b.branch_id

        INNER JOIN fee_due_classes c
            ON s.class_id = c.class_id

        INNER JOIN fee_due_terms t
            ON fd.term_id = t.term_id

        LEFT JOIN fee_due_payments fp
            ON fp.student_id = fd.student_id
            AND fp.term_id = fd.term_id

        WHERE

            s.student_name ILIKE $1

            OR s.father_name ILIKE $1

            OR s.mobile ILIKE $1

        ORDER BY

            b.branch_name,
            c.class_name,
            s.student_name;
        `,

        [`%${keyword}%`]

    );

    return result.rows;

};


// =======================================
// Get Fee Due By ID
// =======================================

const getFeeDueById = async (id) => {

    const result = await pool.query(

        `
        SELECT *

        FROM fee_due_details

        WHERE fee_due_id = $1;
        `,

        [id]

    );

    return result.rows[0];

};


// =======================================
// Update Fee Due
// =======================================

const updateFeeDue = async (

    id,

    student_id,

    term_id,

    fee_due

) => {

    const result = await pool.query(

        `
        UPDATE fee_due_details

        SET

            student_id = $1,
            term_id = $2,
            fee_due = $3

        WHERE fee_due_id = $4

        RETURNING *;
        `,

        [

            student_id,
            term_id,
            fee_due,
            id

        ]

    );

    return result.rows[0];

};


// =======================================
// Delete Fee Due
// =======================================

const deleteFeeDue = async (id) => {

    const result = await pool.query(

        `
        DELETE FROM fee_due_details

        WHERE fee_due_id = $1

        RETURNING *;
        `,

        [id]

    );

    return result.rows[0];

};


module.exports = {

    createFeeDue,

    checkDuplicateFeeDue,

    getAllFeeDue,

    getFeeDueList,

    filterFeeDue,

    searchFeeDue,

    getFeeDueById,

    updateFeeDue,

    deleteFeeDue

};