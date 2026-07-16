const pool = require('./config/db');
(async () => {
  const tables = ['students','study_classes','sections','branches','teachers','subjects','class_attendance_records','class_timetable_entries','class_teacher_assignments'];
  for (const table of tables) {
    const res = await pool.query(
      "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position",
      [table]
    );
    console.log('\nTABLE ' + table);
    console.log(JSON.stringify(res.rows, null, 2));
  }
  await pool.end();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
