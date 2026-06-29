const pool = require("../config/db");

// ─────────────────────────────────────────────
// 1.  Get all invalid fee records (with filters)
// ─────────────────────────────────────────────
const getAllInvalidFeeData = async ({ student_id, status, from_date, to_date, page = 1, limit = 20 }) => {
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
    SELECT * FROM invalid_fee_data
    ${where}
    ORDER BY payment_date DESC
    LIMIT $${idx++} OFFSET $${idx++}
  `;
  values.push(limit, offset);

  const countQuery = `SELECT COUNT(*) FROM invalid_fee_data ${where}`;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, values),
    pool.query(countQuery, values.slice(0, idx - 3)), // exclude limit/offset
  ]);

  return {
    total: parseInt(countResult.rows[0].count),
    page: parseInt(page),
    limit: parseInt(limit),
    data: dataResult.rows,
  };
};

// ─────────────────────────────────────────────
// 2.  Get single record by ID
// ─────────────────────────────────────────────
const getInvalidFeeById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM invalid_fee_data WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

// ─────────────────────────────────────────────
// 3.  Create invalid fee record
// ─────────────────────────────────────────────
const createInvalidFeeData = async (data) => {
  const {
    student_id, student_name, current_class, section,
    roll_number, amount, payment_mode, transaction_ref,
    error_reason, payment_date, status = "INVALID",
  } = data;

  const result = await pool.query(
    `INSERT INTO invalid_fee_data
      (student_id, student_name, current_class, section, roll_number,
       amount, payment_mode, transaction_ref, error_reason, payment_date, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [student_id, student_name, current_class, section, roll_number,
     amount, payment_mode, transaction_ref, error_reason,
     payment_date || new Date(), status]
  );

  const record = result.rows[0];

  // Keep totals table in sync
  await upsertInvalidFeeTotal(record);

  // Write to transaction log
  await logTransaction("INVALID_FEE", record);

  return record;
};

// ─────────────────────────────────────────────
// 4.  Update status (e.g. mark as RESOLVED)
// ─────────────────────────────────────────────
const updateInvalidFeeStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE invalid_fee_data
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status.toUpperCase(), id]
  );
  return result.rows[0] || null;
};

// ─────────────────────────────────────────────
// INTERNAL: upsert totals
// ─────────────────────────────────────────────
const upsertInvalidFeeTotal = async (record) => {
  await pool.query(
    `INSERT INTO invalid_fee_totals
      (student_id, student_name, current_class, section,
       total_invalid_amount, total_transactions, last_transaction_date)
     VALUES ($1, $2, $3, $4, $5, 1, $6)
     ON CONFLICT (student_id) DO UPDATE SET
       total_invalid_amount  = invalid_fee_totals.total_invalid_amount + EXCLUDED.total_invalid_amount,
       total_transactions    = invalid_fee_totals.total_transactions + 1,
       last_transaction_date = EXCLUDED.last_transaction_date,
       updated_at            = NOW()`,
    [
      record.student_id, record.student_name, record.current_class,
      record.section, record.amount, record.payment_date,
    ]
  );
};

// ─────────────────────────────────────────────
// INTERNAL: write to transaction_logs
// ─────────────────────────────────────────────
const logTransaction = async (log_type, record) => {
  await pool.query(
    `INSERT INTO transaction_logs
      (log_type, student_id, student_name, current_class, section,
       amount, transaction_ref, error_reason, status, raw_payload)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [
      log_type, record.student_id, record.student_name,
      record.current_class, record.section, record.amount,
      record.transaction_ref, record.error_reason, record.status,
      JSON.stringify(record),
    ]
  );
};

module.exports = {
  getAllInvalidFeeData,
  getInvalidFeeById,
  createInvalidFeeData,
  updateInvalidFeeStatus,
  logTransaction,          // exported so fee_not_generated can reuse it
};



