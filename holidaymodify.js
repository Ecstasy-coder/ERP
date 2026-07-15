const pool = require("./backend/config/db");

async function fixAcademicYear() {
    try {

        // ==========================
        // Remove UNIQUE constraint
        // ==========================
        const constraints = await pool.query(`
            SELECT conname
            FROM pg_constraint
            WHERE conrelid = 'academic_years'::regclass
            AND contype = 'u';
        `);

        if (constraints.rows.length > 0) {

            for (const row of constraints.rows) {

                await pool.query(`
                    ALTER TABLE academic_years
                    DROP CONSTRAINT ${row.conname};
                `);

                console.log(`✅ Removed UNIQUE constraint: ${row.conname}`);
            }

        } else {

            console.log("✅ No UNIQUE constraint found.");

        }

        // ==========================
        // Add is_current column
        // ==========================
        await pool.query(`
            ALTER TABLE academic_years
            ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT FALSE;
        `);

        console.log("✅ is_current column added successfully.");

        // ==========================
        // Add updated_at column
        // ==========================
        await pool.query(`
            ALTER TABLE academic_years
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        `);

        console.log("✅ updated_at column added successfully.");

        // ==========================
        // Update existing records
        // ==========================
        await pool.query(`
            UPDATE academic_years
            SET updated_at = created_at
            WHERE updated_at IS NULL;
        `);

        console.log("✅ Existing records updated.");

        // ==========================
        // Show Constraints
        // ==========================
        const constraintData = await pool.query(`
            SELECT conname,
                   pg_get_constraintdef(oid) AS definition
            FROM pg_constraint
            WHERE conrelid = 'academic_years'::regclass;
        `);

        console.log("\nConstraints:");
        console.table(constraintData.rows);

        // ==========================
        // Show Columns
        // ==========================
        const columns = await pool.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'academic_years'
            ORDER BY ordinal_position;
        `);

        console.log("\nAcademic Year Columns:");
        console.table(columns.rows);

        // ==========================
        // Show Records
        // ==========================
        const data = await pool.query(`
            SELECT *
            FROM academic_years
            ORDER BY academic_year_id;
        `);

        console.log("\nAcademic Year Records:");
        console.table(data.rows);

    } catch (err) {

        console.error(err);

    } finally {

        await pool.end();

    }
}

fixAcademicYear();