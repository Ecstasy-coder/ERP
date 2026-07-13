# API Testing Guide - ERP Solutions

## Base URL
```
http://localhost:5000
```

---

## 1. STUDENTS ENDPOINTS

### 1.1 Create Student
**POST** `/api/students`
- **Content-Type**: multipart/form-data (if uploading photo)
- **Authentication**: None

**Request Body** (JSON):
```json
{
  "branch": "Computer Science",
  "register_no": "CS001",
  "full_name": "John Doe",
  "gender": "Male",
  "primary_mobile": "9876543210",
  "secondary_mobile": "9876543211",
  "primary_email": "john@example.com",
  "secondary_email": "john.doe@example.com",
  "dob": "2005-01-15",
  "aadhaar_number": "123456789012",
  "admission_date": "2023-06-01",
  "current_academic_year": "2023-2024",
  "current_class": "3rd Year",
  "current_section": "A",
  "address": "123 Main Street, City",
  "caste": "General",
  "sub_caste": "N/A",
  "admission_academic_year": "2023-2024",
  "admission_class": "1st Year",
  "father_name": "James Doe",
  "father_qualification": "B.Tech",
  "father_occupation": "Engineer",
  "mother_name": "Jane Doe",
  "mother_qualification": "B.A",
  "mother_occupation": "Teacher",
  "sibling_details": [{"name": "Alex Doe", "age": 18}],
  "first_language": "English",
  "second_language": "Hindi",
  "third_language": "Spanish",
  "other_details": "No specific notes",
  "is_active": true
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "Student Created Successfully",
  "data": {
    "id": 1,
    "admission_no": "O26000001",
    "register_no": "CS001",
    "full_name": "John Doe",
    ...
  }
}
```

---

### 1.2 Get All Students
**GET** `/api/students?page=1&limit=10&search=&branch=&className=`

**Query Parameters**:
- `page` (default: 1) - Page number
- `limit` (default: 10) - Records per page
- `search` - Search by name or admission number
- `branch` - Filter by branch
- `className` - Filter by class

**Expected Response** (200):
```json
{
  "success": true,
  "total": 1,
  "page": 1,
  "limit": 10,
  "data": [...]
}
```

---

### 1.3 Get Student by ID
**GET** `/api/students/:id`

**Expected Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "John Doe",
    ...
  }
}
```

---

### 1.4 Update Student
**PUT** `/api/students/:id`
- **Content-Type**: multipart/form-data (if uploading photo)

**Request Body**: Same as Create Student (all fields optional)

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Student Updated Successfully",
  "data": {...}
}
```

---

### 1.5 Delete Student
**DELETE** `/api/students/:id`

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Student Deleted Successfully"
}
```

---

## 2. EMPLOYEES ENDPOINTS

### 2.1 Create Employee
**POST** `/api/employee`
- **Content-Type**: application/json

**Request Body**:
```json
{
  "firstName": "Robert",
  "lastName": "Smith",
  "gender": "Male",
  "phone": "9876543210",
  "email": "robert@example.com",
  "role": "Teacher",
  "salary": 50000,
  "status": "active"
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "Employee Created Successfully",
  "data": {
    "id": 1,
    "employeeCode": "EMP00001",
    "firstName": "Robert",
    "lastName": "Smith",
    ...
  }
}
```

---

### 2.2 Get All Employees
**GET** `/api/employee?page=1&limit=10&search=&role=&status=&branch=`

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 10)
- `search` - Search by name or employee code
- `role` - Filter by role
- `status` - Filter by status (active/inactive)
- `branch` - Filter by branch

**Expected Response** (200):
```json
{
  "success": true,
  "total": 1,
  "page": 1,
  "limit": 10,
  "data": [...]
}
```

---

### 2.3 Get Employee by ID
**GET** `/api/employee/:id`

**Expected Response** (200):
```json
{
  "success": true,
  "data": {...}
}
```

---

### 2.4 Update Employee
**PUT** `/api/employee/:id`

**Request Body** (all fields optional):
```json
{
  "firstName": "Robert",
  "lastName": "Johnson",
  "gender": "Male",
  "phone": "9876543210",
  "secondary_mobile": "9876543211",
  "email": "robert.j@example.com",
  "secondary_email": "robert.johnson@example.com",
  "dob": "1990-05-20",
  "aadhaar_number": "123456789012",
  "address": "456 Oak Street",
  "employee_type": "Full-time",
  "designation": "Senior Teacher",
  "role": "Teacher",
  "salary": 55000,
  "joining_date": "2020-01-15",
  "relieved_date": null,
  "status": "active",
  "other_details": "Notes here"
}
```

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Employee Updated Successfully",
  "data": {...}
}
```

---

