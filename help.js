const pool = require("./backend/config/db");

async function resetTable() {
    try {

        await pool.query(`
    TRUNCATE TABLE drivers, branches RESTART IDENTITY CASCADE;
`);

        console.log("Branches table reset successfully.");

    } catch (err) {

        console.error(err);

    } finally {

        process.exit();

    }
}

resetTable();