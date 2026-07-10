const pool = require("../config/db");

// Create Meeting
exports.createMeeting = async (meeting) => {

    const query = `
        INSERT INTO meetings (
            title,
            description,
            meeting_date,
            start_time,
            end_time,
            meeting_type,
            location,
            meeting_link,
            organizer,
            status,
            branch_id,
            audience_type,
            created_by
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
        )
        RETURNING *;
    `;

    const values = [
        meeting.title,
        meeting.description,
        meeting.meetingDate,
        meeting.startTime,
        meeting.endTime,
        meeting.meetingType,
        meeting.location,
        meeting.meetingLink,
        meeting.organizer,
        "ACTIVE",
        meeting.branchId,
        meeting.audienceType,
        meeting.createdBy
    ];

    const result = await pool.query(query, values);

    return result.rows[0];

};

// Get All Meetings
exports.getAllMeetings = async () => {

    const query = `
        SELECT *
        FROM meetings
        ORDER BY meeting_date DESC,
                 start_time DESC;
    `;

    const result = await pool.query(query);

    return result.rows;

};

// Get Meeting By ID
exports.getMeetingById = async (id) => {

    const query = `
        SELECT *
        FROM meetings
        WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];

};

// Update Meeting
exports.updateMeeting = async (id, meeting) => {

    const query = `
        UPDATE meetings
        SET
            title = $1,
            description = $2,
            meeting_date = $3,
            start_time = $4,
            end_time = $5,
            meeting_type = $6,
            location = $7,
            meeting_link = $8,
            organizer = $9,
            status = $10,
            branch_id = $11,
            audience_type = $12,
            created_by = $13
        WHERE id = $14
        RETURNING *;
    `;

    const values = [
        meeting.title,
        meeting.description,
        meeting.meetingDate,
        meeting.startTime,
        meeting.endTime,
        meeting.meetingType,
        meeting.location,
        meeting.meetingLink,
        meeting.organizer,
        meeting.status,
        meeting.branchId,
        meeting.audienceType,
        meeting.createdBy,
        id
    ];

    const result = await pool.query(query, values);

    return result.rows[0];

};

// Cancel Meeting
exports.cancelMeeting = async (id) => {

    const query = `
        UPDATE meetings
        SET status = 'CANCELLED'
        WHERE id = $1
        RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];

};

// Delete Meeting
exports.deleteMeeting = async (id) => {

    const query = `
        DELETE FROM meetings
        WHERE id = $1
        RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];

};