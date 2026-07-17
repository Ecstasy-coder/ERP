const pool = require("../config/db");

// ====================================================
// Helper: extract sibling student IDs from sibling_details
// Confirmed real shape:
// [{ "grade": "Grade 3", "studentId": 2, "studentName": "Rahul" }]
// Also defensively handles plain IDs / alternate key names,
// in case older or future records differ slightly.
// ====================================================
function extractSiblingRefs(siblingDetails) {

    let arr = siblingDetails;

    if (!arr) return [];

    if (typeof arr === "string") {
        try {
            arr = JSON.parse(arr);
        } catch {
            return [];
        }
    }

    if (!Array.isArray(arr)) return [];

    return arr
        .map(item => {

            if (typeof item === "number") {
                return { id: item, snapshotName: null, snapshotGrade: null };
            }

            if (typeof item === "string" && !isNaN(item)) {
                return { id: Number(item), snapshotName: null, snapshotGrade: null };
            }

            if (item && typeof item === "object") {

                const id =
                    item.studentId ||
                    item.student_id ||
                    item.id ||
                    item.sibling_id ||
                    null;

                if (!id) return null;

                return {
                    id,
                    snapshotName: item.studentName || item.name || null,
                    snapshotGrade: item.grade || item.class || null
                };

            }

            return null;

        })
        .filter(ref => ref !== null);
}

// ====================================================
// Get All Student Siblings (with filters)
// ====================================================
exports.getAllSiblings = async (req, res) => {

    try {

        let {
            branch = "",
            status = "active", // active | inactive | all
            search = ""
        } = req.query;

        let query = `
            SELECT
                id,
                admission_no,
                full_name,
                father_name,
                gender,
                current_class,
                current_section,
                primary_mobile,
                is_active,
                branch,
                sibling_details
            FROM students
            WHERE sibling_details IS NOT NULL
            AND jsonb_typeof(sibling_details) = 'array'
            AND jsonb_array_length(sibling_details) > 0
        `;

        const values = [];
        let index = 1;

        if (branch) {
            query += ` AND branch = $${index}`;
            values.push(branch);
            index++;
        }

        if (status === "active") {
            query += ` AND is_active = true`;
        } else if (status === "inactive") {
            query += ` AND is_active = false`;
        }
        // status === "all" -> no filter added

        if (search) {
            query += `
                AND (
                    LOWER(full_name) LIKE LOWER($${index})
                    OR LOWER(admission_no) LIKE LOWER($${index})
                )
            `;
            values.push(`%${search}%`);
            index++;
        }

        query += ` ORDER BY admission_no`;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(200).json({
                success: true,
                total: 0,
                data: []
            });
        }

        // Collect every sibling id referenced across all matched students
        const allSiblingIds = new Set();

        const studentsWithRefs = result.rows.map(student => {

            const siblingRefs = extractSiblingRefs(student.sibling_details);

            siblingRefs.forEach(ref => allSiblingIds.add(ref.id));

            return { ...student, siblingRefs };

        });

        // Fetch live current data for all referenced siblings in one query
        let siblingsMap = {};

        if (allSiblingIds.size > 0) {

            const siblingResult = await pool.query(
                `
                SELECT
                    id,
                    admission_no,
                    full_name,
                    gender,
                    current_class,
                    current_section,
                    is_active,
                    branch
                FROM students
                WHERE id = ANY($1::int[])
                `,
                [Array.from(allSiblingIds)]
            );

            siblingResult.rows.forEach(row => {
                siblingsMap[row.id] = row;
            });

        }

        // Build final flattened output — one row per student per sibling
        const data = [];

        studentsWithRefs.forEach(student => {

            const { siblingRefs, sibling_details, ...studentBase } = student;

            if (siblingRefs.length === 0) return;

            siblingRefs.forEach(ref => {

                const live = siblingsMap[ref.id];

                // Prefer live data (current, accurate); fall back to the
                // stored snapshot only if the sibling record no longer exists
                const siblingData = live
                    ? {
                        id: live.id,
                        admission_no: live.admission_no,
                        name: live.full_name,
                        gender: live.gender,
                        class:
                            live.current_class +
                            (live.current_section
                                ? " - " + live.current_section
                                : ""),
                        active: live.is_active,
                        branch: live.branch
                    }
                    : {
                        id: ref.id,
                        admission_no: null,
                        name: ref.snapshotName,
                        gender: null,
                        class: ref.snapshotGrade,
                        active: null,
                        branch: null,
                        note: "Sibling record no longer exists (showing saved snapshot)"
                    };

                data.push({
                    admission_no: studentBase.admission_no,
                    full_name: studentBase.full_name,
                    father_name: studentBase.father_name,
                    gender: studentBase.gender,
                    current_class:
                        studentBase.current_class +
                        (studentBase.current_section
                            ? " - " + studentBase.current_section
                            : ""),
                    primary_mobile: studentBase.primary_mobile,
                    is_active: studentBase.is_active,
                    branch: studentBase.branch,

                    sibling: siblingData
                });

            });

        });

        res.status(200).json({

            success: true,

            total: data.length,

            data

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};