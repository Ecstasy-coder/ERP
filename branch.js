const pool = require("./backend/config/db");

const checkTable = async () => {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
};

checkTable();