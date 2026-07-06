const express = require('express');
const cors = require('cors');
require('dotenv').config();

const meetingRoutes = require('./routes/meetingRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/public'));

const branches = [
  { id: 1, name: 'Ecstasy School 1 (ECS001)' },
  { id: 2, name: 'Ecstasy School 2 (ECS002)' },
  { id: 3, name: 'North Campus' },
];

const classes = ['All', 'Class 1', 'Class 2', 'Class 3', 'Class 4'];
const sections = ['All', 'A', 'B', 'C'];

app.use('/api/meetings', meetingRoutes);

app.get('/meetings/calendar', (req, res) => {
  res.render('calendar', { branches });
});

app.get('/meetings/new', (req, res) => {
  res.render('schedule', { branches, classes, sections });
});

app.get('/api/branches', (req, res) => {
  res.json(branches);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
