const pool = require("../config/db");

const getStudentsForAttendance = async ({ branch_id, class_id, section_id }) => {
  const classResult = await pool.query(`SELECT class_name FROM study_classes WHERE id = $1 AND is_active = true;`, [class_id]);
  const sectionResult = await pool.query(`SELECT section_name FROM sections WHERE id = $1 AND is_active = true;`, [section_id]);
  const branchResult = await pool.query(`SELECT branch_name FROM branches WHERE id = $1 AND status = true;`, [branch_id]);

  const className = classResult.rows[0]?.class_name || null;
  const sectionName = sectionResult.rows[0]?.section_name || null;
  const branchName = branchResult.rows[0]?.branch_name || null;

  const result = await pool.query(
    `SELECT id, full_name AS student_name, admission_no, current_class, current_section, is_active AS status
     FROM students
     WHERE ($1::text IS NULL OR branch = $1)
       AND ($2::text IS NULL OR current_class = $2)
       AND ($3::text IS NULL OR current_section = $3)
       AND is_active = true
     ORDER BY full_name ASC;`,
    [branchName, className, sectionName]
  );

  return result.rows;
};

const markAttendance = async (data) => {
  const query = `
    INSERT INTO class_attendance_records (
      branch_id,
      academic_year_id,
      class_id,
      section_id,
      student_id,
      attendance_date,
      attendance_status,
      remarks,
      created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const values = [
    data.branch_id,
    data.academic_year_id,
    data.class_id,
    data.section_id,
    data.student_id,
    data.attendance_date,
    data.attendance_status,
    data.remarks || null,
    data.created_by || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAttendanceReport = async ({ branch_id, class_id, section_id, date }) => {
  let sql = `
    SELECT a.*, s.full_name AS student_name, s.admission_no
    FROM class_attendance_records a
    LEFT JOIN students s ON s.id = a.student_id
    WHERE 1 = 1
  `;
  const values = [];

  if (branch_id) {
    values.push(branch_id);
    sql += ` AND a.branch_id = $${values.length}`;
  }

  if (class_id) {
    values.push(class_id);
    sql += ` AND a.class_id = $${values.length}`;
  }

  if (section_id) {
    values.push(section_id);
    sql += ` AND a.section_id = $${values.length}`;
  }

  if (date) {
    values.push(date);
    sql += ` AND a.attendance_date = $${values.length}`;
  }

  sql += ` ORDER BY a.attendance_date DESC, a.student_id ASC;`;
  const result = await pool.query(sql, values);
  return result.rows;
};

const findDuplicateAttendance = async ({ branch_id, class_id, section_id, student_id, attendance_date }) => {
  const result = await pool.query(
    `SELECT id FROM class_attendance_records WHERE branch_id = $1 AND class_id = $2 AND section_id = $3 AND student_id = $4 AND attendance_date = $5;`,
    [branch_id, class_id, section_id, student_id, attendance_date]
  );
  return result.rows[0];
};

module.exports = {
  getStudentsForAttendance,
  markAttendance,
  getAttendanceReport,
  findDuplicateAttendance,
};
