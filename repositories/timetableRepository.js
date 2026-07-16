const pool = require("../config/db");

const createTimetable = async (data) => {
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
    data.section_id,
    data.day_name,
    data.period_no,
    data.start_time,
    data.end_time,
    data.subject_id,
    data.teacher_id || null,
    true,
  ];
  const result = await pool.query(query, values);
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
  const result = await pool.query(
    `UPDATE class_timetable_entries SET is_active = false WHERE id = $1 AND is_active = true RETURNING *;`,
    [id]
  );
  return result.rows[0];
};

const getWeeklyTimetable = async (classId) => {
  const result = await pool.query(
    `SELECT * FROM class_timetable_entries WHERE class_id = $1 AND is_active = true ORDER BY day_name ASC, period_no ASC;`,
    [classId]
  );
  return result.rows;
};

const findOverlap = async (classId, dayName, startTime, endTime, periodNo, excludeId = null) => {
  const result = await pool.query(
    `SELECT * FROM class_timetable_entries WHERE class_id = $1 AND day_name = $2 AND is_active = true AND id <> COALESCE($3, -1) AND ((start_time, end_time) OVERLAPS ($4::time, $5::time));`,
    [classId, dayName, excludeId, startTime, endTime]
  );
  return result.rows[0];
};

module.exports = {
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getWeeklyTimetable,
  findOverlap,
};
