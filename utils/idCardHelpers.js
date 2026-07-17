const fs = require("fs");
const path = require("path");

// ============================
// Branch code -> Display name
// Extend this as you add branches.
// (Matches the dropdown in your "Student ID Cards" screen)
// ============================
const SCHOOL_NAMES = {
    ECS001: "Ecstasy School 1",
    ECS002: "Ecstasy School 2",
    // add more branch codes here
};

function getSchoolName(branchCode) {
    return SCHOOL_NAMES[branchCode] || branchCode || "School";
}

// ============================
// Default placeholder avatar (used when photo is missing/unreadable)
// Small inline SVG data URI - no external file dependency
// ============================
const DEFAULT_AVATAR =
    "data:image/svg+xml;base64," +
    Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <rect width="120" height="120" fill="#e5e7eb"/>
            <circle cx="60" cy="45" r="22" fill="#9ca3af"/>
            <path d="M20 105c0-22 18-38 40-38s40 16 40 38" fill="#9ca3af"/>
        </svg>`
    ).toString("base64");

// ============================
// Convert stored photo path to a base64 data URI so Puppeteer
// can render it reliably (no network/static-serving dependency).
// Assumes req.file.path saved something like "uploads/1234-photo.jpg"
// Adjust UPLOAD_ROOT if your multer destination differs.
// ============================
const UPLOAD_ROOT = path.join(__dirname, "..", ".."); // project root, adjust if needed

function getPhotoDataUri(photoPath) {
    if (!photoPath) return DEFAULT_AVATAR;

    try {
        const absolutePath = path.isAbsolute(photoPath)
            ? photoPath
            : path.join(UPLOAD_ROOT, photoPath);

        if (!fs.existsSync(absolutePath)) return DEFAULT_AVATAR;

        const ext = path.extname(absolutePath).slice(1).toLowerCase() || "jpeg";
        const mime = ext === "jpg" ? "jpeg" : ext;
        const fileBuffer = fs.readFileSync(absolutePath);

        return `data:image/${mime};base64,${fileBuffer.toString("base64")}`;
    } catch (err) {
        console.error("Photo read failed:", err.message);
        return DEFAULT_AVATAR;
    }
}

// ============================
// Format DOB as d/m/yyyy (matches "14/6/2026" in your mock)
// ============================
function formatDob(dob) {
    if (!dob) return "-";
    const d = new Date(dob);
    if (isNaN(d)) return "-";
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

module.exports = {
    getSchoolName,
    getPhotoDataUri,
    formatDob
};