// const validateHoliday = (req, res, next) => {
//     const {
//         holiday_date,
//         description,
//         branch_id,
//         academic_year_id
//     } = req.body;

//     if (!holiday_date) {
//         return res.status(400).json({
//             success: false,
//             message: "Holiday date is required"
//         });
//     }

//     if (!description) {
//         return res.status(400).json({
//             success: false,
//             message: "Description is required"
//         });
//     }

//     if (!branch_id) {
//         return res.status(400).json({
//             success: false,
//             message: "Branch ID is required"
//         });
//     }

//     if (!academic_year_id) {
//         return res.status(400).json({
//             success: false,
//             message: "Academic Year ID is required"
//         });
//     }

//     next();
// };

// module.exports = validateHoliday;

// const validateHoliday = (req, res, next) => {
//     const {
//         holiday_date,
//         description
//     } = req.body;

//     if (!holiday_date) {
//         return res.status(400).json({
//             success: false,
//             message: "Holiday date is required"
//         });
//     }

//     if (!description) {
//         return res.status(400).json({
//             success: false,
//             message: "Description is required"
//         });
//     }

//     next();
// };

// module.exports = validateHoliday;



const validateHoliday = (req, res, next) => {

    next();
};

module.exports = validateHoliday;