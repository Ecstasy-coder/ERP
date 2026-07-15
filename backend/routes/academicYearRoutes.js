const express = require("express");
const router = express.Router();

const academicYearController = require("../controllers/academicYearController");
const validateAcademicYear = require("../validations/academicYearValidation");

console.log("Academic Year Routes Loaded");

router.get("/", (req, res) => {
    console.log("GET Academic Years");
    academicYearController.getAcademicYears(req, res);
});

router.post("/", (req, res, next) => {
    console.log("POST Route Hit");
    next();
}, validateAcademicYear, academicYearController.createAcademicYear);

router.get("/:id", academicYearController.getAcademicYearById);

router.put("/:id",
    validateAcademicYear,
    academicYearController.updateAcademicYear
);

router.delete("/:id",
    academicYearController.deleteAcademicYear
);

router.put("/current/:id",
    academicYearController.setCurrentAcademicYear
);

module.exports = router;

