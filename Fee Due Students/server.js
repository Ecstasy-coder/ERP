const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const branchRoutes = require("./routes/branchRoutes");
const classRoutes = require("./routes/classRoutes");
const termRoutes = require("./routes/termRoutes");
const studentRoutes = require("./routes/studentRoutes");
const feeDueRoutes = require("./routes/feeDueRoutes");
const smsRoutes = require("./routes/smsRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");

app.use("/api/branches", branchRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/terms", termRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/feedue", feeDueRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Fee Due Students Backend Running Successfully"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});