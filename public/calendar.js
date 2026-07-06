const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let activeDate = new Date();
const branchFilter = document.getElementById('branchFilter');
const monthTitle = document.getElementById('monthTitle');
const calendarBody = document.getElementById('calendarBody');
const prevBtn = document.getElementById('prevMonth');
const todayBtn = document.getElementById('currentMonth');
const nextBtn = document.getElementById('nextMonth');

const toISOStringLocal = date => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 19);
};

const buildCalendar = async () => {
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();

  monthTitle.textContent = `${monthNames[month]} ${year}`;

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month, lastDay.getDate(), 23, 59, 59);

  const params = new URLSearchParams({
    start: toISOStringLocal(startDate),
    end: toISOStringLocal(endDate),
  });
  if (branchFilter.value) params.set('branch', branchFilter.value);

  const res = await fetch(`/api/meetings?${params.toString()}`);
  const meetings = await res.json();

  const eventsByDay = {};
  meetings.forEach(meeting => {
    const meetingDate = meeting.meeting_date ? new Date(meeting.meeting_date) : null;
    if (!meetingDate || Number.isNaN(meetingDate.getTime())) return;

    const dayKey = meetingDate.getDate();
    if (!eventsByDay[dayKey]) eventsByDay[dayKey] = [];
    eventsByDay[dayKey].push(meeting);
  });

  calendarBody.innerHTML = '';
  let day = 1;
  for (let row = 0; row < 6; row++) {
    const tr = document.createElement('tr');
    for (let col = 0; col < 7; col++) {
      const td = document.createElement('td');
      if (row === 0 && col < startDay) {
        td.className = 'bg-light';
      } else if (day > lastDay.getDate()) {
        td.className = 'bg-light';
      } else {
        const dayCount = document.createElement('div');
        dayCount.className = 'calendar-day-number';
        dayCount.textContent = day;
        td.appendChild(dayCount);

        const events = eventsByDay[day] || [];
        events.slice(0, 3).forEach(event => {
          const pill = document.createElement('div');
          pill.className = 'event-pill';
          const timeLabel = event.start_time ? `${event.start_time}` : '';
          pill.textContent = timeLabel ? `${timeLabel} - ${event.title}` : event.title;
          td.appendChild(pill);
        });

        if (events.length > 3) {
          const more = document.createElement('div');
          more.className = 'text-muted';
          more.style.fontSize = '0.85rem';
          more.textContent = `+${events.length - 3} more`;
          td.appendChild(more);
        }
        day++;
      }
      tr.appendChild(td);
    }
    calendarBody.appendChild(tr);
  }
};

branchFilter.addEventListener('change', buildCalendar);
prevBtn.addEventListener('click', () => { activeDate.setMonth(activeDate.getMonth() - 1); buildCalendar(); });
todayBtn.addEventListener('click', () => { activeDate = new Date(); buildCalendar(); });
nextBtn.addEventListener('click', () => { activeDate.setMonth(activeDate.getMonth() + 1); buildCalendar(); });

window.addEventListener('DOMContentLoaded', buildCalendar);
