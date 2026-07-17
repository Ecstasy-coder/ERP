const TermFee = require("../models/termFeeModel");


// ===========================================
// Get All Term Fees
// ===========================================
const getTermFees = async() => {

    return await TermFee.getTermFees();

};


// ===========================================
// Get Term Fee By ID
// ===========================================
const getTermFeeById = async(id) => {

    return await TermFee.getTermFeeById(id);

};


// ===========================================
// Create Term Fee
// ===========================================
const createTermFee = async(data) => {

    return await TermFee.createTermFee(data);

};


// ===========================================
// Update Term Fee
// ===========================================
const updateTermFee = async(id, data) => {

    return await TermFee.updateTermFee(id, data);

};


// ===========================================
// Delete Term Fee
// ===========================================
const deleteTermFee = async(id) => {

    return await TermFee.deleteTermFee(id);

};


module.exports = {

    getTermFees,

    getTermFeeById,

    createTermFee,

    updateTermFee,

    deleteTermFee

};