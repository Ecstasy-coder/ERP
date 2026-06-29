const pool = require("../config/db");
const { logTransaction } = require("./invalidFeeData.service");

// ─────────────────────────────────────────────
// Get all fee-not-generated records
// ─────────────────────────────────────────────
const getAllFeeNotGenerated = async ({ student_id, status, from_date, to_date, page = 1, limit = 20 }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (student_id) {
    conditions.push(`student_id = $${idx++}`);
    values.push(student_id);
  }
  if (status) {
    conditions.push(`status = $${idx++}`);
    values.push(status.toUpperCase());
  }
  if (from_date) {
    conditions.push(`payment_date >= $${idx++}`);
    values.push(from_date);
  }
  if (to_date) {
    conditions.push(`payment_date <= $${idx++}`);
    values.push(to_date);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT * FROM fee_not_generated
    ${where}
    ORDER BY payment_date DESC
    LIMIT $${idx++} OFFSET $${idx++}
  `;
  values.push(limit, offset);

  const countQuery = `SELECT COUNT(*) FROM fee_not_generated ${where}`;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, values),
    pool.query(countQuery, values.slice(0, idx - 3)),
  ]);

  return {
    total : parseInt(countResult.rows[0].count),
    page  : parseInt(page),
    limit : parseInt(limit),
    data  : dataResult.rows,
  };
};

// ─────────────────────────────────────────────
// Get single record
// ─────────────────────────────────────────────
const getFeeNotGeneratedById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM fee_not_generated WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

// ─────────────────────────────────────────────
// Create fee-not-generated record
// ─────────────────────────────────────────────
const createFeeNotGenerated = async (data) => {
  const {
    student_id, student_name, current_class, section,
    roll_number, amount_paid, transaction_ref,
    payment_date, error_reason, status = "PENDING",
  } = data;

  const result = await pool.query(
    `INSERT INTO fee_not_generated
      (student_id, student_name, current_class, section, roll_number,
       amount_paid, transaction_ref, payment_date, error_reason, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [student_id, student_name, current_class, section, roll_number,
     amount_paid, transaction_ref, payment_date || new Date(),
     error_reason, status]
  );

  const record = result.rows[0];

  // Write to transaction log (reuse service)
  await logTransaction("FEE_NOT_GENERATED", {
    ...record,
    amount: record.amount_paid,
  });

  return record;
};

// ─────────────────────────────────────────────
// Update status (PENDING → RESOLVED)
// ─────────────────────────────────────────────
const updateFeeNotGeneratedStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE fee_not_generated
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status.toUpperCase(), id]
  );
  return result.rows[0] || null;
};

module.exports = {
  getAllFeeNotGenerated,
  getFeeNotGeneratedById,
  createFeeNotGenerated,
  updateFeeNotGeneratedStatus,
};



