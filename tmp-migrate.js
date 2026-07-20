const pool = require('./config/db');

(async() => {
    try {
        await pool.query("ALTER TABLE other_fee_details ADD COLUMN IF NOT EXISTS fee_type_id INTEGER");
        const check = await pool.query("SELECT 1 FROM information_schema.columns WHERE table_name = 'other_fee_details' AND column_name = 'fee_type'");
        if (check.rows.length > 0) {
            await pool.query("ALTER TABLE other_fee_details ALTER COLUMN fee_type DROP NOT NULL");
        }
        await pool.query("ALTER TABLE other_fee_details DROP CONSTRAINT IF EXISTS fk_other_fee_student");
        await pool.query("ALTER TABLE other_fee_details DROP CONSTRAINT IF EXISTS fk_other_fee_branch");
        await pool.query("ALTER TABLE other_fee_details DROP CONSTRAINT IF EXISTS fk_other_fee_class");
        await pool.query("ALTER TABLE other_fee_details DROP CONSTRAINT IF EXISTS fk_other_fee_year");
        console.log('migration applied');
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
    process.exit(0);
})();