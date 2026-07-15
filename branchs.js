const pool = require("./backend/config/db");

const checkColumns = async () => {
  try {
    const result = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'branches'
      ORDER BY ordinal_position;
    `);

    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
};

checkColumns();