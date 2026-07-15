// const pool = require("../config/db");


// // ==========================================
// // Get Fee Structure
// // ==========================================
// const getFeeStructure = async (branch_id, academic_year_id, class_id) => {

//     const result = await pool.query(

//         `
//         SELECT

//             fs.fee_structure_id,

//             b.branch_name,

//             ay.academic_year,

//             c.class_name,

//             ft.fee_type,

//             fs.fee_amount

//         FROM fee_structure fs

//         INNER JOIN branches b
//         ON fs.branch_id = b.branch_id

//         INNER JOIN academic_years ay
//         ON fs.academic_year_id = ay.academic_year_id

//         INNER JOIN study_classes c
//         ON fs.class_id = c.id

//         INNER JOIN fee_types ft
//         ON fs.fee_type_id = ft.id

//         WHERE

//             fs.branch_id=$1
//             AND fs.academic_year_id=$2
//             AND fs.class_id=$3

//         ORDER BY ft.fee_type ASC

//         `,

//         [branch_id, academic_year_id, class_id]

//     );

//     return result.rows;

// };



// // // ==========================================
// // // Add Fee Structure
// // // ==========================================
// // const createFeeStructure = async (data) => {

// //     const {

// //         branch_id,

// //         academic_year_id,

// //         class_id,

// //         fee_type_id,

// //         fee_amount

// //     } = data;

// //     const result = await pool.query(

// //         `

// //         INSERT INTO fee_structure
// //         (

// //             branch_id,

// //             academic_year_id,

// //             class_id,

// //             fee_type_id,

// //             fee_amount

// //         )

// //         VALUES

// //         ($1,$2,$3,$4,$5)

// //         RETURNING *;

// //         `,

// //         [

// //             branch_id,

// //             academic_year_id,

// //             class_id,

// //             fee_type_id,

// //             fee_amount

// //         ]

// //     );

// //     return result.rows[0];

// // };

// // ==========================================
// // Add Fee Structure
// // ==========================================
// const createFeeStructure = async (data) => {

//     const {
//         branch_id,
//         academic_year_id,
//         class_id,
//         fee_type_id,
//         fee_amount
//     } = data;

//     // Insert the record
//     const insertResult = await pool.query(
//         `
//         INSERT INTO fee_structure
//         (
//             branch_id,
//             academic_year_id,
//             class_id,
//             fee_type_id,
//             fee_amount
//         )
//         VALUES ($1,$2,$3,$4,$5)
//         RETURNING fee_structure_id;
//         `,
//         [
//             branch_id,
//             academic_year_id,
//             class_id,
//             fee_type_id,
//             fee_amount
//         ]
//     );

//     const feeStructureId = insertResult.rows[0].fee_structure_id;

//     // Get inserted record with names
//     const result = await pool.query(
//         `
//         SELECT
//             fs.fee_structure_id,
//             b.branch_name,
//             ay.academic_year,
//             sc.class_name,
//             ft.fee_type,
//             fs.fee_amount,
//             fs.created_at,
//             fs.updated_at

//         FROM fee_structure fs

//         INNER JOIN branches b
//             ON fs.branch_id = b.branch_id

//         INNER JOIN academic_years ay
//             ON fs.academic_year_id = ay.academic_year_id

//         INNER JOIN study_classes sc
//             ON fs.class_id = sc.id

//         INNER JOIN fee_types ft
//             ON fs.fee_type_id = ft.id

//         WHERE fs.fee_structure_id = $1;
//         `,
//         [feeStructureId]
//     );

//     return result.rows[0];

// };

// // ==========================================
// // Update Fee
// // ==========================================
// const updateFeeStructure = async (id, fee_amount) => {

//     const result = await pool.query(

//         `

//         UPDATE fee_structure

//         SET

//         fee_amount=$1,

//         updated_at=CURRENT_TIMESTAMP

//         WHERE fee_structure_id=$2

//         RETURNING *;

//         `,

//         [

//             fee_amount,

//             id

//         ]

//     );

//     return result.rows[0];

// };



// // ==========================================
// // Delete Fee
// // ==========================================
// const deleteFeeStructure = async (id) => {

//     const result = await pool.query(

//         `

//         DELETE FROM fee_structure

//         WHERE fee_structure_id=$1

//         RETURNING *;

//         `,

//         [id]

//     );

//     return result.rows[0];

// };



// // ==========================================
// // Total Fee
// // ==========================================
// const getTotalFee = async (

//     branch_id,

//     academic_year_id,

//     class_id

// ) => {

//     const result = await pool.query(

