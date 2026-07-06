const pool = require('../config/db');

const createMeeting = async ({
  title,
  description,
  meeting_date,
  start_time,
  end_time,
  meeting_type,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO meetings (
      title,
      description,
      meeting_date,
      start_time,
      end_time,
      meeting_type,
      created_at
    ) VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *`,
    [
      title,
      description || null,
      meeting_date,
      start_time,
      end_time,
      meeting_type || 'general',
    ]
  );
  return rows[0];
};

const getMeetings = async ({ start, end }) => {
  let query = 'SELECT * FROM meetings';
  const values = [];
  const conditions = [];

  if (start) {
    values.push(start);
    conditions.push(`meeting_date >= $${values.length}::date`);
  }
  if (end) {
    values.push(end);
    conditions.push(`meeting_date <= $${values.length}::date`);
  }

  if (conditions.length) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  query += ' ORDER BY meeting_date, start_time';

  const { rows } = await pool.query(query, values);
  return rows;
};

const getMeetingById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM meetings WHERE id = $1', [id]);
  return rows[0] || null;
};

const updateMeeting = async (id, {
  title,
  description,
  meeting_date,
  start_time,
  end_time,
  meeting_type,
}) => {
  const { rows } = await pool.query(
    `UPDATE meetings SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      meeting_date = COALESCE($3, meeting_date),
      start_time = COALESCE($4, start_time),
      end_time = COALESCE($5, end_time),
      meeting_type = COALESCE($6, meeting_type),
      updated_at = NOW()
    WHERE id = $7 RETURNING *`,
    [
      title,
      description,
      meeting_date,
      start_time,
      end_time,
      meeting_type,
      id,
    ]
  );
  return rows[0] || null;
};

const deleteMeeting = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM meetings WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
};
