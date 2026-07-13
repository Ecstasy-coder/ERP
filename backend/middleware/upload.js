const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        if (req.originalUrl.includes("/students")) {

            cb(null, "uploads/students");

        } else if (req.originalUrl.includes("/employees")) {

            cb(null, "uploads/employees");

        } else if (req.originalUrl.includes("/attenders")) {

            cb(null, "uploads/attenders");

        } else {

            return cb(new Error("Invalid upload route. Uploads are allowed only for Students, Employees, and Attenders."));

        }

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

const fileFilter = (req, file, cb) => {

    const allowed = [
        "image/png",
        "image/jpeg",
        "image/jpg"
    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Only PNG, JPG and JPEG files are allowed."), false);

    }

};

module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024 // 5 MB

    }

});