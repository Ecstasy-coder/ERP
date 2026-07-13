const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// ============================
// Create Employee
// ============================
exports.createEmployee = async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            gender,
            phone,
            email,
            role,
            salary,
            status
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !phone || !email) {
            return res.status(400).json({
                success: false,
                message: "firstName, lastName, phone, and email are required"
            });
        }

        // Check for duplicate email
        const emailCheck = await pool.query(
            "SELECT id FROM employees WHERE LOWER(email) = LOWER($1)",
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Generate UUID
        const employeeId = uuidv4();

        const count = await pool.query(
            "SELECT COUNT(*) FROM employees"
        );

        const next = Number(count.rows[0].count) + 1;
        const employeeCode = "EMP" + String(next).padStart(5, "0");

        const dbRole = role || "Attender";
        const dbStatus = status || "active";

        const query = `
INSERT INTO employees(
    id,
    "employeeCode",
    "firstName",
    "lastName",
    gender,
    phone,
    email,
    role,
    salary,
    status,
    "createdAt",
    "updatedAt"
)
VALUES(
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
)
RETURNING *;
`;

        const values = [
            employeeId,
            employeeCode,
            firstName,
            lastName,
            gender,
            phone,
            email,
            dbRole,
            salary,
            dbStatus
        ];

        const result = await pool.query(query, values);

        res.status(201).json({
            success: true,
            message: "Employee Created Successfully",
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};


// ============================
// Employee List
// ============================
exports.getEmployees = async (req,res)=>{

    try {

        let {
            page = 1,
            limit = 10,
            search = "",
            branch = "",
            role = "",
            status = ""
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const offset = (page - 1) * limit;

        let query = `
SELECT
    id,
    "employeeCode" AS "employeeCode",
    "firstName" AS "firstName",
    "lastName" AS "lastName",
    gender,
    phone,
    email,
    role,
    status,
    "createdAt" AS "createdAt",
    "updatedAt" AS "updatedAt"
FROM employees
WHERE 1=1
`;

        let values = [];
        let index = 1;

        if (search) {
            query += `
AND(
    LOWER("firstName") LIKE LOWER($${index})
    OR LOWER("lastName") LIKE LOWER($${index})
    OR LOWER("employeeCode") LIKE LOWER($${index})
)
`;
            values.push(`%${search}%`);
            index++;
        }

        if (branch) {
            query += ` AND branch=$${index}`;
            values.push(branch);
            index++;
        }

        if (role) {
            query += ` AND role=$${index}`;
            values.push(role);
            index++;
        }

        if (status) {
            query += ` AND status=$${index}`;
            values.push(status);
            index++;
        }

        query += `
ORDER BY id DESC
LIMIT $${index}
OFFSET $${index + 1}
`;

        values.push(limit);
        values.push(offset);

        const employees = await pool.query(query, values);

        let totalQuery = `SELECT COUNT(*) FROM employees WHERE 1=1`;
        let totalValues = [];
        let totalIndex = 1;

        if (search) {
            totalQuery += ` AND (LOWER("firstName") LIKE LOWER($${totalIndex}) OR LOWER("lastName") LIKE LOWER($${totalIndex}) OR LOWER("employeeCode") LIKE LOWER($${totalIndex}))`;
            totalValues.push(`%${search}%`);
            totalIndex++;
        }

        if (branch) {
            totalQuery += ` AND branch=$${totalIndex}`;
            totalValues.push(branch);
            totalIndex++;
        }

        if (role) {
            totalQuery += ` AND role=$${totalIndex}`;
            totalValues.push(role);
            totalIndex++;
        }

        if (status) {
            totalQuery += ` AND status=$${totalIndex}`;
            totalValues.push(status);
            totalIndex++;
        }

        const total = await pool.query(totalQuery, totalValues);

        res.json({
            success: true,
            total: Number(total.rows[0].count),
            page,
            limit,
            data: employees.rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};


// ============================
// Attender / Aaya List
// ============================
exports.getAttenders = async (req, res) => {

    try {

        let {
            page = 1,
            limit = 10,
            search = "",
            branch = ""
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const offset = (page - 1) * limit;

        let query = `
SELECT
    id,
    "employeeCode" AS "employeeCode",
    "firstName" AS "firstName",
    "lastName" AS "lastName",
    gender,
    phone,
    email,
    role,
    status,
    "createdAt" AS "createdAt",
    "updatedAt" AS "updatedAt"
FROM employees
WHERE role IN ('Attender','Aaya')
`;

        let values = [];
        let index = 1;

        if (search) {
            query += `
AND(
    LOWER("firstName") LIKE LOWER($${index})
    OR LOWER("lastName") LIKE LOWER($${index})
    OR LOWER("employeeCode") LIKE LOWER($${index})
)
`;
            values.push(`%${search}%`);
            index++;
        }

        if (branch) {
            query += ` AND branch=$${index}`;
            values.push(branch);
            index++;
        }

        query += `
ORDER BY id DESC
LIMIT $${index}
OFFSET $${index + 1}
`;

        values.push(limit);
        values.push(offset);

        console.error('getAttenders SQL:', query);
        console.error('getAttenders values:', values);
        const employees = await pool.query(query, values);

        let totalQuery = `SELECT COUNT(*) FROM employees WHERE role IN ('Attender','Aaya')`;
        let totalValues = [];
        let totalIndex = 1;

        if (search) {
            totalQuery += ` AND (LOWER("firstName") LIKE LOWER($${totalIndex}) OR LOWER("lastName") LIKE LOWER($${totalIndex}) OR LOWER("employeeCode") LIKE LOWER($${totalIndex}))`;
            totalValues.push(`%${search}%`);
            totalIndex++;
        }

        if (branch) {
            totalQuery += ` AND branch=$${totalIndex}`;
            totalValues.push(branch);
            totalIndex++;
        }

        const total = await pool.query(totalQuery, totalValues);

        res.json({
            success: true,
            total: Number(total.rows[0].count),
            page,
            limit,
            data: employees.rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};


// ============================
// Employee Details
// ============================
exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM employees WHERE id=$1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee Not Found"
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================
// Update Employee
// ============================
exports.updateEmployee = async(req, res) => {

    try {

        const { id } = req.params;

        const {
            branch,
            full_name,
            firstName,
            lastName,
            gender,
            phone,
            secondary_mobile,
            email,
            secondary_email,
            dob,
            aadhaar_number,
            address,
            employee_type,
            designation,
            employee_role,
            role,
            salary,
            joining_date,
            relieved_date,
            other_details,
            status,
            is_active
        } = req.body;

        const existing = await pool.query(
            "SELECT photo FROM employees WHERE id=$1",
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee Not Found"
            });
        }

        const finalFirstName = firstName || (full_name ? full_name.split(" ")[0] : null);
        const finalLastName = lastName || (full_name ? full_name.split(" ").slice(1).join(" ") : null);

        let photo = existing.rows[0].photo;
        if (req.file) {
            photo = req.file.path;
        }

        const dbRole = role || employee_role;
        const dbStatus = status || (is_active === "false" || is_active === false ? "inactive" : "active");

        const query = `
            UPDATE employees SET
                branch=$1,
                firstName=$2,
                lastName=$3,
                gender=$4,
                phone=$5,
                secondary_mobile=$6,
                email=$7,
                secondary_email=$8,
                dob=$9,
                aadhaar_number=$10,
                address=$11,
                employee_type=$12,
                designation=$13,
                role=$14,
                salary=$15,
                joining_date=$16,
                relieved_date=$17,
                photo=$18,
                other_details=$19,
                status=$20,
                updatedAt=NOW()
            WHERE id=$21
            RETURNING *;
        `;

        const values = [
            branch,
            finalFirstName,
            finalLastName,
            gender,
            phone,
            secondary_mobile,
            email,
            secondary_email,
            dob,
            aadhaar_number,
            address,
            employee_type,
            designation,
            dbRole,
            salary,
            joining_date,
            relieved_date,
            photo,
            other_details,
            dbStatus,
            id
        ];

        const result = await pool.query(query, values);

        res.json({
            success: true,
            message: "Employee Updated Successfully",
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};


// ============================
// Delete Employee
// ============================
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM employees WHERE id=$1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee Not Found"
            });
        }

        res.json({
            success: true,
            message: "Employee Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};