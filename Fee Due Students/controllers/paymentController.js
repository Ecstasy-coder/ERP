const paymentModel = require("../models/paymentModel");


// ======================================
// Create Payment
// ======================================

const createPayment = async (req, res) => {

    try {

        const {

            student_id,
            term_id,
            amount

        } = req.body;

        if (!student_id || !term_id || !amount) {

            return res.status(400).json({

                success: false,

                message: "Student, Term and Amount are required."

            });

        }

        const payment = await paymentModel.createPayment(

            student_id,
            term_id,
            amount

        );

        res.status(201).json({

            success: true,

            message: "Payment created successfully.",

            data: payment

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ======================================
// Generate Payment Link
// ======================================

const generatePaymentLink = async (req, res) => {

    try {

        const payment = await paymentModel.generatePaymentLink(

            req.params.paymentId

        );

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Payment link generated successfully.",

            data: payment

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ======================================
// View Payment Page
// ======================================

const getPaymentById = async (req, res) => {

    try {

        const payment = await paymentModel.getPaymentById(

            req.params.paymentId

        );

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }

        res.status(200).json({

            success: true,

            data: payment

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ======================================
// Complete Payment
// ======================================

const completePayment = async (req, res) => {

    try {

        const payment = await paymentModel.completePayment(

            req.params.paymentId

        );

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Payment completed successfully.",

            data: payment

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ======================================
// Payment History
// ======================================

const getAllPayments = async (req, res) => {

    try {

        const payments = await paymentModel.getAllPayments();

        res.status(200).json({

            success: true,

            count: payments.length,

            data: payments

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


module.exports = {

    createPayment,

    generatePaymentLink,

    getPaymentById,

    completePayment,

    getAllPayments

};