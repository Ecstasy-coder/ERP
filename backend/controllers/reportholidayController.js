// const reportHolidayService = require("../services/reportholidayService");

// const getHolidayReport = async (req, res) => {

//     try {

//         const holidays = await reportHolidayService.getHolidayReport();

//         res.status(200).json({
//             success: true,
//             data: holidays
//         });

//     } catch (error) {

//         console.log(error);

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });

//     }

// };

// module.exports = {
//     getHolidayReport
// };
const reportHolidayService = require("../services/reportholidayService");

const getHolidayReport = async (req, res) => {

    try {

        const holidays = await reportHolidayService.getHolidayReport();

    

        res.status(200).json({
            success: true,
            data: holidays
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getHolidayReport
};