# Class Teacher Assignment API

## Base URL

`http://localhost:5000/api/classes/teachers`

## Endpoints

### GET /api/classes/teachers
Fetch all active teacher assignments with optional filters.

Query params:
- search
- branch_id
- academic_year_id
- class_id
- section_id
- teacher_id
- page
- limit

### GET /api/classes/teachers/:id
Fetch a single assignment by ID.

### POST /api/classes/teachers
Create a teacher assignment.

Body example:
```json
{
  "branch_id": 1,
  "academic_year_id": 1,
  "class_id": 1,
  "section_id": 1,
  "teacher_id": 1,
  "subject_id": 1,
  "is_class_teacher": true,
  "remarks": "Lead teacher"
}
```

### PUT /api/classes/teachers/:id
Update an existing assignment.

### DELETE /api/classes/teachers/:id
Soft delete an assignment.

---

# Class Details API

## Base URL

`http://localhost:5000/api/classes/details`

### GET /api/classes/details
Fetch class details, selected class teacher data, and student list for a specific branch/class/section.

Query params:
- branch_id (required)
- class_id (required)
- section_id (required)

Response includes:
- branch
- class
- section
- class_teacher
- subjects
- students
