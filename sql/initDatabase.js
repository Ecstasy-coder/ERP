const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const initDatabase = async () => {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, "schema.sql"),
      "utf8"
    );

    await pool.query(sql);

    console.log("✅ Database tables created successfully.");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    throw err;
  }
};

module.exports = initDatabase;