const pool = require("./config/db");

pool.connect()
  .then(() => {
    console.log("✅ PostgreSQL Connected");
  })
  .catch((err) => {
    console.error("❌ Connection Error:", err);
  });