const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, "..", "uploads", "students");
        try {
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
                console.log(`Created upload directory: ${uploadDir}`);
            }
            console.log(`Uploading file to: ${uploadDir}`);
            cb(null, uploadDir);
        } catch (err) {
            cb(err);
        }
    },
    filename: function(req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        console.log(`Computed filename: ${uniqueName} for original: ${file.originalname}`);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    console.log(`fileFilter: mime=${file.mimetype} originalname=${file.originalname}`);

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const err = new Error("Only PNG, JPG, JPEG allowed");
        err.status = 400;
        cb(err);
    }
};

module.exports = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});