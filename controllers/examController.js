const pool = require("../config/db");

const examStore = [];
let nextExamId = 1;

const normalizeExam = (item) => ({
  id: item.id,
  title: item.title || "",
  attachment: item.attachment || item.file || "",
  branch: item.branch || "",
  className: item.className || item.class_name || item.class || "",
});

const getExamPayload = (body) => {
  const { title, attachment, file, branch, className, class_name, class: classValue } = body;
  return {
    title: title || "",
    attachment: attachment || file || "",
    branch: branch || "",
    className: className || class_name || classValue || "",
  };
};

const queryExams = async (branch, className) => {
  try {
    const params = [];
    let query = "SELECT * FROM exam_details";

    if (branch || className) {
      query += " WHERE";
      if (branch) {
        query += " branch=$1";
        params.push(branch);
      }
      if (branch && className) {
        query += " AND";
      }
      if (className) {
        query += " class_name=$2";
        params.push(className);
      }
    }

    query += " ORDER BY id DESC";

    const result = await pool.query(query, params);
    return result.rows.map(normalizeExam);
  } catch (error) {
    return examStore
      .filter((exam) => (!branch || exam.branch === branch) && (!className || exam.className === className))
      .sort((a, b) => b.id - a.id)
      .map(normalizeExam);
  }
};

