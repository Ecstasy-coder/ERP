const pool = require("../config/db");

const markAttendance = async (data) => {
  const query = `
    INSERT INTO attendance (student_id, class_id, attendance_date, attendance_status, remarks, created_by)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [data.student_id, data.class_id, data.attendance_date, data.attendance_status, data.remarks || null, data.created_by || null];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const updateAttendance = async (id, data) => {
  const query = `
    UPDATE attendance
    SET attendance_status = COALESCE($1, attendance_status), remarks = COALESCE($2, remarks)
    WHERE attendance_id = $3
    RETURNING *;
  `;

  const values = [data.attendance_status || null, data.remarks !== undefined ? data.remarks : null, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getTodayAttendance = async () => {
  const result = await pool.query(
    `SELECT * FROM attendance WHERE attendance_date = CURRENT_DATE ORDER BY attendance_id ASC;`
  );
  return result.rows;
};

const getMonthlyAttendance = async (month, year) => {
  const result = await pool.query(
    `SELECT * FROM attendance WHERE EXTRACT(MONTH FROM attendance_date) = $1 AND EXTRACT(YEAR FROM attendance_date) = $2 ORDER BY attendance_date ASC;`,
    [month, year]
  );
  return result.rows;
};

const getAttendanceReport = async (query = {}) => {
  const { date, classId, studentId } = query;
  let sql = `SELECT * FROM attendance WHERE 1 = 1`;
  const values = [];

  if (date) {
    values.push(date);
    sql += ` AND attendance_date = $${values.length}`;
  }

  if (classId) {
    values.push(classId);
    sql += ` AND class_id = $${values.length}`;
  }

  if (studentId) {
    values.push(studentId);
    sql += ` AND student_id = $${values.length}`;
  }

  sql += ` ORDER BY attendance_date DESC, attendance_id DESC;`;
  const result = await pool.query(sql, values);
  return result.rows;
};

const findDuplicateAttendance = async (studentId, classId, attendanceDate) => {
  const result = await pool.query(
    `SELECT * FROM attendance WHERE student_id = $1 AND class_id = $2 AND attendance_date = $3;`,
    [studentId, classId, attendanceDate]
  );
  return result.rows[0];
};

module.exports = {
  markAttendance,
  updateAttendance,
  getTodayAttendance,
  getMonthlyAttendance,
  getAttendanceReport,
  findDuplicateAttendance,
};
