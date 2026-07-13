const pool = require("../config/db");
const bcrypt = require("bcrypt");

console.log("✅ Auth Controller Loaded");

exports.login = async (req, res) => {

  console.log("✅ Login API Called");

  try {

    const { userId, password } = req.body;

    console.log("==================================");
    console.log("LOGIN REQUEST");
    console.log("User ID:", userId);
    console.log("Password:", password);

    const result = await pool.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {

      console.log("User Not Found");

      return res.status(401).json({
        success: false,
        message: "Invalid Credentials"
      });

    }

    const user = result.rows[0];

    console.log("----------- USER FOUND -----------");
    console.log(user);

    console.log("Entered Password:", password);
    console.log("Stored Hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match:", isMatch);

    if (!isMatch) {

      console.log("Password Incorrect");

      return res.status(401).json({
        success: false,
        message: "Invalid Credentials"
      });

    }

    console.log("Login Successful");

    return res.json({
      success: true,
      message: "Login Successful",
      user: {
        id: user.id,
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.log("LOGIN ERROR");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};