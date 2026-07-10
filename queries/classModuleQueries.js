const CLASS_MODULE_QUERIES = {
  getClassDetails: `
    SELECT
      b.id AS branch_id,
      b.branch_name,
      sc.id AS class_id,
      sc.class_name,
      sec.id AS section_id,
      sec.section_name,
      cta.teacher_id,
      t.teacher_name,
      cta.subject_id,
      s.subject_name
    FROM study_classes sc
    LEFT JOIN sections sec ON sec.id = $3
    LEFT JOIN branches b ON b.id = $1
    LEFT JOIN class_teacher_assignments cta
      ON cta.branch_id = $1 AND cta.class_id = $2 AND cta.section_id = $3 AND cta.is_active = true
    LEFT JOIN teachers t ON t.id = cta.teacher_id
    LEFT JOIN subjects s ON s.id = cta.subject_id
    WHERE sc.id = $2 AND sc.is_active = true;
  `,
};

module.exports = CLASS_MODULE_QUERIES;
