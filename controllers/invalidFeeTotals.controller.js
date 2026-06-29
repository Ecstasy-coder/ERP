const service = require("../services/invalidFeeTotals.service");

const getAll = async (req, res) => {
  try {
    const result = await service.getAllInvalidFeeTotals(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getByStudent = async (req, res) => {
  try {
    const record = await service.getStudentInvalidTotal(req.params.student_id);
    if (!record) return res.status(404).json({ success: false, message: "No totals found for this student" });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getByStudent };
