const fs = require("fs");
const path = require("path");
const pool = require("./config/db");

async function createDatabase() {
    try {
        // Read SQL file
        const sql = fs.readFileSync(
            path.join(__dirname, "sql", "database.sql"),
            "utf8"
        );

        // Execute SQL
        await pool.query(sql);

        console.log("✅ Students table created successfully.");

        process.exit(0);

    } catch (err) {

        console.error("❌ Error creating table");
        console.error(err);

        process.exit(1);
    }
}

createDatabase();