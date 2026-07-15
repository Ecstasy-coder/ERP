const express = require("express");

const router = express.Router();

const transportStudentController = require("../controllers/transportStudentController");

router.get("/by-route", transportStudentController.getTransportStudentsByRoute);

router.get("/", transportStudentController.getTransportStudents);

router.get("/:id", transportStudentController.getTransportStudentById);

router.post("/", transportStudentController.assignTransport);

router.put("/:id", transportStudentController.updateTransport);

router.delete("/:id", transportStudentController.deleteTransport);

module.exports = router;
