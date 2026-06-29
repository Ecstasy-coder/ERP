const pool   = require("../config/db");
const ExcelJS = require("exceljs");

// ─────────────────────────────────────────────
// Get transaction logs as JSON (with filters)
// ─────────────────────────────────────────────
const getTransactionLogs = async ({ log_type, student_id, from_date, to_date, page = 1, limit = 20 }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (log_type) {
    conditions.push(`log_type = $${idx++}`);
    values.push(log_type.toUpperCase());
  }
  if (student_id) {
    conditions.push(`student_id = $${idx++}`);
    values.push(student_id);
  }
  if (from_date) {
    conditions.push(`logged_at >= $${idx++}`);
    values.push(from_date);
  }
  if (to_date) {
    conditions.push(`logged_at <= $${idx++}`);
    values.push(to_date);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT * FROM transaction_logs
    ${where}
    ORDER BY logged_at DESC
    LIMIT $${idx++} OFFSET $${idx++}
  `;
  values.push(limit, offset);

  const countQuery = `SELECT COUNT(*) FROM transaction_logs ${where}`;

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
// Export to Excel (multi-sheet)
// ─────────────────────────────────────────────
const exportTransactionLogsToExcel = async (filters = {}) => {
  // Fetch all three datasets (no pagination for export)
  const [invalidFeeRows, invalidTotalsRows, feeNotGenRows, allLogsRows] = await Promise.all([
    pool.query(`SELECT * FROM invalid_fee_data     ORDER BY payment_date DESC`),
    pool.query(`SELECT * FROM invalid_fee_totals   ORDER BY total_invalid_amount DESC`),
    pool.query(`SELECT * FROM fee_not_generated    ORDER BY payment_date DESC`),
    pool.query(`SELECT * FROM transaction_logs     ORDER BY logged_at DESC`),
  ]);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Fee Module System";
  workbook.created = new Date();

  // ── Sheet 1: Invalid Fee Data ──────────────
  const sheet1 = workbook.addWorksheet("Invalid Fee Data");
  styleHeader(sheet1, [
    { header: "ID",               key: "id",              width: 8  },
    { header: "Student ID",       key: "student_id",      width: 16 },
    { header: "Student Name",     key: "student_name",    width: 25 },
    { header: "Class",            key: "current_class",   width: 12 },
    { header: "Section",          key: "section",         width: 10 },
    { header: "Roll No",          key: "roll_number",     width: 12 },
    { header: "Amount (₹)",       key: "amount",          width: 14 },
    { header: "Payment Mode",     key: "payment_mode",    width: 14 },
    { header: "Transaction Ref",  key: "transaction_ref", width: 22 },
    { header: "Error Reason",     key: "error_reason",    width: 35 },
    { header: "Payment Date",     key: "payment_date",    width: 22 },
    { header: "Status",           key: "status",          width: 12 },
  ]);
  invalidFeeRows.rows.forEach((r) => {
    const row = sheet1.addRow(r);
    colorStatusCell(row, sheet1.columns.findIndex(c => c.key === "status") + 1, r.status);
  });

  // ── Sheet 2: Invalid Fee Totals ────────────
  const sheet2 = workbook.addWorksheet("Invalid Fee Totals");
  styleHeader(sheet2, [
    { header: "ID",                   key: "id",                   width: 8  },
    { header: "Student ID",           key: "student_id",           width: 16 },
    { header: "Student Name",         key: "student_name",         width: 25 },
    { header: "Class",                key: "current_class",        width: 12 },
    { header: "Section",              key: "section",              width: 10 },
    { header: "Total Invalid (₹)",    key: "total_invalid_amount", width: 18 },
    { header: "No. of Transactions",  key: "total_transactions",   width: 20 },
    { header: "Last Transaction",     key: "last_transaction_date",width: 22 },
  ]);
  invalidTotalsRows.rows.forEach((r) => sheet2.addRow(r));

  // Grand total row
  const totalRow = sheet2.addRow({
    student_name         : "GRAND TOTAL",
    total_invalid_amount : invalidTotalsRows.rows.reduce((s, r) => s + parseFloat(r.total_invalid_amount || 0), 0),
    total_transactions   : invalidTotalsRows.rows.reduce((s, r) => s + parseInt(r.total_transactions || 0), 0),
  });
  totalRow.font = { bold: true };
  totalRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFD700" } };

  // ── Sheet 3: Fee Not Generated ─────────────
  const sheet3 = workbook.addWorksheet("Fee Not Generated");
  styleHeader(sheet3, [
    { header: "ID",              key: "id",             width: 8  },
    { header: "Student ID",      key: "student_id",     width: 16 },
    { header: "Student Name",    key: "student_name",   width: 25 },
    { header: "Class",           key: "current_class",  width: 12 },
    { header: "Section",         key: "section",        width: 10 },
    { header: "Roll No",         key: "roll_number",    width: 12 },
    { header: "Amount Paid (₹)", key: "amount_paid",    width: 16 },
    { header: "Transaction Ref", key: "transaction_ref",width: 22 },
    { header: "Payment Date",    key: "payment_date",   width: 22 },
    { header: "Error Reason",    key: "error_reason",   width: 35 },
    { header: "Status",          key: "status",         width: 12 },
  ]);
  feeNotGenRows.rows.forEach((r) => {
    const row = sheet3.addRow(r);
    colorStatusCell(row, sheet3.columns.findIndex(c => c.key === "status") + 1, r.status);
  });

  // ── Sheet 4: All Transaction Logs ─────────
  const sheet4 = workbook.addWorksheet("All Transaction Logs");
  styleHeader(sheet4, [
    { header: "Log ID",          key: "id",             width: 8  },
    { header: "Log Type",        key: "log_type",       width: 20 },
    { header: "Student ID",      key: "student_id",     width: 16 },
    { header: "Student Name",    key: "student_name",   width: 25 },
    { header: "Class",           key: "current_class",  width: 12 },
    { header: "Section",         key: "section",        width: 10 },
    { header: "Amount (₹)",      key: "amount",         width: 14 },
    { header: "Transaction Ref", key: "transaction_ref",width: 22 },
    { header: "Error Reason",    key: "error_reason",   width: 35 },
    { header: "Status",          key: "status",         width: 12 },
    { header: "Logged At",       key: "logged_at",      width: 22 },
    { header: "Raw Payload (JSON)", key: "raw_payload", width: 40 },
  ]);
  allLogsRows.rows.forEach((r) => {
    sheet4.addRow({
      ...r,
      raw_payload: JSON.stringify(r.raw_payload),
    });
  });

  return workbook;
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function styleHeader(sheet, columns) {
  sheet.columns = columns;
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1565C0" } };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 20;
}

function colorStatusCell(row, colIdx, status) {
  const cell = row.getCell(colIdx);
  const colorMap = {
    INVALID  : "FFFF4444",
    PENDING  : "FFFFA500",
    RESOLVED : "FF44BB44",
  };
  const color = colorMap[status?.toUpperCase()] || "FFCCCCCC";
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
  cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
}

module.exports = {
  getTransactionLogs,
  exportTransactionLogsToExcel,
};

