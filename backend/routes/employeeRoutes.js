const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const employeeController = require("../controllers/employeeController");

router.post(
    "/",
    upload.single("photo"),
    employeeController.createEmployee
);

router.get(
    "/",
    employeeController.getEmployees
);

router.get(
    "/attenders",
    employeeController.getAttenders
);

router.get(
    "/:id",
    employeeController.getEmployeeById
);

router.put(
    "/:id",
    upload.single("photo"),
    employeeController.updateEmployee
);

router.delete(
    "/:id",
    employeeController.deleteEmployee
);

module.exports = router;