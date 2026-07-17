const { getSchoolName, getPhotoDataUri, formatDob } = require("./idCardHelpers");

// ============================
// Card dimensions - standard vertical student ID card
// 54mm x 86mm (a common portrait ID card size)
// ============================
const CARD_WIDTH_MM = 54;
const CARD_HEIGHT_MM = 86;

// ============================
// Shared CSS for all cards
// ============================
function baseStyles() {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Arial, sans-serif;
        }

        .card {
            width: ${CARD_WIDTH_MM}mm;
            height: ${CARD_HEIGHT_MM}mm;
            border: 1px solid #d1d5db;
            border-radius: 10px;
            padding: 4mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            background: #ffffff;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .card .school-name {
            font-size: 11px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 3mm;
            line-height: 1.2;
        }

        .card .photo {
            width: 20mm;
            height: 20mm;
            border-radius: 50%;
            object-fit: cover;
            border: 1px solid #e5e7eb;
            margin-bottom: 2.5mm;
        }

        .card .student-name {
            font-size: 12px;
            font-weight: 700;
            color: #dc2626;
            margin-bottom: 2.5mm;
        }

        .card .details {
            width: 100%;
            font-size: 8.5px;
            color: #1f2937;
        }

        .card .details .row {
            display: flex;
            justify-content: space-between;
            padding: 0.6mm 0;
            border-bottom: 1px dashed #f3f4f6;
        }

        .card .details .label {
            font-weight: 600;
            color: #92400e;
        }

        .card .details .value {
            color: #1f2937;
            text-align: right;
        }

        .card .admission-no {
            margin-top: auto;
            font-size: 7.5px;
            color: #6b7280;
            letter-spacing: 0.5px;
        }
    `;
}

// ============================
// Single card markup
// ============================
function renderCard(student) {
    const schoolName = getSchoolName(student.branch);
    const photo = getPhotoDataUri(student.photo);
    const dob = formatDob(student.dob);

    return `
        <div class="card">
            <div class="school-name">${escapeHtml(schoolName)}</div>
            <img class="photo" src="${photo}" alt="Student Photo" />
            <div class="student-name">${escapeHtml(student.full_name || "-")}</div>
            <div class="details">
                <div class="row">
                    <span class="label">Class</span>
                    <span class="value">${escapeHtml(student.current_class || "-")}</span>
                </div>
                <div class="row">
                    <span class="label">Section</span>
                    <span class="value">${escapeHtml(student.current_section || "-")}</span>
                </div>
                <div class="row">
                    <span class="label">D.O.B</span>
                    <span class="value">${dob}</span>
                </div>
                <div class="row">
                    <span class="label">Father</span>
                    <span class="value">${escapeHtml(student.father_name || "-")}</span>
                </div>
            </div>
            <div class="admission-no">${escapeHtml(student.admission_no || "")}</div>
        </div>
    `;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// ============================
// PREVIEW / DOWNLOAD - single or few cards, one per page
// (used for "Download Selected ID Cards" preview + PDF)
// ============================
function buildCardsHTML(students) {
    const cardsMarkup = students.map(renderCard).join("\n");

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <style>
            ${baseStyles()}

            body {
                background: #f3f4f6;
                padding: 10mm;
            }

            .card-wrapper {
                display: flex;
                flex-wrap: wrap;
                gap: 6mm;
            }

            @page {
                size: ${CARD_WIDTH_MM}mm ${CARD_HEIGHT_MM}mm;
                margin: 0;
            }

            @media print {
                body { background: #fff; padding: 0; }
                .card { border-radius: 0; margin: 0; }
            }
        </style>
    </head>
    <body>
        <div class="card-wrapper">
            ${cardsMarkup}
        </div>
    </body>
    </html>
    `;
}

// ============================
// SHEET - many cards laid out on A4 for bulk printing
// (used for "Download All ID Cards")
// ============================
function buildSheetHTML(students) {
    const cardsMarkup = students.map(renderCard).join("\n");

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <style>
            ${baseStyles()}

            @page {
                size: A4;
                margin: 10mm;
            }

            body {
                display: flex;
                flex-wrap: wrap;
                gap: 6mm;
                align-content: flex-start;
            }
        </style>
    </head>
    <body>
        ${cardsMarkup}
    </body>
    </html>
    `;
}

module.exports = {
    buildCardsHTML,
    buildSheetHTML,
    CARD_WIDTH_MM,
    CARD_HEIGHT_MM
};