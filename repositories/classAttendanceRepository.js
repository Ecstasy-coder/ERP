const pool = require("../config/db");

const getStudentsForAttendance = async ({ branch_id, class_id, section_id }) => {
  let query = `
    SELECT id, full_name AS student_name, admission_no, current_class, current_section, is_active AS status
    FROM students
    WHERE is_active = true
  `;
  const values = [];

  if (branch_id) {
    const branchValue = String(branch_id);
    values.push(branchValue);
    query += ` AND ($${values.length}::text IS NULL OR branch ILIKE '%' || $${values.length} || '%' OR branch = $${values.length})`;
  }

  if (class_id) {
    const classValue = String(class_id);
    values.push(classValue);
    query += ` AND ($${values.length}::text IS NULL OR current_class = $${values.length})`;
  }

  if (section_id) {
    const sectionValue = String(section_id);
    values.push(sectionValue);
    query += ` AND ($${values.length}::text IS NULL OR current_section = $${values.length})`;
  }

  query += ` ORDER BY full_name ASC;`;

  const result = await pool.query(query, values);
  return result.rows;
};

const markAttendance = async (data) => {
  let sectionId = data.section_id || null;

  if (!sectionId) {
    const fallbackSection = await pool.query(`SELECT id FROM sections ORDER BY id LIMIT 1;`);
    sectionId = fallbackSection.rows[0]?.id || null;
  }

  if (!sectionId) {
    const createdSection = await pool.query(`
      INSERT INTO sections (section_name, is_active)
      VALUES ('Default', true)
      RETURNING id;
    `);
    sectionId = createdSection.rows[0].id;
  }

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
    sectionId,
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
