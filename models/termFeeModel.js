const pool = require("../config/db");

// ==========================================
// Get All Term Fees
// ==========================================
const getTermFees = async() => {

    const result = await pool.query(`

        SELECT

            tf.term_fee_id,

            tf.branch_id,
            b.branch_name,

            tf.academic_year_id,
            ay.academic_year,

            tf.class_id,
            sc.class_name,

            tf.term_name,

            tf.term_amount,

            tf.due_date,

            tf.created_at,

            tf.updated_at

        FROM term_fee_details tf

        INNER JOIN branches b
            ON tf.branch_id = b.branch_id

        INNER JOIN academic_years ay
            ON tf.academic_year_id = ay.academic_year_id

        INNER JOIN study_classes sc
            ON tf.class_id = sc.id

        ORDER BY

            b.branch_name,
            ay.academic_year,
            sc.class_name,
            tf.term_name

    `);

    return result.rows;

};


// ==========================================
// Get Term Fee By Id
// ==========================================
const getTermFeeById = async(id) => {

    const result = await pool.query(

        `

        SELECT

            tf.term_fee_id,

            tf.branch_id,
            b.branch_name,

            tf.academic_year_id,
            ay.academic_year,

            tf.class_id,
            sc.class_name,

            tf.term_name,

            tf.term_amount,

            tf.due_date,

            tf.created_at,

            tf.updated_at

        FROM term_fee_details tf

        INNER JOIN branches b
            ON tf.branch_id=b.branch_id

        INNER JOIN academic_years ay
            ON tf.academic_year_id=ay.academic_year_id

        INNER JOIN study_classes sc
            ON tf.class_id=sc.id

        WHERE tf.term_fee_id=$1

        `,

        [id]

    );

    return result.rows[0];

};


// ==========================================
// Create Term Fee
// ==========================================
const createTermFee = async(data) => {

    const {

        branch_id,

        academic_year_id,

        class_id,

        term_name,

        term_amount,

        due_date

    } = data;

    const insertResult = await pool.query(

        `

        INSERT INTO term_fee_details
        (

            branch_id,

            academic_year_id,

            class_id,

            term_name,

            term_amount,

            due_date

        )

        VALUES

        ($1,$2,$3,$4,$5,$6)

        RETURNING term_fee_id;

        `,

        [

            branch_id,

            academic_year_id,

            class_id,

            term_name,

            term_amount,

            due_date

        ]

    );

    return await getTermFeeById(insertResult.rows[0].term_fee_id);

};


// ==========================================
// Update Term Fee
// ==========================================
const updateTermFee = async(id, data) => {

    const {

        term_name,

        term_amount,

        due_date

    } = data;

    await pool.query(

        `

        UPDATE term_fee_details

        SET

            term_name=$1,

            term_amount=$2,

            due_date=$3,

            updated_at=CURRENT_TIMESTAMP

        WHERE term_fee_id=$4

        `,

        [

            term_name,

            term_amount,

            due_date,

            id

        ]

    );

    return await getTermFeeById(id);

};


// ==========================================
// Delete Term Fee
// ==========================================
const deleteTermFee = async(id) => {

    const result = await pool.query(

        `

        DELETE FROM term_fee_details

        WHERE term_fee_id=$1

        RETURNING *

        `,

        [id]

    );

    return result.rows[0];

};


module.exports = {

    getTermFees,

    getTermFeeById,

    createTermFee,

    updateTermFee,

    deleteTermFee

};