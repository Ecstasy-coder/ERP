const pool = require("../config/db");

const getLookupValue = async(query, params) => {
    const result = await pool.query(query, params);
    return result.rows[0] || null;
};

const ensureFeeTypeRecord = async(feeTypeId, feeTypeName) => {
    const normalizedFeeTypeName = typeof feeTypeName === "string" ? feeTypeName.trim() : "";

    if (feeTypeId) {
        const feeTypeLookup = await getLookupValue(
            `SELECT id, fee_type FROM fee_types WHERE id = $1 LIMIT 1`, [feeTypeId]
        );

        if (feeTypeLookup) {
            return {
                id: feeTypeLookup.id,
                fee_type: feeTypeLookup.fee_type
            };
        }
    }

    if (normalizedFeeTypeName) {
        const feeTypeResult = await getLookupValue(
            `SELECT id, fee_type FROM fee_types WHERE fee_type ILIKE $1 LIMIT 1`, [normalizedFeeTypeName]
        );

        if (feeTypeResult) {
            return {
                id: feeTypeResult.id,
                fee_type: feeTypeResult.fee_type
            };
        }

        const insertedFeeType = await pool.query(
            `INSERT INTO fee_types (fee_type) VALUES ($1) ON CONFLICT (fee_type) DO NOTHING RETURNING id, fee_type`, [normalizedFeeTypeName]
        );

        if (insertedFeeType.rows[0]) {
            return {
                id: insertedFeeType.rows[0].id,
                fee_type: insertedFeeType.rows[0].fee_type
            };
        }
    }

    if (feeTypeId) {
        return {
            id: feeTypeId,
            fee_type: normalizedFeeTypeName || null
        };
    }

    throw new Error("Valid fee_type or fee_type_id is required");
};

const getAllOtherFees = async() => {
    const result = await pool.query(`
        SELECT
            ofd.other_fee_id,
            ofd.student_id,
            COALESCE(ofd.student_name, s.full_name) AS student_name,
            ofd.academic_year_id,
            COALESCE(ofd.academic_year_name, ay.academic_year) AS academic_year,
            ofd.branch_id,
            COALESCE(ofd.branch_name, b.branch_name) AS branch_name,
            ofd.class_id,
            ofd.fee_type_id,
            COALESCE(ofd.fee_type, ft.fee_type) AS fee_type,
            ofd.fee_amount,
            ofd.discount_amount,
            ofd.subtotal_amount,
            ofd.fee_paid,
            ofd.fee_balance,
            ofd.transaction_no,
            ofd.receipt_no,
            ofd.paid_date,
            ofd.created_at,
            ofd.updated_at
        FROM other_fee_details ofd
        LEFT JOIN students s ON s.id = ofd.student_id
        LEFT JOIN academic_years ay ON ay.academic_year_id = ofd.academic_year_id
        LEFT JOIN branches b ON b.branch_id = ofd.branch_id
        LEFT JOIN study_classes sc ON sc.id = ofd.class_id
        LEFT JOIN fee_types ft ON ft.id = ofd.fee_type_id
        ORDER BY ofd.created_at DESC
    `);

    return result.rows;
};

const addOtherFee = async(data) => {
    const {
        student_id,
        academic_year_id,
        branch_id,
        class_id,
        fee_type,
        fee_type_id,
        fee_amount,
        discount_amount,
        transaction_no,
        receipt_no,
        paid_date
    } = data;

    const feeTypeRecord = await ensureFeeTypeRecord(fee_type_id, fee_type);
    const resolvedFeeTypeId = feeTypeRecord.id;
    const resolvedFeeTypeName = feeTypeRecord.fee_type;

    const studentLookup = student_id ?
        await getLookupValue(`SELECT full_name FROM students WHERE id = $1 LIMIT 1`, [student_id]) :
        null;

    const academicYearLookup = academic_year_id ?
        await getLookupValue(`SELECT academic_year FROM academic_years WHERE academic_year_id = $1 LIMIT 1`, [academic_year_id]) :
        null;

    const branchLookup = branch_id ?
        await getLookupValue(`SELECT branch_name FROM branches WHERE branch_id = $1 LIMIT 1`, [branch_id]) :
        null;

    const classLookup = class_id ?
        await getLookupValue(`SELECT id, class_name FROM study_classes WHERE id = $1 LIMIT 1`, [class_id]) :
        null;

    const resolvedStudentName = studentLookup && studentLookup.full_name ? studentLookup.full_name : null;
    const resolvedAcademicYearName = academicYearLookup && academicYearLookup.academic_year ? academicYearLookup.academic_year : null;
    const resolvedBranchName = branchLookup && branchLookup.branch_name ? branchLookup.branch_name : null;

    const subtotal = Number(fee_amount) - Number(discount_amount || 0);
    const feePaid = 0;
    const feeBalance = subtotal;

    const insertQuery = `
        INSERT INTO other_fee_details(
            student_id,
            student_name,
            academic_year_id,
            academic_year_name,
            branch_id,
            branch_name,
            class_id,
            fee_type_id,
            fee_type,
            fee_amount,
            discount_amount,
            subtotal_amount,
            fee_paid,
            fee_balance,
            transaction_no,
            receipt_no,
            paid_date
        )
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
        RETURNING other_fee_id;
    `;

    const normalizeOptional = (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value === "string" && value.trim() === "") return null;
        return value;
    };

    const insertValues = [
        student_id,
        resolvedStudentName,
        academic_year_id,
        resolvedAcademicYearName,
        branch_id,
        resolvedBranchName,
        class_id,
        resolvedFeeTypeId,
        resolvedFeeTypeName,
        fee_amount,
        discount_amount || 0,
        subtotal,
        feePaid,
        feeBalance,
        normalizeOptional(transaction_no),
        normalizeOptional(receipt_no),
        normalizeOptional(paid_date)
    ];

    const inserted = await pool.query(insertQuery, insertValues);
    const insertedId = inserted.rows[0].other_fee_id;

    const result = await pool.query(`
        SELECT
            ofd.other_fee_id,
            ofd.student_id,
            COALESCE(ofd.student_name, s.full_name) AS student_name,
            ofd.academic_year_id,
            COALESCE(ofd.academic_year_name, ay.academic_year) AS academic_year,
            ofd.branch_id,
            COALESCE(ofd.branch_name, b.branch_name) AS branch_name,
            ofd.class_id,
            ofd.fee_type_id,
            ofd.fee_type,
            ofd.fee_amount,
            ofd.discount_amount,
            ofd.subtotal_amount,
            ofd.fee_paid,
            ofd.fee_balance,
            ofd.transaction_no,
            ofd.receipt_no,
            ofd.paid_date,
            ofd.created_at,
            ofd.updated_at
        FROM other_fee_details ofd
        LEFT JOIN students s ON s.id = ofd.student_id
        LEFT JOIN academic_years ay ON ay.academic_year_id = ofd.academic_year_id
        LEFT JOIN branches b ON b.branch_id = ofd.branch_id
        LEFT JOIN study_classes sc ON sc.id = ofd.class_id
        LEFT JOIN fee_types ft ON ft.id = ofd.fee_type_id
        WHERE ofd.other_fee_id = $1
    `, [insertedId]);

    return result.rows[0];
};

module.exports = {
    getAllOtherFees,
    addOtherFee
};