const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./backend/config/db");

const holidayRoutes = require("./backend/routes/holidayRoutes");
const branchRoutes = require("./backend/routes/branchRoutes");
const academicYearRoutes = require("./backend/routes/academicYearRoutes");
const reportHolidayRoutes = require("./backend/routes/reportholidayRoutes");
// const classSubjectRoutes = require("./backend/routes/classSubjectRoutes");
const subjectRoutes = require("./backend/routes/subjectRoutes");
const driverRoutes = require("./backend/routes/driverRoutes");
const vehicleRoutes = require("./backend/routes/vehicleRoutes");

const examTypeRoutes = require("./backend/routes/examTypeRoutes");
const gradeSystemRoutes = require("./backend/routes/gradeSystemRoutes");
const gradeReportRoutes = require("./backend/routes/gradeReportRoutes");
const transportStudentRoutes = require("./backend/routes/transportStudentRoutes");
const studentRoutes = require("./backend/routes/studentRoutes");

const feeStructureRoutes = require("./backend/routes/feeStructureRoutes");
const termFeeRoutes = require("./backend/routes/termFeeRoutes");

const errorHandler = require("./middleware/errorHandler");
const app = express();

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// Home Route
// =========================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ERP Backend API is Running..."
    });
});



const classSectionRoutes = require("./backend/routes/classSectionRoutes");

// Class Section Routes
app.use("/api/class-sections", classSectionRoutes);
// =========================
// Holiday Routes
// =========================
app.use("/api/holidays", holidayRoutes);

// =========================
// Branch Routes
// =========================
app.use("/api/branches", branchRoutes);

// =========================
// Academic Year Routes
// =========================
app.use("/api/academic-years", academicYearRoutes);


app.use("/api/reports/holidays", reportHolidayRoutes);
  
app.use("/api/classes", require("./backend/routes/classRoutes"));
app.use("/api/fee-types",require("./backend/routes/feeTypeRoutes"));
app.use("/api/payment-types",require("./backend/routes/paymentTypeRoutes"));

app.use("/api/fee-structure", feeStructureRoutes);
app.use("/api/term-fees", termFeeRoutes);

app.use("/api/subjects", subjectRoutes);

// Class Subject Mapping Routes
// app.use("/api/class-subjects", classSubjectRoutes);



app.use("/api/drivers", driverRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use(
 "/api/class-subject-assignments",
    require("./backend/routes/classSubjectAssignRoutes")
);

// API Routes
app.use("/api/exam-types", examTypeRoutes);
app.use("/api/grade-system", gradeSystemRoutes);
app.use("/api/grade-report", gradeReportRoutes);

app.use("/api/transport-students", transportStudentRoutes);


app.use("/api/students", studentRoutes);


// =========================
// 404 Route
// =========================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   
    console.log("ERP Backend Started");
    console.log(`Server running on port ${PORT}`);
    
});