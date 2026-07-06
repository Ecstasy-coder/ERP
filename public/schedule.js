document.addEventListener("DOMContentLoaded", () => {
  const specificPeopleOptions = document.getElementById('specificPeopleOptions');
  const classSectionRow = document.getElementById('classSectionRow');
  const meetingForm = document.getElementById('meetingForm');
  const messageBox = document.getElementById('messageBox');

  const updateVisibility = () => {
    const selected = document.querySelector('input[name="required_people_type"]:checked').value;
    specificPeopleOptions.classList.toggle('hidden', selected !== 'specific');
    classSectionRow.classList.toggle('hidden', selected !== 'class_students');
  };

  document.querySelectorAll('input[name="required_people_type"]').forEach(radio => {
    radio.addEventListener('change', updateVisibility);
  });

  updateVisibility();

  meetingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      branch: document.getElementById('branch').value,
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      start_datetime: document.getElementById('startDate').value,
      end_datetime: document.getElementById('endDate').value,
      required_people_type: document.querySelector('input[name="required_people_type"]:checked').value,
      required_people_details: {
        employees: document.getElementById('allEmployee')?.checked || false,
        teachers: document.getElementById('allTeachers')?.checked || false,
        students: document.getElementById('allStudents')?.checked || false,
        selected_class: document.getElementById('classSelect')?.value || null,
        selected_section: document.getElementById('sectionSelect')?.value || null,
      },
    };

    const response = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      window.location.href = '/meetings/calendar';
    } else {
      const error = await response.json();
      messageBox.textContent = error.error || 'Unable to save meeting';
      messageBox.classList.remove('d-none');
    }
  });
});
