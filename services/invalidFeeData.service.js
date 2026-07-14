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
     reference_id,
    student_id,
    student_name,
    school_name,
    current_class,
    issue,
    details,
    payment_date,
    status = "UNRESOLVED",
  } = data;

  const result = await pool.query(
    `INSERT INTO invalid_fee_data
      ( reference_id,
      student_id,
      student_name,
      school_name,
      current_class,
      issue,
      details,
      status,
      payment_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [ reference_id,
      student_id,
      student_name,
      school_name,
      current_class,
      issue,
      details,
      status.toUpperCase(),
      payment_date || new Date(),]
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

    const reported = Number(record.reported || 0);
  const calculated = Number(record.calculated || 0);
  const diff = reported - calculated;

  await pool.query(
    `INSERT INTO invalid_fee_totals
      (student_id,
      student_name,
      school_name,
      reported,
      calculated,
      diff,
      reason,
      status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (student_id) DO UPDATE SET
       student_name = EXCLUDED.student_name,
      school_name = EXCLUDED.school_name,
      reported = EXCLUDED.reported,
      calculated = EXCLUDED.calculated,
      diff = EXCLUDED.diff,
      reason = EXCLUDED.reason,
      status = EXCLUDED.status`,
    [
       record.student_id,
      record.student_name,
      record.school_name,
      reported,
      calculated,
      diff,
      record.reason,
      record.status || "MISMATCH",
    ]
  );
};

// ─────────────────────────────────────────────
// INTERNAL: write to transaction_logs
// ─────────────────────────────────────────────
const logTransaction = async (log_type, record) => {
  await pool.query(
    `INSERT INTO transaction_logs
      ( student_id,
      log_type,
      transaction_ref,
      student_name,
      school_name,
      amount,
      payment_date,
      payment_time,
      payment_method,
      operator_name,
      status,
      raw_payload)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      record.student_id,
      log_type,
      record.transaction_ref || `TXN-${Date.now()}`,
      record.student_name,
      record.school_name,
      record.amount || 0,
      record.payment_date,
      record.payment_time || null,
      record.payment_method || null,
      record.operator_name || null,
      record.status,
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



