document.addEventListener('DOMContentLoaded', () => {
  // Grab all key DOM elements using querySelector
  const dropdown = document.querySelector('#task-dropdown');
  const inputFields = document.querySelectorAll('.time-input');
  const dataRows = document.querySelector('#data-rows');
  const addBtn = document.querySelector('#add-btn');
  const cancelBtn = document.querySelector('#cancel-btn');
  const submitBtn = document.querySelector('#submit-btn');
  const outputJSON = document.querySelector('#output-json');

  // Format mm to hh:mm on blur
  inputFields.forEach(field => {
    field.addEventListener('blur', () => {
      const val = field.value.trim();
      if (/^\d+$/.test(val)) {
        const minutes = parseInt(val, 10);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        field.value = `${hours}:${mins.toString().padStart(2, '0')}`;
      }
    });
  });

  // Cancel button clears all input fields
  cancelBtn.addEventListener('click', () => {
    dropdown.value = '';
    inputFields.forEach(field => field.value = '');
  });

  // Add row to the table
  addBtn.addEventListener('click', () => {
    const task = dropdown.value;
    if (!task) return alert("Select a task!");

    // Create new table row
    const row = document.createElement('tr');

    // Task name cell
    const taskCell = document.createElement('td');
    taskCell.textContent = task;
    row.appendChild(taskCell);

    // Weekday values
    inputFields.forEach(field => {
      const cell = document.createElement('td');
      cell.textContent = field.value || '-';
      row.appendChild(cell);
    });

    // Delete cell
    const delCell = document.createElement('td');
    const delBtn = document.createElement('span');
    delBtn.textContent = '❌'; // emoji-based delete
    delBtn.style.cursor = 'pointer';
    delBtn.style.color = 'red';
    delBtn.addEventListener('click', () => row.remove());
    delCell.appendChild(delBtn);
    row.appendChild(delCell);

    // Append row to table
    dataRows.appendChild(row);

    // Clear input fields
    cancelBtn.click();
  });

  // Submit: convert table rows into JSON and display
  submitBtn.addEventListener('click', () => {
    const rows = dataRows.querySelectorAll('tr');
    const timesheet = [];

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const entry = {
        task: cells[0].textContent,
        Mon: cells[1].textContent,
        Tue: cells[2].textContent,
        Wed: cells[3].textContent,
        Thur: cells[4].textContent,
        Friday: cells[5].textContent
      };
      timesheet.push(entry);
    });

    outputJSON.textContent = JSON.stringify(timesheet, null, 2);
  });
});
