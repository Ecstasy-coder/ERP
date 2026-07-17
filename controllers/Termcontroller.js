const termModel = require('../models/termModel');

/**
 * GET /api/students/:studentId/terms
 * Used for the summary table (Term | Fee Amount | Due Date | Term Paid Amount |
 * Balance Amount | Paid Date | Pay Type | Transaction # | Receipt)
 */
exports.getAllTerms = async(req, res) => {
    try {
        const { studentId } = req.params;

        const terms = await termModel.getAllTerms(studentId);

        if (!terms || terms.length === 0) {
            return res.status(404).json({ success: false, message: 'No terms found for this student' });
        }

        const studentName = terms[0].full_name;
        const subtotal = terms[0].subtotal_amount || 0;
        const totalPaid = terms.reduce((sum, t) => sum + Number(t.paid_amount || 0), 0);
        const totalBalance = terms.reduce((sum, t) => sum + Number(t.balance_amount || 0), 0);

        // Update student_fee_details with totalPaid and calculated fee_balance
        await termModel.updateStudentFeeDetails(studentId, totalPaid, subtotal);

        return res.status(200).json({
            success: true,
            data: {
                studentId,
                studentName,
                subtotal,
                summary: {
                    totalPaid,
                    totalBalance
                },
                terms: terms.map(t => ({
                    term: t.term_name,
                    feeAmount: Number(t.term_amount),
                    dueDate: t.due_date,
                    termPaidAmount: Number(t.paid_amount),
                    balanceAmount: Number(t.balance_amount),
                    paidDate: t.paid_date,
                    payType: t.payment_type,
                    transactionNumber: t.transaction_number,
                    receipt: t.receipt_number
                }))
            },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/students/:studentId/terms/:termNumber
 * Used to prefill a single term's "Pay Transport Fee / Edit Payment" form:
 * Due Date, Term Amount, Paid Amount, Balance Amount, Paid Date,
 * Payment Type, Transaction Number, Receipt Number.
 */
exports.getTermByNumber = async(req, res) => {
    try {
        const { studentId, termNumber } = req.params;

        const term = await termModel.getTermByNumber(studentId, termNumber);

        if (!term) {
            return res.status(404).json({ success: false, message: 'Term not found' });
        }

        // Get all terms to calculate subtotal and totalPaid
        const allTerms = await termModel.getAllTerms(studentId);
        const subtotal = allTerms && allTerms.length > 0 ? allTerms[0].subtotal_amount || 0 : 0;
        const totalPaid = allTerms && allTerms.length > 0 ?
            allTerms.reduce((sum, t) => sum + Number(t.paid_amount || 0), 0) :
            0;
        const totalBalance = allTerms && allTerms.length > 0 ?
            allTerms.reduce((sum, t) => sum + Number(t.balance_amount || 0), 0) :
            0;

        return res.status(200).json({
            success: true,
            data: {
                studentName: term.full_name,
                subtotal,
                summary: {
                    totalPaid,
                    totalBalance
                },
                term: {
                    termName: term.term_name,
                    feeAmount: Number(term.term_amount),
                    dueDate: term.due_date,
                    paidAmount: Number(term.paid_amount),
                    balanceAmount: Number(term.balance_amount),
                    paidDate: term.paid_date,
                    paymentType: term.payment_type,
                    transactionNumber: term.transaction_number,
                    receiptNumber: term.receipt_number
                }
            }
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * PUT /api/students/:studentId/terms/:termNumber
 * Handles the "Pay Transport Fee / Edit Payment" form submit for one term.
 * Body: { paid_amount, paid_date, payment_type, transaction_number, receipt_number }
 */
exports.updateTerm = async(req, res) => {
    try {
        const { studentId, termNumber } = req.params;
        const { paid_amount, paid_date, payment_type, transaction_number, receipt_number } = req.body;

        if (paid_amount === undefined || isNaN(Number(paid_amount))) {
            return res.status(400).json({ success: false, message: 'paid_amount is required and must be a number' });
        }

        const term = await termModel.getTermByNumber(studentId, termNumber);
        if (!term) {
            return res.status(404).json({ success: false, message: 'Term not found' });
        }

        if (Number(paid_amount) > Number(term.term_amount)) {
            return res.status(400).json({ success: false, message: 'Paid amount cannot exceed the term amount' });
        }

        const balance = Number(term.term_amount) - Number(paid_amount);

        const updated = await termModel.updateTerm(studentId, termNumber, {
            paid_amount: Number(paid_amount),
            balance_amount: balance,
            paid_date,
            payment_type,
            transaction_number,
            receipt_number
        });

        return res.status(200).json({
            success: true,
            message: 'Term payment updated successfully',
            data: updated
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/payment-types
 * Populates the "Payment Type" dropdown from the payment_types table.
 */
exports.getPaymentTypes = async(req, res) => {
    try {
        const paymentTypes = await termModel.getPaymentTypes();
        return res.status(200).json({ success: true, data: paymentTypes });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/students/:studentId/diagnostic
 * Check what data exists for a student
 */
exports.getDiagnostic = async(req, res) => {
    try {
        const { studentId } = req.params;
        const info = await termModel.getDiagnosticInfo(studentId);
        return res.status(200).json({ success: true, data: info });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/students/:studentId/available-terms
 * Get list of available terms for a student
 */
exports.getAvailableTerms = async(req, res) => {
    try {
        const { studentId } = req.params;
        const availableTerms = await termModel.getAvailableTerms(studentId);

        if (availableTerms.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No terms found for student ${studentId}. Please create terms first.`
            });
        }

        return res.status(200).json({
            success: true,
            studentId,
            availableTerms: availableTerms.map(t => t.term_name),
            message: `Found ${availableTerms.length} term(s) for this student`
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * PUT /api/students/:studentId/diagnostic
 * Update payment details for a student term
 * Body: { termName, paid_amount, paid_date, payment_type, transaction_number, receipt_number }
 */
exports.updateDiagnostic = async(req, res) => {
    try {
        const { studentId } = req.params;
        const { termName, paid_amount, paid_date, payment_type, transaction_number, receipt_number } = req.body;

        // Validate required fields
        if (!termName) {
            return res.status(400).json({
                success: false,
                message: 'termName is required (e.g., "Term 1", "Term 2", "Term 3")'
            });
        }

        if (paid_amount === undefined || isNaN(Number(paid_amount))) {
            return res.status(400).json({
                success: false,
                message: 'paid_amount is required and must be a number'
            });
        }

        try {
            await termModel.ensureTermsForStudent(studentId, [{ termName, termAmount: Number(termName.match(/\d+/) ? termName.match(/\d+/)[0] || 0 : 0) }]);
        } catch (err) {
            return res.status(404).json({
                success: false,
                message: err.message
            });
        }

        // Get the term to validate it exists and calculate balance
        const term = await termModel.getTermByName(studentId, termName);
        if (!term) {
            return res.status(404).json({
                success: false,
                message: `Term "${termName}" not found for this student`
            });
        }

        // Validate paid_amount doesn't exceed term amount
        if (Number(paid_amount) > Number(term.term_amount)) {
            return res.status(400).json({
                success: false,
                message: 'Paid amount cannot exceed the term amount'
            });
        }

        // Calculate balance
        const balance = Number(term.term_amount) - Number(paid_amount);

        // Update the term
        const updated = await termModel.updateTerm(studentId, termName, {
            paid_amount: Number(paid_amount),
            balance_amount: balance,
            paid_date,
            payment_type,
            transaction_number,
            receipt_number
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Failed to update term'
            });
        }

        // Format response with all 9 details from your table
        return res.status(200).json({
            success: true,
            message: 'Payment details updated successfully',
            data: {
                termName: updated.term_name,
                dueDate: updated.due_date,
                paidDate: updated.paid_date,
                termAmount: Number(updated.term_amount),
                paidAmount: Number(updated.paid_amount),
                balanceAmount: Number(updated.balance_amount),
                paymentType: updated.payment_type,
                transactionNumber: updated.transaction_number,
                receiptNumber: updated.receipt_number
            }
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * PUT /api/students/:studentId/diagnostic/batch
 * Update all three terms at once for a student
 * Body: { terms: [ { termName, dueDate, termAmount, paid_amount, paid_date, payment_type, transaction_number, receipt_number }, ... ] }
 */
exports.updateAllTerms = async(req, res) => {
    try {
        const { studentId } = req.params;
        const payload = req.body;
        const terms = Array.isArray(payload) ? payload : payload.terms;

        // Validate terms array
        if (!Array.isArray(terms) || terms.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'terms must be a non-empty array'
            });
        }

        // Validate each term has required fields
        for (let term of terms) {
            if (!term.termName) {
                return res.status(400).json({
                    success: false,
                    message: 'Each term must have: termName, dueDate, termAmount, paid_amount, paid_date, payment_type, transaction_number, receipt_number'
                });
            }

            if (!term.dueDate) {
                return res.status(400).json({
                    success: false,
                    message: `dueDate for ${term.termName} is required (e.g., "2026-07-15")`
                });
            }

            if (term.termAmount === undefined || isNaN(Number(term.termAmount))) {
                return res.status(400).json({
                    success: false,
                    message: `termAmount for ${term.termName} is required and must be a number`
                });
            }

            if (term.paid_amount === undefined || isNaN(Number(term.paid_amount))) {
                return res.status(400).json({
                    success: false,
                    message: `paid_amount for ${term.termName} is required and must be a number`
                });
            }

            if (!term.paid_date) {
                return res.status(400).json({
                    success: false,
                    message: `paid_date for ${term.termName} is required (e.g., "2026-07-15")`
                });
            }

            if (!term.payment_type) {
                return res.status(400).json({
                    success: false,
                    message: `payment_type for ${term.termName} is required (e.g., "Cash")`
                });
            }

            if (term.transaction_number === undefined) {
                return res.status(400).json({
                    success: false,
                    message: `transaction_number for ${term.termName} is required`
                });
            }

            if (term.receipt_number === undefined) {
                return res.status(400).json({
                    success: false,
                    message: `receipt_number for ${term.termName} is required`
                });
            }
        }

        const updatedTerms = [];
        const errors = [];

        try {
            await termModel.ensureTermsForStudent(studentId, terms);
        } catch (err) {
            return res.status(404).json({
                success: false,
                message: err.message,
                diagnostics: {
                    studentId,
                    termsFound: 0,
                    availableTerms: [],
                    instruction: 'Please add fee details for this student before updating payments'
                },
                errors: [err.message]
            });
        }

        // Get available terms after ensuring they exist
        const availableTerms = await termModel.getAvailableTerms(studentId);
        const availableTermNames = availableTerms.map(t => t.term_name);

        // If no terms exist at all, provide helpful error
        if (availableTermNames.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Student ID ${studentId} has no terms created yet`,
                diagnostics: {
                    studentId,
                    termsFound: 0,
                    availableTerms: [],
                    instruction: 'Please create fee terms for this student first before updating payments'
                },
                errors: ['No terms found for this student']
            });
        }

        // Update each term
        for (let term of terms) {
            try {
                // Get the existing term to validate it exists
                const existingTerm = await termModel.getTermByName(studentId, term.termName);
                if (!existingTerm) {
                    errors.push(`${term.termName} not found. Available terms: ${availableTermNames.join(', ')}`);
                    continue;
                }

                // Use provided termAmount or existing termAmount
                const termAmount = term.termAmount !== undefined ? Number(term.termAmount) : Number(existingTerm.term_amount);
                const paidAmount = Number(term.paid_amount);

                // Validate paid_amount doesn't exceed term amount
                if (paidAmount > termAmount) {
                    errors.push(`Paid amount for ${term.termName} (${paidAmount}) cannot exceed term amount (${termAmount})`);
                    continue;
                }

                // Calculate balance
                const balance = termAmount - paidAmount;

                // Update the term with all 9 fields
                const updated = await termModel.updateTerm(studentId, term.termName, {
                    due_date: term.dueDate || null,
                    term_amount: termAmount,
                    paid_amount: paidAmount,
                    balance_amount: balance,
                    paid_date: term.paid_date || null,
                    payment_type: term.payment_type,
                    transaction_number: term.transaction_number,
                    receipt_number: term.receipt_number
                });

                if (updated) {
                    updatedTerms.push({
                        term: updated.term_name,
                        feeAmount: Number(updated.term_amount),
                        dueDate: updated.due_date,
                        termPaidAmount: Number(updated.paid_amount),
                        balanceAmount: Number(updated.balance_amount),
                        paidDate: updated.paid_date,
                        payType: updated.payment_type,
                        transactionNumber: updated.transaction_number,
                        receipt: updated.receipt_number
                    });
                }
            } catch (err) {
                errors.push(`Error updating ${term.termName}: ${err.message}`);
            }
        }

        if (updatedTerms.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No terms were updated',
                diagnostics: {
                    studentId,
                    termsRequested: terms.map(t => t.termName),
                    termsAvailable: availableTermNames,
                    instruction: `Use exact term names from available list. Available: ${availableTermNames.join(', ')}`
                },
                errors
            });
        }

        // Calculate subtotal and totals
        const subtotal = updatedTerms.reduce((sum, term) => sum + term.termAmount, 0);
        const totalPaid = updatedTerms.reduce((sum, term) => sum + term.paidAmount, 0);
        const totalBalance = updatedTerms.reduce((sum, term) => sum + term.balanceAmount, 0);

        return res.status(200).json({
            success: true,
            message: `Successfully updated ${updatedTerms.length} term(s)`,
            summary: {
                subtotal: subtotal,
                totalPaid: totalPaid,
                totalBalance: totalBalance
            },
            data: updatedTerms,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};