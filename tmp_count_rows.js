const pool = require('./config/db');
(async () => {
  const tables = ['branches','academic_years','sections','subjects','teachers','study_classes','students'];
  for (const table of tables) {
    const res = await pool.query(`SELECT COUNT(*) AS count FROM ${table}`);
    console.log(table + ': ' + res.rows[0].count);
  }
  await pool.end();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
