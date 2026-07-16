const pool = require('./config/db');
(async () => {
  const res = await pool.query(
    `SELECT conname, pg_get_constraintdef(oid) AS detail
     FROM pg_constraint
     WHERE conrelid = 'class_attendance_records'::regclass AND contype = 'f'`
  );
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
