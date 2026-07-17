const pool = require("../config/db");


// ====================================================
// Get Students
// ====================================================

exports.getStudents = async(req, res) => {

    try {

        const result = await pool.query(`

            SELECT

                id,
                admission_no,
                full_name,
                gender,
                current_academic_year,
                current_class,
                current_section

            FROM students

            ORDER BY admission_no

        `);

        const promotionYears = [

            "2026-27",
            "2027-28",
            "2028-29"

        ];

        const promotionClasses = [

            "Grade 2-A",
            "Grade 2-B",
            "Grade 3-A",
            "Grade 3-B"

        ];

        const data = result.rows.map(student => ({

            ...student,

            promotionYears,

            promotionClasses

        }));

        res.status(200).json({

            success: true,

            data

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ====================================================
// Student Details
// ====================================================

exports.getStudentDetails = async(req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(

            "SELECT * FROM students WHERE id=$1",

            [id]

        );

        if (result.rows.length == 0) {

            return res.status(404).json({

                success: false,

                message: "Student not found"

            });

        }

        res.status(200).json({

            success: true,

            data: result.rows[0]

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ====================================================
// Promote Selected Students
// ====================================================

exports.promoteStudents = async(req, res) => {

    const { students } = req.body;

    /*
        students = [

            {

                student_id:1,

                promote_academic_year:"2026-27",

                promote_class:"Grade 2-A"

            },

            {

                student_id:5,

                promote_academic_year:"2026-27",

                promote_class:"Grade 2-A"

            }

        ]
    */

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        for (const item of students) {

            const studentResult = await client.query(

                `

                SELECT *

                FROM students

                WHERE id=$1

                `,

                [item.student_id]

            );

            if (studentResult.rows.length === 0)

                continue;

            const student = studentResult.rows[0];

            await client.query(

                `

                INSERT INTO student_promotions(

                    student_id,

                    admission_no,

                    full_name,

                    gender,

                    current_academic_year,

                    current_class,

                    current_section,

                    promote_academic_year,

                    promote_class

                )

                VALUES(

                    $1,$2,$3,$4,$5,$6,$7,$8,$9

                )

                `,

                [

                    student.id,

                    student.admission_no,

                    student.full_name,

                    student.gender,

                    student.current_academic_year,

                    student.current_class,

                    student.current_section,

                    item.promote_academic_year,

                    item.promote_class

                ]

            );

            await client.query(

                `

                UPDATE students

                SET

                    current_academic_year=$1,

                    current_class=$2

                WHERE id=$3

                `,

                [

                    item.promote_academic_year,

                    item.promote_class,

                    student.id

                ]

            );

        }

        await client.query("COMMIT");

        res.status(200).json({

            success: true,

            message: "Students promoted successfully"

        });

    } catch (err) {

        await client.query("ROLLBACK");

        res.status(500).json({

            success: false,

            message: err.message

        });

    } finally {

        client.release();

    }

};