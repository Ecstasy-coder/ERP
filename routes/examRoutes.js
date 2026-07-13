const express = require("express");
const router = express.Router();

const {
  getExams,
  addExam,
  updateExam,
  deleteExam,
} = require("../controllers/examController");
const {
  getTimetables,
  addTimetable,
  updateTimetable,
  deleteTimetable,
  getHallTickets,
  addHallTicket,
  updateHallTicket,
  deleteHallTicket,
  getGrades,
  addGrade,
  updateGrade,
  deleteGrade,
  getGradeCustom,
  addGradeCustom,
  updateGradeCustom,
  deleteGradeCustom,
} = require('../controllers/examController');
const { uploadFile } = require("../controllers/examController");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get("/", getExams);
router.post("/", addExam);

// File upload for exam attachments
router.post('/upload', upload.single('file'), uploadFile);

// Timetable routes
router.get('/timetable', getTimetables);
router.post('/timetable', addTimetable);
router.put('/timetable/:id', updateTimetable);
router.delete('/timetable/:id', deleteTimetable);

// Hall tickets
router.get('/halltickets', getHallTickets);
router.post('/halltickets', addHallTicket);
router.put('/halltickets/:id', updateHallTicket);
router.delete('/halltickets/:id', deleteHallTicket);

// Grades
router.get('/grades', getGrades);
router.post('/grades', addGrade);
router.put('/grades/:id', updateGrade);
router.delete('/grades/:id', deleteGrade);

// Grade custom
router.get('/grades/custom', getGradeCustom);
router.post('/grades/custom', addGradeCustom);
router.put('/grades/custom/:id', updateGradeCustom);
router.delete('/grades/custom/:id', deleteGradeCustom);

router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

module.exports = router;