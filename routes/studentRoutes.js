const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const studentController = require("../controllers/studentController");

router.post(
    "/",
    (req, res, next) => {
        console.log('Create student request content-type:', req.headers['content-type']);
        upload.single("photo")(req, res, function(err) {
            if (err) {
                console.error('Multer error on create:', err);
                return res.status(err.status || 400).json({ success: false, message: err.message });
            }
            console.log('After multer (create) req.file:', req.file, 'req.body keys:', Object.keys(req.body));
            next();
        });
    },
    studentController.createStudent
);

router.get("/", studentController.getStudents);

router.get("/:id", studentController.getStudentById);

router.put(
    "/:id",
    (req, res, next) => {
        console.log('Update student request content-type:', req.headers['content-type']);
        upload.single("photo")(req, res, function(err) {
            if (err) {
                console.error('Multer error on update:', err);
                return res.status(err.status || 400).json({ success: false, message: err.message });
            }
            console.log('After multer (update) req.file:', req.file, 'req.body keys:', Object.keys(req.body));
            next();
        });
    },
    studentController.updateStudent
);

router.delete("/:id", studentController.deleteStudent);

router.get("/search/sibling", studentController.searchSibling);

module.exports = router;