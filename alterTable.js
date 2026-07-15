const pool = require("./backend/config/db");

async function alterTable() {
    try {

        await pool.query(`
            ALTER TABLE branches
            RENAME COLUMN id TO branch_id;
        `);

        console.log("id renamed");

        await pool.query(`
            ALTER TABLE branches
            RENAME COLUMN address TO branch_address;
        `);

        console.log("address renamed");

        await pool.query(`
            ALTER TABLE branches
            RENAME COLUMN phone TO contact_number;
        `);

        console.log("phone renamed");

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

alterTable();