const express = require("express");

const router = express.Router();

const classRoutes = require("./classRoutes");
const teacherRoutes = require("./teacherRoutes");
const classTeacherRoutes = require("./classTeacherRoutes");
const classDetailsRoutes = require("./classDetailsRoutes");
const classAttendanceRoutes = require("./classAttendanceRoutes");
const classDiaryRoutes = require("./classDiaryRoutes");
const classAssignmentRoutes = require("./classAssignmentRoutes");
const classTimetableRoutes = require("./classTimetableRoutes");
const attendanceRoutes = require("./attendanceRoutes");
const diaryRoutes = require("./diaryRoutes");
const assignmentRoutes = require("./assignmentRoutes");
const timetableRoutes = require("./timetableRoutes");

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School ERP Backend Running",
  });
});

router.use("/teachers", teacherRoutes);
router.use("/classes/teachers", classTeacherRoutes);
router.use("/classes/details", classDetailsRoutes);
router.use("/classes/attendance", classAttendanceRoutes);
router.use("/classes/diary", classDiaryRoutes);
router.use("/classes/assignments", classAssignmentRoutes);
router.use("/classes/timetable", classTimetableRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/diaries", diaryRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/timetable", timetableRoutes);
router.use("/classes", classRoutes);

module.exports = router;