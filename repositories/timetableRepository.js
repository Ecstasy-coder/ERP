const pool = require("../config/db");

const createTimetable = async (data) => {
  const query = `
    INSERT INTO class_timetable (class_id, day_name, period_no, subject_name, teacher_id, start_time, end_time, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [data.class_id, data.day_name, data.period_no, data.subject_name, data.teacher_id || null, data.start_time, data.end_time, true];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const updateTimetable = async (id, data) => {
  const query = `
    UPDATE class_timetable
    SET day_name = COALESCE($1, day_name), period_no = COALESCE($2, period_no), subject_name = COALESCE($3, subject_name), teacher_id = COALESCE($4, teacher_id), start_time = COALESCE($5, start_time), end_time = COALESCE($6, end_time)
    WHERE timetable_id = $7 AND status = true
    RETURNING *;
  `;

  const values = [data.day_name || null, data.period_no || null, data.subject_name || null, data.teacher_id !== undefined ? data.teacher_id : null, data.start_time || null, data.end_time || null, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteTimetable = async (id) => {
  const result = await pool.query(
    `UPDATE class_timetable SET status = false WHERE timetable_id = $1 AND status = true RETURNING *;`,
    [id]
  );
  return result.rows[0];
};

const getWeeklyTimetable = async (classId) => {
  const result = await pool.query(
    `SELECT * FROM class_timetable WHERE class_id = $1 AND status = true ORDER BY day_name ASC, period_no ASC;`,
    [classId]
  );
  return result.rows;
};

const findOverlap = async (classId, dayName, startTime, endTime, periodNo, excludeId = null) => {
  const result = await pool.query(
    `SELECT * FROM class_timetable WHERE class_id = $1 AND day_name = $2 AND status = true AND timetable_id <> COALESCE($3, -1) AND ((start_time, end_time) OVERLAPS ($4::time, $5::time));`,
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
