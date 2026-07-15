// const FeeStructure = require("../models/feeStructureModel");


// // ===========================================
// // Get Fee Structure
// // ===========================================
// const getFeeStructure = async (branch_id, academic_year_id, class_id) => {

//     return await FeeStructure.getFeeStructure(
//         branch_id,
//         academic_year_id,
//         class_id
//     );

// };


// // ===========================================
// // Create Fee Structure
// // ===========================================
// const createFeeStructure = async (data) => {

//     return await FeeStructure.createFeeStructure(data);

// };


// // ===========================================
// // Update Fee Structure
// // ===========================================
// const updateFeeStructure = async (id, fee_amount) => {

//     return await FeeStructure.updateFeeStructure(
//         id,
//         fee_amount
//     );

// };


// // ===========================================
// // Delete Fee Structure
// // ===========================================
// const deleteFeeStructure = async (id) => {

//     return await FeeStructure.deleteFeeStructure(id);

// };


// // ===========================================
// // Get Total Fee
// // ===========================================
// const getTotalFee = async (
//     branch_id,
//     academic_year_id,
//     class_id
// ) => {

//     return await FeeStructure.getTotalFee(
//         branch_id,
//         academic_year_id,
//         class_id
//     );

// };


// module.exports = {

//     getFeeStructure,

//     createFeeStructure,

//     updateFeeStructure,

//     deleteFeeStructure,

//     getTotalFee

// };

const FeeStructure = require("../models/feeStructureModel");


// ===========================================
// Get All Fee Structures
// ===========================================
const getFeeStructure = async () => {

    return await FeeStructure.getFeeStructure();

};


// ===========================================
// Get Fee Structure By ID
// ===========================================
const getFeeStructureById = async (id) => {

    return await FeeStructure.getFeeStructureById(id);

};


// ===========================================
// Create Fee Structure
// ===========================================
const createFeeStructure = async (data) => {

    return await FeeStructure.createFeeStructure(data);

};


// ===========================================
// Update Fee Structure
// ===========================================
const updateFeeStructure = async (id, fee_amount) => {

    return await FeeStructure.updateFeeStructure(
        id,
        fee_amount
    );

};


// ===========================================
// Delete Fee Structure
// ===========================================
const deleteFeeStructure = async (id) => {

    return await FeeStructure.deleteFeeStructure(id);

};


// ===========================================
// Get Total Fee
// ===========================================
const getTotalFee = async (
    branch_id,
    academic_year_id,
    class_id
) => {

    return await FeeStructure.getTotalFee(
        branch_id,
        academic_year_id,
        class_id
    );

};


module.exports = {

    getFeeStructure,

    getFeeStructureById,

    createFeeStructure,

    updateFeeStructure,

    deleteFeeStructure,

    getTotalFee

};