### 2.5 Delete Employee
**DELETE** `/api/employee/:id`

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Employee Deleted Successfully"
}
```

---

### 2.6 Get Attenders/Aaya (from Employees)
**GET** `/api/employee/attenders?page=1&limit=10&search=&branch=`

**Expected Response** (200):
```json
{
  "success": true,
  "total": 2,
  "page": 1,
  "limit": 10,
  "data": [...]
}
```

---

## 3. ATTENDERS ENDPOINTS

### 3.1 Create Attender/Aaya
**POST** `/api/attenders`

**Request Body**:
```json
{
  "firstName": "Maria",
  "lastName": "Garcia",
  "gender": "Female",
  "phone": "9876543210",
  "email": "maria@example.com",
  "role": "Attender",
  "salary": 15000,
  "status": "active"
}
```

**Note**: `role` must be either "Attender" or "Aaya"

**Expected Response** (201):
```json
{
  "success": true,
  "message": "Attender/Aaya Created Successfully",
  "data": {
    "id": 1,
    "employeeCode": "ATT00001",
    "firstName": "Maria",
    "lastName": "Garcia",
    "role": "Attender",
    ...
  }
}
```

---

### 3.2 Get All Attenders
**GET** `/api/attenders?page=1&limit=10&search=&role=`

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 10)
- `search` - Search by name or employee code
- `role` - Filter by role (Attender/Aaya)

**Expected Response** (200):
```json
{
  "success": true,
  "total": 1,
  "page": 1,
  "limit": 10,
  "data": [...]
}
```

---

### 3.3 Get Attender by ID
**GET** `/api/attenders/:id`

**Expected Response** (200):
```json
{
  "success": true,
  "data": {...}
}
```

---

### 3.4 Update Attender
**PUT** `/api/attenders/:id`

**Request Body** (all optional):
```json
{
  "firstName": "Maria",
  "lastName": "Garcia",
  "gender": "Female",
  "phone": "9876543210",
  "email": "maria@example.com",
  "role": "Aaya",
  "salary": 16000,
  "status": "active"
}
```

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Attender/Aaya updated successfully",
  "data": {...}
}
```

---

### 3.5 Delete Attender
**DELETE** `/api/attenders/:id`

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Attender/Aaya deleted successfully"
}
```

---

## 4. TEST CHECKLIST

### Students Testing
- [ ] Create a new student
- [ ] Retrieve all students (with pagination)
- [ ] Search students by name
- [ ] Filter students by branch
- [ ] Get student by ID
- [ ] Update student details
- [ ] Delete student
- [ ] Upload photo with student (if feature exists)

### Employees Testing
- [ ] Create a new employee
- [ ] Retrieve all employees (with pagination)
- [ ] Search employees
- [ ] Filter by role
- [ ] Filter by status
- [ ] Get employee by ID
- [ ] Update employee details
- [ ] Delete employee
- [ ] Get attenders list from employees endpoint

### Attenders Testing
- [ ] Create attender (role: Attender)
- [ ] Create aaya (role: Aaya)
- [ ] Retrieve all attenders (with pagination)
- [ ] Search attenders
- [ ] Filter by role
- [ ] Get attender by ID
- [ ] Update attender
- [ ] Delete attender

### Error Testing
- [ ] Create with missing required fields (should return 400)
- [ ] Get non-existent record (should return 404)
- [ ] Invalid pagination (page/limit)
- [ ] Invalid role for attender (should return 400)
- [ ] Invalid status for attender (should return 400)

---

## 5. POSTMAN SETUP INSTRUCTIONS

1. **Create Collection**: "ERP Solutions API"
2. **Add Environment Variable**:
   - Variable: `base_url`
   - Value: `http://localhost:5000`
   - Use `{{base_url}}` in requests

3. **Set Pre-request Script** (optional):
```javascript
// Auto-generate timestamps or IDs if needed
pm.globals.set("timestamp", Date.now());
```

4. **Import Requests**: 
   - Copy the endpoint URLs and request bodies above
   - Create folder structure: Students, Employees, Attenders
   - Organize CRUD operations in each folder

---

## 6. QUICK TESTING WITH cURL

### Test Server Connection
```bash
curl http://localhost:5000
```

### Create Employee
```bash
curl -X POST http://localhost:5000/api/employee \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Robert",
    "lastName": "Smith",
    "gender": "Male",
    "phone": "9876543210",
    "email": "robert@example.com",
    "role": "Teacher",
    "salary": 50000,
    "status": "active"
  }'
```

### Get All Employees
```bash
curl http://localhost:5000/api/employee?page=1&limit=10
```

### Update Employee
```bash
curl -X PUT http://localhost:5000/api/employee/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Robert", "salary": 55000}'
```

### Delete Employee
```bash
curl -X DELETE http://localhost:5000/api/employee/1
```

---

## 7. EXPECTED STATUS CODES

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST) |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Server Error |

---

## Notes
- Ensure the server is running: `npm start`
- Database must be initialized with tables
- All dates should be in `YYYY-MM-DD` format
- Photos are stored in respective upload folders (uploads/students, uploads/employees, uploads/attenders)
