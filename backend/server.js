require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const pool = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attenderRoutes = require("./routes/attenderRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/students", studentRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/attenders", attenderRoutes);
app.use("/api/teachers", teacherRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Student Management API Running",
        modules: [
            "Students",
            "Employees",
            "Teachers",
            "Attenders/Aaya"
        ]
    });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Test Database Connection
        await pool.query("SELECT NOW()");
        console.log("✅ PostgreSQL Connected");

        // Read SQL File
        const sql = fs.readFileSync(
            path.join(__dirname, "sql", "database.sql"),
            "utf8"
        );

        // Split SQL statements
        const queries = sql
            .split(";")
            .map(q => q.trim())
            .filter(q => q.length > 0);

        let createdCount = 0;

        for (const query of queries) {
            try {
                await pool.query(query);

                // Get table name
                const match = query.match(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+("?)(\w+)\1/i);

                if (match) {
                    console.log(`✅ Table '${match[2]}' checked/created successfully.`);
                    createdCount++;
                }

            } catch (err) {

                if (err.code === "42P07") {
                    const match = query.match(/CREATE\s+TABLE\s+("?)(\w+)\1/i);

                    // if (match) {
                    //     console.log(`ℹ️ Table '${match[2]}' already exists.`);
                    // }

                } else {
                    console.error(err);
                }
            }
        }

        if (createdCount > 0) {
            console.log(`🎉 Database initialization completed.`);
        } else {
            console.log("ℹ️ All tables already exist. Skipping table creation.");
        }

        app.listen(PORT, () => {
            console.log(`🚀 Server Running on Port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ Server Startup Failed");
        console.error(err);
    }
}
startServer();
