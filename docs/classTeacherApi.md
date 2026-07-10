# Class Teacher Assignment API

## Base URL

`http://localhost:5000/api/class-teachers`

## Endpoints

### GET /api/class-teachers
Fetch all active assignments with optional filters.

Query params:
- search
- branch_id
- academic_year_id
- class_id
- section_id
- teacher_id
- page
- limit

### GET /api/class-teachers/:id
Fetch a single assignment by ID.

### POST /api/class-teachers
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

### PUT /api/class-teachers/:id
Update an existing assignment.

### DELETE /api/class-teachers/:id
Soft delete an assignment.