const getExams = async (req, res) => {
  try {
    const { branch, className } = req.query;
    const data = await queryExams(branch, className);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addExam = async (req, res) => {
  try {
    const payload = getExamPayload(req.body);

    try {
      const result = await pool.query(
        `INSERT INTO exam_details(title, attachment, branch, class_name)
         VALUES($1,$2,$3,$4)
         RETURNING *`,
        [payload.title, payload.attachment, payload.branch, payload.className]
      );

      res.status(201).json({ success: true, data: normalizeExam(result.rows[0]) });
      return;
    } catch (error) {
      const exam = normalizeExam({ id: nextExamId++, ...payload });
      examStore.push(exam);
      res.status(201).json({ success: true, data: exam });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = getExamPayload(req.body);

    try {
      const result = await pool.query(
        `UPDATE exam_details
         SET title=$1, attachment=$2, branch=$3, class_name=$4
         WHERE id=$5
         RETURNING *`,
        [payload.title, payload.attachment, payload.branch, payload.className, id]
      );

      res.json({ success: true, data: normalizeExam(result.rows[0]) });
      return;
    } catch (error) {
      const index = examStore.findIndex((item) => item.id === Number(id));
      if (index >= 0) {
        examStore[index] = normalizeExam({ id: Number(id), ...examStore[index], ...payload });
        res.json({ success: true, data: examStore[index] });
        return;
      }
      res.status(404).json({ success: false, message: "Exam not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      await pool.query("DELETE FROM exam_details WHERE id=$1", [id]);
      res.json({ success: true, message: "Deleted Successfully" });
      return;
    } catch (error) {
      const index = examStore.findIndex((item) => item.id === Number(id));
      if (index >= 0) {
        examStore.splice(index, 1);
      }
      res.json({ success: true, message: "Deleted Successfully" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getExams,
  addExam,
  updateExam,
  deleteExam,
};

// --- Timetable CRUD ---
const timetableStore = [];
let nextTimetableId = 1;

const getTimetables = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exam_timetables ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.json({ success: true, data: timetableStore.slice().reverse() });
  }
};

const addTimetable = async (req, res) => {
  try {
    const { exam_title, class_name, date, start_time, end_time, venue } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO exam_timetables(exam_title, class_name, date, start_time, end_time, venue)
         VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
        [exam_title, class_name, date, start_time, end_time, venue]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
      return;
    } catch (err) {
      const item = { id: nextTimetableId++, exam_title, class_name, date, start_time, end_time, venue };
      timetableStore.push(item);
      res.status(201).json({ success: true, data: item });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const { exam_title, class_name, date, start_time, end_time, venue } = req.body;
    try {
      const result = await pool.query(
        `UPDATE exam_timetables SET exam_title=$1, class_name=$2, date=$3, start_time=$4, end_time=$5, venue=$6 WHERE id=$7 RETURNING *`,
        [exam_title, class_name, date, start_time, end_time, venue, id]
      );
      res.json({ success: true, data: result.rows[0] });
      return;
    } catch (err) {
      const idx = timetableStore.findIndex((t) => t.id === Number(id));
      if (idx >= 0) {
        timetableStore[idx] = { ...timetableStore[idx], exam_title, class_name, date, start_time, end_time, venue };
        res.json({ success: true, data: timetableStore[idx] });
        return;
      }
      res.status(404).json({ success: false, message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM exam_timetables WHERE id=$1', [id]);
      res.json({ success: true });
      return;
    } catch (err) {
      const idx = timetableStore.findIndex((t) => t.id === Number(id));
      if (idx >= 0) timetableStore.splice(idx, 1);
      res.json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Hall tickets CRUD ---
const hallStore = [];
let nextHallId = 1;

const getHallTickets = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exam_hall_tickets ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.json({ success: true, data: hallStore.slice().reverse() });
  }
};

const addHallTicket = async (req, res) => {
  try {
    const { student_name, admission_no, exam_title, seat_no, qr_code } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO exam_hall_tickets(student_name, admission_no, exam_title, seat_no, qr_code)
         VALUES($1,$2,$3,$4,$5) RETURNING *`,
        [student_name, admission_no, exam_title, seat_no, qr_code]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
      return;
    } catch (err) {
      const item = { id: nextHallId++, student_name, admission_no, exam_title, seat_no, qr_code };
      hallStore.push(item);
      res.status(201).json({ success: true, data: item });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateHallTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_name, admission_no, exam_title, seat_no, qr_code } = req.body;
    try {
      const result = await pool.query(
        `UPDATE exam_hall_tickets SET student_name=$1, admission_no=$2, exam_title=$3, seat_no=$4, qr_code=$5 WHERE id=$6 RETURNING *`,
        [student_name, admission_no, exam_title, seat_no, qr_code, id]
      );
      res.json({ success: true, data: result.rows[0] });
      return;
    } catch (err) {
      const idx = hallStore.findIndex((h) => h.id === Number(id));
      if (idx >= 0) {
        hallStore[idx] = { ...hallStore[idx], student_name, admission_no, exam_title, seat_no, qr_code };
        res.json({ success: true, data: hallStore[idx] });
        return;
      }
      res.status(404).json({ success: false, message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteHallTicket = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM exam_hall_tickets WHERE id=$1', [id]);
      res.json({ success: true });
      return;
    } catch (err) {
      const idx = hallStore.findIndex((h) => h.id === Number(id));
      if (idx >= 0) hallStore.splice(idx, 1);
      res.json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Grades CRUD ---
const gradeStore = [];
let nextGradeId = 1;

const getGrades = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exam_grades ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.json({ success: true, data: gradeStore.slice().reverse() });
  }
};

const addGrade = async (req, res) => {
  try {
    const { student_name, admission_no, exam_title, total_marks, obtained_marks, grade, remarks } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO exam_grades(student_name, admission_no, exam_title, total_marks, obtained_marks, grade, remarks)
         VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [student_name, admission_no, exam_title, total_marks, obtained_marks, grade, remarks]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
      return;
    } catch (err) {
      const item = { id: nextGradeId++, student_name, admission_no, exam_title, total_marks, obtained_marks, grade, remarks };
      gradeStore.push(item);
      res.status(201).json({ success: true, data: item });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_name, admission_no, exam_title, total_marks, obtained_marks, grade, remarks } = req.body;
    try {
      const result = await pool.query(
        `UPDATE exam_grades SET student_name=$1, admission_no=$2, exam_title=$3, total_marks=$4, obtained_marks=$5, grade=$6, remarks=$7 WHERE id=$8 RETURNING *`,
        [student_name, admission_no, exam_title, total_marks, obtained_marks, grade, remarks, id]
      );
      res.json({ success: true, data: result.rows[0] });
      return;
    } catch (err) {
      const idx = gradeStore.findIndex((g) => g.id === Number(id));
      if (idx >= 0) {
        gradeStore[idx] = { ...gradeStore[idx], student_name, admission_no, exam_title, total_marks, obtained_marks, grade, remarks };
        res.json({ success: true, data: gradeStore[idx] });
        return;
      }
      res.status(404).json({ success: false, message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM exam_grades WHERE id=$1', [id]);
      res.json({ success: true });
      return;
    } catch (err) {
      const idx = gradeStore.findIndex((g) => g.id === Number(id));
      if (idx >= 0) gradeStore.splice(idx, 1);
      res.json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Grade custom CRUD ---
const gradeCustomStore = [];
let nextGradeCustomId = 1;

const getGradeCustom = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exam_grade_custom ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.json({ success: true, data: gradeCustomStore.slice().reverse() });
  }
};

const addGradeCustom = async (req, res) => {
  try {
    const { title, rules } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO exam_grade_custom(title, rules) VALUES($1,$2) RETURNING *`,
        [title, rules ? JSON.stringify(rules) : null]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
      return;
    } catch (err) {
      const item = { id: nextGradeCustomId++, title, rules };
      gradeCustomStore.push(item);
      res.status(201).json({ success: true, data: item });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateGradeCustom = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, rules } = req.body;
    try {
      const result = await pool.query(
        `UPDATE exam_grade_custom SET title=$1, rules=$2 WHERE id=$3 RETURNING *`,
        [title, rules ? JSON.stringify(rules) : null, id]
      );
      res.json({ success: true, data: result.rows[0] });
      return;
    } catch (err) {
      const idx = gradeCustomStore.findIndex((g) => g.id === Number(id));
      if (idx >= 0) {
        gradeCustomStore[idx] = { ...gradeCustomStore[idx], title, rules };
        res.json({ success: true, data: gradeCustomStore[idx] });
        return;
      }
      res.status(404).json({ success: false, message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteGradeCustom = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM exam_grade_custom WHERE id=$1', [id]);
      res.json({ success: true });
      return;
    } catch (err) {
      const idx = gradeCustomStore.findIndex((g) => g.id === Number(id));
      if (idx >= 0) gradeCustomStore.splice(idx, 1);
      res.json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Export additional handlers
module.exports.getTimetables = getTimetables;
module.exports.addTimetable = addTimetable;
module.exports.updateTimetable = updateTimetable;
module.exports.deleteTimetable = deleteTimetable;

module.exports.getHallTickets = getHallTickets;
module.exports.addHallTicket = addHallTicket;
module.exports.updateHallTicket = updateHallTicket;
module.exports.deleteHallTicket = deleteHallTicket;

module.exports.getGrades = getGrades;
module.exports.addGrade = addGrade;
module.exports.updateGrade = updateGrade;
module.exports.deleteGrade = deleteGrade;

module.exports.getGradeCustom = getGradeCustom;
module.exports.addGradeCustom = addGradeCustom;
module.exports.updateGradeCustom = updateGradeCustom;
module.exports.deleteGradeCustom = deleteGradeCustom;

const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    // Provide URL to client
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({ success: true, data: { url: fileUrl, filename: req.file.filename } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports.uploadFile = uploadFile;