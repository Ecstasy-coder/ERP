const pool = require("../config/db");

const getClassDetails = async ({ branch_id, class_id, section_id }) => {
  const classResult = await pool.query(
    `SELECT id, class_name, is_active FROM study_classes WHERE id = $1 AND is_active = true;`,
    [class_id]
  );

  const sectionResult = await pool.query(
    `SELECT id, section_name, is_active FROM sections WHERE id = $1 AND is_active = true;`,
    [section_id]
  );

  const branchResult = await pool.query(
    `SELECT id, branch_name, status AS is_active FROM branches WHERE id = $1 AND status = true;`,
    [branch_id]
  );

  const assignmentResult = await pool.query(
    `SELECT cta.id, cta.is_class_teacher, cta.teacher_id, cta.subject_id, t.teacher_name, s.subject_name
     FROM class_teacher_assignments cta
     LEFT JOIN teachers t ON t.id = cta.teacher_id
     LEFT JOIN subjects s ON s.id = cta.subject_id
     WHERE cta.branch_id = $1 AND cta.class_id = $2 AND cta.section_id = $3 AND cta.is_active = true
     ORDER BY cta.is_class_teacher DESC, t.teacher_name ASC;`,
    [branch_id, class_id, section_id]
  );

  const className = classResult.rows[0]?.class_name || null;
  const sectionName = sectionResult.rows[0]?.section_name || null;
  const branchName = branchResult.rows[0]?.branch_name || null;

  const studentResult = await pool.query(
    `SELECT id, full_name AS student_name, admission_no, primary_email AS email, primary_mobile AS phone, current_class, current_section, is_active AS status
     FROM students
     WHERE ($1::text IS NULL OR branch = $1)
       AND ($2::text IS NULL OR current_class = $2)
       AND ($3::text IS NULL OR current_section = $3)
       AND is_active = true
     ORDER BY full_name ASC;`,
    [branchName, className, sectionName]
  );

  return {
    branch: branchResult.rows[0] || null,
    class: classResult.rows[0] || null,
    section: sectionResult.rows[0] || null,
    class_teacher: assignmentResult.rows.find((item) => item.is_class_teacher) || null,
    subjects: assignmentResult.rows.filter((item) => item.subject_name),
    students: studentResult.rows,
  };
};

module.exports = {
  getClassDetails,
};
