const service = require("../services/invalidFeeData.service");

const getAll = async (req, res) => {
  try {
    const result = await service.getAllInvalidFeeData(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const record = await service.getInvalidFeeById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const record = await service.createInvalidFeeData(req.body);

    return res.status(201).json({
      success: true,
      data: record,
    });
  } catch (err) {
    console.error("❌ Error object:", err);
    console.error("❌ Error message:", err.message);
    console.error("❌ Error stack:", err.stack);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "status is required" });
    const record = await service.updateInvalidFeeStatus(req.params.id, status);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getById, create, updateStatus };
