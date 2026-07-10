const pool = require("../config/db");

// Add Participant
exports.addParticipant = async (participant) => {

    const query = `
        INSERT INTO meeting_participants
        (
            meeting_id,
            employee_id,
            student_id,
            class_id,
            participant_type
        )
        VALUES
        (
            $1,$2,$3,$4,$5
        )
        RETURNING *;
    `;

    const values = [
        participant.meetingId,
        participant.employeeId,
        participant.studentId,
        participant.classId,
        participant.participantType
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

// Get Participants
exports.getParticipants = async (meetingId) => {

    const query = `
        SELECT *
        FROM meeting_participants
        WHERE meeting_id = $1
        ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [meetingId]);

    return result.rows;
};

// Delete Participant
exports.deleteParticipant = async (id) => {

    const query = `
        DELETE FROM meeting_participants
        WHERE id = $1
        RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};