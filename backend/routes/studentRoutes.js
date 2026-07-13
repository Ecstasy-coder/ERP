const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const studentController = require("../controllers/studentController");

router.post(

    "/",

    upload.single("photo"),

    studentController.createStudent

);

router.get("/", studentController.getStudents);

router.get("/:id", studentController.getStudentById);

router.put(

    "/:id",

    upload.single("photo"),

    studentController.updateStudent

);

router.delete("/:id", studentController.deleteStudent);

router.get("/search/sibling", studentController.searchSibling);

module.exports = router;