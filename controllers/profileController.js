const pool = require("../config/db");

exports.getProfile = async (req, res) => {

  try {

    const { userId } = req.params;

    const result = await pool.query(
      `SELECT
          id,
          user_id,
          name,
          email,
          role
       FROM users
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};