const feeModel = require('../models/studentfeeModel');

exports.getTerms = async(req, res) => {
    try {
        const studentId = req.params.studentId;
        const data = await feeModel.getStudentTerms(studentId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReceiptNo = async(req, res) => {
    try {
        const receipt = await feeModel.generateReceiptNo();
        res.json({ receipt_number: receipt });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTerm = async(req, res) => {
    try {
        const termFeeId = req.params.termFeeId;
        const data = await feeModel.updateTerm(termFeeId, req.body);
        res.json({
            message: 'Term updated successfully',
            data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};