require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const pool = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const siblingRoutes = require("./routes/siblingRoutes");
const app = express();
const idCardRoutes = require("./routes/idCardRoutes");
const feeRoutes = require("./routes/feeRoutes");
const termRoutes = require('./routes/termRoutes');
const termFeeRoutes = require('./routes/termFeeRoutes');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/students", studentRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/siblings", siblingRoutes);
app.use("/api/id-cards", idCardRoutes);
app.use("/api/fee-types", require("./routes/feeTypeRoutes"));
app.use("/api/payment-types", require("./routes/paymentTypeRoutes"));
app.use("/api/fees", feeRoutes);
app.use('/api', termRoutes);
app.use('/api/term-fees', termFeeRoutes);
app.use('/api/student-fees', require('./routes/studentfeeRoutes'));
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Student Management API Running"
    });
});

const PORT = Number(process.env.PORT || 5000);

const startListening = (port) => {
    const server = app.listen(port, "0.0.0.0", () => {
        console.log(`🚀 Server Running on Port ${port}`);
    });

    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.warn(`⚠️ Port ${port} is busy. Trying ${port + 1}...`);
            server.close(() => startListening(port + 1));
        } else {
            console.error("❌ Server failed to start", err);
            process.exit(1);
        }
    });
};

async function startServer() {
    try {
        await pool.query("SELECT NOW()");
        console.log("✅ PostgreSQL Connected");
        const sql = fs.readFileSync(
            path.join(__dirname, "sql", "database.sql"),
            "utf8"
        );
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

        startListening(PORT);

    } catch (err) {
        console.error("❌ Server Startup Failed");
        console.error(err);
    }
}
startServer();
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);

    if (err && err.name === 'MulterError') {
        return res.status(400).json({ success: false, message: err.message });
    }

    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : 'Internal Server Error';
    res.status(status).json({ success: false, message });
});