const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const VALID_ROLES = ["Attender", "Aaya"];
const VALID_STATUS = ["active", "inactive"];

exports.createAttender = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      phone,
      email,
      role = "Attender",
      salary,
      status = "active"
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "firstName, lastName, phone, and email are required"
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either Attender or Aaya."
      });
    }

    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be active or inactive."
      });
    }

    // Check for duplicate email
    const emailCheck = await pool.query(
      "SELECT id FROM attenders WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Generate UUID
    const attenderId = uuidv4();

    const countResult = await pool.query("SELECT COUNT(*) FROM attenders");
    const next = Number(countResult.rows[0].count) + 1;
    const employeeCode = "ATT" + String(next).padStart(5, "0");

    const query = `
      INSERT INTO attenders(
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
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    const values = [
      attenderId,
      employeeCode,
      firstName,
      lastName,
      gender,
      phone,
      email,
      role,
      salary,
      status
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "Attender/Aaya Created Successfully",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAttenders = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      role = ""
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;

    const columns = [
      "id",
      '"employeeCode" AS "employeeCode"',
      '"firstName" AS "firstName"',
      '"lastName" AS "lastName"',
      "gender",
      "phone",
      "email",
      "role",
      "salary",
      "status",
      '"createdAt" AS "createdAt"',
      '"updatedAt" AS "updatedAt"'
    ].join(",\n      ");

    let query = `
      SELECT
        ${columns}
      FROM attenders
      WHERE 1=1
    `;

    const values = [];
    let index = 1;

    if (role) {
      if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role filter must be Attender or Aaya."
        });
      }
      query += ` AND role=$${index}`;
      values.push(role);
      index++;
    }

    if (search) {
      query += ` AND (
        LOWER("firstName") LIKE LOWER($${index})
        OR LOWER("lastName") LIKE LOWER($${index})
        OR LOWER("employeeCode") LIKE LOWER($${index})
        OR LOWER(email) LIKE LOWER($${index})
      )`;
      values.push(`%${search}%`);
      index++;
    }

    query += `\n      ORDER BY "updatedAt" DESC\n      LIMIT $${index}\n      OFFSET $${index + 1}\n    `;
    values.push(limit, offset);

    const employees = await pool.query(query, values);

    let countQuery = `SELECT COUNT(*) FROM attenders WHERE 1=1`;
    const countValues = [];
    let countIndex = 1;

    if (role) {
      countQuery += ` AND role=$${countIndex}`;
      countValues.push(role);
      countIndex++;
    }

    if (search) {
      countQuery += ` AND (
        LOWER("firstName") LIKE LOWER($${countIndex})
        OR LOWER("lastName") LIKE LOWER($${countIndex})
        OR LOWER("employeeCode") LIKE LOWER($${countIndex})
        OR LOWER(email) LIKE LOWER($${countIndex})
      )`;
      countValues.push(`%${search}%`);
      countIndex++;
    }

    const totalResult = await pool.query(countQuery, countValues);

    res.json({
      success: true,
      total: Number(totalResult.rows[0].count),
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

exports.getAttenderById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT * FROM attenders
      WHERE id=$1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attender/Aaya not found"
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

exports.updateAttender = async (req, res) => {
  try {
    const { id } = req.params;
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

    if (role && !VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either Attender or Aaya."
      });
    }

    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be active or inactive."
      });
    }

    const existing = await pool.query(
      `SELECT * FROM attenders WHERE id=$1`,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attender/Aaya not found"
      });
    }

    const current = existing.rows[0];
    const updatedRole = role || current.role;
    const updatedStatus = status || current.status;

    const query = `
      UPDATE attenders SET
        "firstName" = $1,
        "lastName" = $2,
        gender = $3,
        phone = $4,
        email = $5,
        role = $6,
        salary = $7,
        status = $8,
        "updatedAt" = NOW()
      WHERE id = $9
      RETURNING *;
    `;

    const values = [
      firstName || current.firstName,
      lastName || current.lastName,
      gender || current.gender,
      phone || current.phone,
      email || current.email,
      updatedRole,
      salary || current.salary,
      updatedStatus,
      id
    ];

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: "Attender/Aaya updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteAttender = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM attenders WHERE id=$1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attender/Aaya not found"
      });
    }

    res.json({
      success: true,
      message: "Attender/Aaya deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
