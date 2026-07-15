const pool = require("./backend/config/db");

const alterTable = async () => {
  try {
    await pool.query(`
      ALTER TABLE subjects
      ADD COLUMN IF NOT EXISTS is_language BOOLEAN DEFAULT FALSE;

    `);
    await pool.query(`
    ALTER TABLE subjects
RENAME COLUMN subject_name TO subject_title; `);

    console.log("✅ is_language column added successfully");
  } catch (err) {
    console.error("❌ Error altering table:", err.message);
  } finally {
    await pool.end();
  }
};

alterTable();