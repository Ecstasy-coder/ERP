const pool = require("../config/db");

// Create Student

const createStudent = async (

    student_name,
    father_name,
    mobile,
    branch_id,
    class_id

) => {

    const result = await pool.query(

        `
        INSERT INTO fee_due_students
        (
            student_name,
            father_name,
            mobile,
            branch_id,
            class_id
        )

        VALUES($1,$2,$3,$4,$5)

        RETURNING *;
        `,

        [
            student_name,
            father_name,
            mobile,
            branch_id,
            class_id
        ]

    );

    return result.rows[0];

};


// Get All Students

const getAllStudents = async () => {

    const result = await pool.query(

        `
        SELECT

            s.student_id,

            s.student_name,

            s.father_name,

            s.mobile,

            b.branch_name,

            c.class_name

        FROM fee_due_students s

        JOIN fee_due_branches b

        ON s.branch_id=b.branch_id

        JOIN fee_due_classes c

        ON s.class_id=c.class_id

        ORDER BY s.student_name;
        `

    );

    return result.rows;

};


// Get Student By Id

const getStudentById = async (id) => {

    const result = await pool.query(

        `
        SELECT

            s.student_id,

            s.student_name,

            s.father_name,

            s.mobile,

            b.branch_name,

            c.class_name

        FROM fee_due_students s

        JOIN fee_due_branches b

        ON s.branch_id=b.branch_id

        JOIN fee_due_classes c

        ON s.class_id=c.class_id

        WHERE s.student_id=$1;
        `,

        [id]

    );

    return result.rows[0];

};


// Update Student

const updateStudent = async (

    id,

    student_name,

    father_name,

    mobile,

    branch_id,

    class_id

) => {

    const result = await pool.query(

        `
        UPDATE fee_due_students

        SET

        student_name=$1,

        father_name=$2,

        mobile=$3,

        branch_id=$4,

        class_id=$5

        WHERE student_id=$6

        RETURNING *;
        `,

        [

            student_name,

            father_name,

            mobile,

            branch_id,

            class_id,

            id

        ]

    );

    return result.rows[0];

};


// Delete Student

const deleteStudent = async (id) => {

    const result = await pool.query(

        `
        DELETE FROM fee_due_students

        WHERE student_id=$1

        RETURNING *;
        `,

        [id]

    );

    return result.rows[0];

};


module.exports = {

    createStudent,

    getAllStudents,

    getStudentById,

    updateStudent,

    deleteStudent

};