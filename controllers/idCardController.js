const pool = require("../config/db");
const puppeteer = require("puppeteer");
const {
    buildCardsHTML,
    buildSheetHTML,
    CARD_WIDTH_MM,
    CARD_HEIGHT_MM
} = require("../utils/idCardTemplate");
async function fetchStudents({ ids, branch, className, section }) {
    let query = `
        SELECT
            id,
            branch,
            admission_no,
            full_name,
            father_name,
            gender,
            current_class,
            current_section,
            dob,
            photo
        FROM students
        WHERE 1=1
    `;
    const values = [];
    let index = 1;

    if (ids && ids.length) {
        query += ` AND id = ANY($${index}::int[])`;
        values.push(ids);
        index++;
    }

    if (branch) {
        query += ` AND branch = $${index}`;
        values.push(branch);
        index++;
    }
    if (className) {
        query += ` AND current_class = $${index}`;
        values.push(className);
        index++;
    }
    if (section) {
        query += ` AND current_section = $${index}`;
        values.push(section);
        index++;
    }


    query += " ORDER BY id ASC";

    const result = await pool.query(query, values);
    return result.rows;
}

function parseIds(idsParam) {
    if (!idsParam) return [];
    return String(idsParam)
        .split(",")
        .map((v) => parseInt(v.trim(), 10))
        .filter((v) => !isNaN(v));
}

exports.previewCards = async(req, res) => {
    try {
        const ids = parseIds(req.query.ids);
        const { branch, className, section } = req.query;

        if (!ids.length && !branch && !className && !section) {
            return res.status(400).json({
                success: false,
                message: "Provide ids, or branch/class/section filters"
            });
        }

        const students = await fetchStudents({ ids, branch, className, section });

        if (!students.length) {
            return res.status(404).json({
                success: false,
                message: "No students found for preview"
            });
        }


        const html = ids.length ?
            buildCardsHTML(students) :
            buildSheetHTML(students);

        res.set("Content-Type", "text/html");
        res.send(html);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.downloadCards = async(req, res) => {
    let browser;

    try {
        const ids = parseIds(req.query.ids);
        const { branch, className, section } = req.query;
        const format = req.query.format || (ids.length ? "card" : "sheet");

        if (!ids.length && !branch && !className && !section) {
            return res.status(400).json({
                success: false,
                message: "Provide ids, or branch/class/section filters"
            });
        }

        const students = await fetchStudents({ ids, branch, className, section });

        if (!students.length) {
            return res.status(404).json({
                success: false,
                message: "No students found"
            });
        }

        const html = format === "sheet" ?
            buildSheetHTML(students) :
            buildCardsHTML(students);

        browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfOptions = format === "sheet" ? { format: "A4", printBackground: true, margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" } } : {
            width: `${CARD_WIDTH_MM}mm`,
            height: `${CARD_HEIGHT_MM}mm`,
            printBackground: true,
            margin: { top: 0, bottom: 0, left: 0, right: 0 }
        };

        const pdfBuffer = await page.pdf(pdfOptions);

        await browser.close();

        const filename = students.length === 1 ?
            `id-card-${students[0].admission_no || students[0].id}.pdf` :
            `id-cards-${Date.now()}.pdf`;

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`
        });

        res.send(pdfBuffer);

    } catch (error) {
        if (browser) await browser.close();
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};