const meetingModel = require('../modles/meetingModel');

const createMeeting = async (req, res, next) => {
  try {
    const {
      title,
      description,
      start_datetime,
      end_datetime,
      required_people_type,
    } = req.body;

    if (!title || !start_datetime || !end_datetime) {
      return res.status(400).json({ error: 'title, start_datetime, and end_datetime are required' });
    }

    const [startDate, startTime] = start_datetime.split('T');
    const [endDate, endTime] = end_datetime.split('T');

    if (!startDate || !startTime || !endDate || !endTime) {
      return res.status(400).json({ error: 'Invalid date/time format' });
    }

    const meeting = await meetingModel.createMeeting({
      title,
      description,
      meeting_date: startDate,
      start_time: startTime,
      end_time: endTime,
      meeting_type: required_people_type || 'general',
    });

    res.status(201).json(meeting);
  } catch (error) {
    next(error);
  }
};

const getMeetings = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const meetings = await meetingModel.getMeetings({ start, end });
    res.json(meetings);
  } catch (error) {
    next(error);
  }
};

const getMeetingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const meeting = await meetingModel.getMeetingById(id);
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    res.json(meeting);
  } catch (error) {
    next(error);
  }
};

const updateMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const meeting = await meetingModel.updateMeeting(id, req.body);
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    res.json(meeting);
  } catch (error) {
    next(error);
  }
};

const deleteMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await meetingModel.deleteMeeting(id);
    if (!deleted) return res.status(404).json({ error: 'Meeting not found' });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
};
