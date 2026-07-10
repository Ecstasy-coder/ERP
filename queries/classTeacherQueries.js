const CLASS_TEACHER_QUERIES = {
  createAssignment: `
    INSERT INTO class_teacher_assignments (
      branch_id,
      academic_year_id,
      class_id,
      section_id,
      teacher_id,
      subject_id,
      is_class_teacher,
      remarks,
      is_active,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10, NOW(), NOW())
    RETURNING *;
  `,

  getAllAssignments: `
    SELECT
      cta.id,
      cta.branch_id,
      cta.academic_year_id,
      cta.class_id,
      cta.section_id,
      cta.teacher_id,
      cta.subject_id,
      cta.is_class_teacher,
      cta.remarks,
      cta.is_active,
      cta.created_by,
      cta.updated_by,
      cta.created_at,
      cta.updated_at,
      b.branch_name,
      ay.academic_year,
      sc.class_name,
      sec.section_name,
      t.teacher_name,
      s.subject_name
    FROM class_teacher_assignments cta
    LEFT JOIN branches b ON b.id = cta.branch_id
    LEFT JOIN academic_years ay ON ay.academic_year_id = cta.academic_year_id
    LEFT JOIN study_classes sc ON sc.id = cta.class_id
    LEFT JOIN sections sec ON sec.id = cta.section_id
    LEFT JOIN teachers t ON t.id = cta.teacher_id
    LEFT JOIN subjects s ON s.id = cta.subject_id
  `,

  getAssignmentById: `
    SELECT
      cta.id,
      cta.branch_id,
      cta.academic_year_id,
      cta.class_id,
      cta.section_id,
      cta.teacher_id,
      cta.subject_id,
      cta.is_class_teacher,
      cta.remarks,
      cta.is_active,
      cta.created_by,
      cta.updated_by,
      cta.created_at,
      cta.updated_at,
      b.branch_name,
      ay.academic_year,
      sc.class_name,
      sec.section_name,
      t.teacher_name,
      s.subject_name
    FROM class_teacher_assignments cta
    LEFT JOIN branches b ON b.id = cta.branch_id
    LEFT JOIN academic_years ay ON ay.academic_year_id = cta.academic_year_id
    LEFT JOIN study_classes sc ON sc.id = cta.class_id
    LEFT JOIN sections sec ON sec.id = cta.section_id
    LEFT JOIN teachers t ON t.id = cta.teacher_id
    LEFT JOIN subjects s ON s.id = cta.subject_id
    WHERE cta.id = $1;
  `,

  updateAssignment: `
    UPDATE class_teacher_assignments
    SET
      branch_id = COALESCE($1, branch_id),
      academic_year_id = COALESCE($2, academic_year_id),
      class_id = COALESCE($3, class_id),
      section_id = COALESCE($4, section_id),
      teacher_id = COALESCE($5, teacher_id),
      subject_id = COALESCE($6, subject_id),
      is_class_teacher = COALESCE($7, is_class_teacher),
      remarks = COALESCE($8, remarks),
      updated_by = COALESCE($9, updated_by),
      updated_at = NOW()
    WHERE id = $10 AND is_active = true
    RETURNING *;
  `,

  softDeleteAssignment: `
    UPDATE class_teacher_assignments
    SET is_active = false, updated_at = NOW(), updated_by = $1
    WHERE id = $2 AND is_active = true
    RETURNING *;
  `,

  findExistingAssignment: `
    SELECT id
    FROM class_teacher_assignments
    WHERE branch_id = $1
      AND academic_year_id = $2
      AND class_id = $3
      AND section_id = $4
      AND teacher_id = $5
      AND subject_id = $6
      AND is_active = true;
  `,

  countAssignments: `
    SELECT COUNT(*)::int AS total
    FROM class_teacher_assignments cta
    WHERE cta.is_active = true
  `,
};

module.exports = CLASS_TEACHER_QUERIES;
