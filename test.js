const pool = require("./config/db");

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100)
    )
  `);

  console.log("Students table created");
};

createTable();