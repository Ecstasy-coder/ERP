const pool = require("../config/db");

const resolveTeacherId = async (data = {}) => {
  if (data.teacher_id !== undefined && data.teacher_id !== null && data.teacher_id !== "") {
    const numericId = Number(data.teacher_id);
    if (Number.isInteger(numericId) && numericId > 0) {
      const existing = await pool.query(`SELECT id FROM teachers WHERE id = $1 AND is_active = true;`, [numericId]);
      if (existing.rows[0]) {
        return numericId;
      }
    }
  }

  const teacherCode = data.employee_code || data.employeeCode || data.teacher_code || data.teacherCode || data.teacher_employee_code || data.teacherEmployeeCode;
  if (teacherCode !== undefined && teacherCode !== null && teacherCode !== "") {
    const normalizedCode = String(teacherCode).trim();
    const existing = await pool.query(`SELECT id FROM teachers WHERE employee_code = $1 AND is_active = true;`, [normalizedCode]);
    if (existing.rows[0]) {
      return existing.rows[0].id;
    }
  }

  return null;
};

const createTimetable = async (data) => {
  const teacherId = await resolveTeacherId(data);
  const sectionId = data.section_id || null;

  const query = `
    INSERT INTO class_timetable_entries (
      branch_id,
      academic_year_id,
      class_id,
      section_id,
      day_name,
      period_no,
      start_time,
      end_time,
      subject_id,
      teacher_id,
      is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `;

  const values = [
    data.branch_id,
    data.academic_year_id,
    data.class_id,
    sectionId,
    data.day_name,
    data.period_no,
    data.start_time,
    data.end_time,
    data.subject_id,
    teacherId || null,
    true,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getWeeklyTimetable = async ({ branch_id, class_id, section_id } = {}) => {
  const result = await pool.query(
    `SELECT cte.*, s.subject_name, t.teacher_name
     FROM class_timetable_entries cte
     LEFT JOIN subjects s ON s.id = cte.subject_id  
     LEFT JOIN teachers t ON t.id = cte.teacher_id
     WHERE cte.is_active = true
       AND cte.branch_id = $1
       AND cte.class_id = $2
       AND cte.section_id = $3
     ORDER BY cte.day_name ASC, cte.period_no ASC;`,
    [branch_id, class_id, section_id]
  );

  return result.rows;
};

const getTimetableById = async (id) => {
  const result = await pool.query(`SELECT * FROM class_timetable_entries WHERE id = $1 AND is_active = true;`, [id]);
  return result.rows[0];
};

const updateTimetable = async (id, data) => {
  const query = `
    UPDATE class_timetable_entries
    SET day_name = COALESCE($1, day_name), period_no = COALESCE($2, period_no), start_time = COALESCE($3, start_time), end_time = COALESCE($4, end_time), subject_id = COALESCE($5, subject_id), teacher_id = COALESCE($6, teacher_id)
    WHERE id = $7 AND is_active = true
    RETURNING *;
  `;

  const values = [data.day_name || null, data.period_no || null, data.start_time || null, data.end_time || null, data.subject_id !== undefined ? data.subject_id : null, data.teacher_id !== undefined ? data.teacher_id : null, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteTimetable = async (id) => {
  const result = await pool.query(`UPDATE class_timetable_entries SET is_active = false WHERE id = $1 AND is_active = true RETURNING *;`, [id]);
  return result.rows[0];
};

const findOverlap = async ({ branch_id, class_id, section_id, day_name, start_time, end_time, period_no, exclude_id = null }) => {
  const result = await pool.query(
    `SELECT * FROM class_timetable_entries WHERE branch_id = $1 AND class_id = $2 AND section_id = $3 AND day_name = $4 AND is_active = true AND id <> COALESCE($5, -1) AND ((start_time, end_time) OVERLAPS ($6::time, $7::time));`,
    [branch_id, class_id, section_id, day_name, exclude_id, start_time, end_time]
  );
  return result.rows[0];
};

module.exports = {
  createTimetable,
  getWeeklyTimetable,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
  findOverlap,
  resolveTeacherId,
};