//         `

//         SELECT

//         COALESCE(SUM(fee_amount),0) AS total_fee

//         FROM fee_structure

//         WHERE

//         branch_id=$1

//         AND academic_year_id=$2

//         AND class_id=$3

//         `,

//         [

//             branch_id,

//             academic_year_id,

//             class_id

//         ]

//     );

//     return result.rows[0];

// };

// module.exports = {

//     getFeeStructure,

//     createFeeStructure,

//     updateFeeStructure,

//     deleteFeeStructure,

//     getTotalFee

// };


const pool = require("../config/db");

// ==========================================
// Get All Fee Structures
// ==========================================
const getFeeStructure = async () => {

    const result = await pool.query(`
        SELECT
            fs.fee_structure_id,
            fs.branch_id,
            b.branch_name,
            fs.academic_year_id,
            ay.academic_year,
            fs.class_id,
            sc.class_name,
            fs.fee_type_id,
            ft.fee_type,
            fs.fee_amount,
            fs.created_at,
            fs.updated_at

        FROM fee_structure fs

        INNER JOIN branches b
            ON fs.branch_id = b.branch_id

        INNER JOIN academic_years ay
            ON fs.academic_year_id = ay.academic_year_id

        INNER JOIN study_classes sc
            ON fs.class_id = sc.id

        INNER JOIN fee_types ft
            ON fs.fee_type_id = ft.id

        ORDER BY
            b.branch_name,
            ay.academic_year,
            sc.class_name,
            ft.fee_type;
    `);

    return result.rows;
};


// ==========================================
// Get Fee Structure By ID
// ==========================================
const getFeeStructureById = async (id) => {

    const result = await pool.query(`
        SELECT
            fs.fee_structure_id,
            fs.branch_id,
            b.branch_name,
            fs.academic_year_id,
            ay.academic_year,
            fs.class_id,
            sc.class_name,
            fs.fee_type_id,
            ft.fee_type,
            fs.fee_amount,
            fs.created_at,
            fs.updated_at

        FROM fee_structure fs

        INNER JOIN branches b
            ON fs.branch_id = b.branch_id

        INNER JOIN academic_years ay
            ON fs.academic_year_id = ay.academic_year_id

        INNER JOIN study_classes sc
            ON fs.class_id = sc.id

        INNER JOIN fee_types ft
            ON fs.fee_type_id = ft.id

        WHERE fs.fee_structure_id = $1
    `,[id]);

    return result.rows[0];
};


// ==========================================
// Create Fee Structure
// ==========================================
const createFeeStructure = async (data) => {

    const {
        branch_id,
        academic_year_id,
        class_id,
        fee_type_id,
        fee_amount
    } = data;

    const insertResult = await pool.query(
        `
        INSERT INTO fee_structure
        (
            branch_id,
            academic_year_id,
            class_id,
            fee_type_id,
            fee_amount
        )
        VALUES
        ($1,$2,$3,$4,$5)
        RETURNING fee_structure_id;
        `,
        [
            branch_id,
            academic_year_id,
            class_id,
            fee_type_id,
            fee_amount
        ]
    );

    const feeStructureId = insertResult.rows[0].fee_structure_id;

    return await getFeeStructureById(feeStructureId);

};


// ==========================================
// Update Fee Structure
// ==========================================
const updateFeeStructure = async (id, fee_amount) => {

    await pool.query(
        `
        UPDATE fee_structure
        SET
            fee_amount = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE fee_structure_id = $2
        `,
        [
            fee_amount,
            id
        ]
    );

    return await getFeeStructureById(id);

};


// ==========================================
// Delete Fee Structure
// ==========================================
const deleteFeeStructure = async (id) => {

    const result = await pool.query(
        `
        DELETE FROM fee_structure
        WHERE fee_structure_id = $1
        RETURNING *;
        `,
        [id]
    );

    return result.rows[0];

};


// ==========================================
// Get Total Fee
// ==========================================
const getTotalFee = async (
    branch_id,
    academic_year_id,
    class_id
) => {

    const result = await pool.query(
        `
        SELECT
            COALESCE(SUM(fee_amount),0) AS total_fee

        FROM fee_structure

        WHERE
            branch_id = $1
            AND academic_year_id = $2
            AND class_id = $3
        `,
        [
            branch_id,
            academic_year_id,
            class_id
        ]
    );

    return result.rows[0];

};


module.exports = {

    getFeeStructure,

    getFeeStructureById,

    createFeeStructure,

    updateFeeStructure,

    deleteFeeStructure,

    getTotalFee

};