const pool = require('../config/db');

exports.login = async (req, res) => {

  try {

    console.log("BODY:", req.body);

    const { userId, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users'
    );

    console.log("USERS:", result.rows);

    return res.json({
      success: true,
      received: req.body,
      users: result.rows
    });

  } catch (error) {

    console.log("ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }

};