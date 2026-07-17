const pool = require("./config/db");

async function testConnection() {
    try {
        const client = await pool.connect();

        console.log("✅ PostgreSQL Connected Successfully");

        const result = await client.query("SELECT NOW()");

        console.log(result.rows);

        client.release();
    } catch (err) {
        console.error("❌ Database Connection Failed");
        console.error(err);
    }
}

testConnection();