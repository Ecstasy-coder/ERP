const express = require("express");
const cors = require("cors");
const examRoutes = require("./routes/examRoutes");
const pool = require("./config/db");
const fs = require("fs");
const path = require("path");

const gradeSystemRoutes = require("./routes/gradeSystemRoutes");
const gradeReportRoutes = require("./routes/gradeReportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Routes
app.use("/api/exams", examRoutes);

app.use("/api/grade-system", gradeSystemRoutes);
app.use("/api/grade-report", gradeReportRoutes);
// Ensure uploads directory exists and serve it
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Ensure exam_details table exists
const ensureTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_details (
        id SERIAL PRIMARY KEY,
        title TEXT,
        attachment TEXT,
        branch VARCHAR(128),
        class_name VARCHAR(128),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ exam_details table checked/created');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_timetables (
        id SERIAL PRIMARY KEY,
        exam_title TEXT,
        class_name VARCHAR(128),
        date DATE,
        start_time VARCHAR(32),
        end_time VARCHAR(32),
        venue VARCHAR(128),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ exam_timetables table checked/created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_hall_tickets (
        id SERIAL PRIMARY KEY,
        student_name TEXT,
        admission_no VARCHAR(64),
        exam_title TEXT,
        seat_no VARCHAR(32),
        qr_code TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ exam_hall_tickets table checked/created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_grades (
        id SERIAL PRIMARY KEY,
        student_name TEXT,
        admission_no VARCHAR(64),
        exam_title TEXT,
        total_marks INT,
        obtained_marks INT,
        grade VARCHAR(16),
        remarks TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ exam_grades table checked/created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_grade_custom (
        id SERIAL PRIMARY KEY,
        title TEXT,
        rules JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ exam_grade_custom table checked/created');
  } catch (err) {
    console.warn('Database unavailable, continuing in in-memory fallback mode:', err.message);
  }
};

ensureTables();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ERP Backend Running Successfully",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});