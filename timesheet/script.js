document.addEventListener('DOMContentLoaded', () => {
  // Grab all key DOM elements
  const dropdown = document.querySelector('#task-dropdown');
  const inputFields = document.querySelectorAll('.time-input');
  const dataRows = document.querySelector('#data-rows');
  const addBtn = document.querySelector('#add-btn');
  const cancelBtn = document.querySelector('#cancel-btn');
  const submitBtn = document.querySelector('#submit-btn');
  const outputJSON = document.querySelector('#output-json');

  // Track tasks and editing state
  const taskMap = new Map(); // task name → <tr>
  let editingTask = null;

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

  // Cancel button clears inputs and resets editing
  cancelBtn.addEventListener('click', () => {
    dropdown.value = '';
    inputFields.forEach(field => field.value = '');
    editingTask = null;
  });

  // Add or update row
  addBtn.addEventListener('click', () => {
    const task = dropdown.value;
    if (!task) {
      alert("Select a task!");
      return;
    }

    const hasAtLeastOneValue = Array.from(inputFields).some(field => field.value.trim() !== '');
    if (!hasAtLeastOneValue) {
      alert("Enter time for at least one day!");
      return;
    }

    if (editingTask) {
      // Update existing task
      const row = taskMap.get(editingTask);
      const cells = row.querySelectorAll('td');
      inputFields.forEach((field, index) => {
        cells[index + 1].textContent = field.value || '-';
      });

      editingTask = null;
      cancelBtn.click();
      return;
    }

    if (taskMap.has(task)) {
      alert(`Task "${task}" already exists. Editing instead.`);
      const existingRow = taskMap.get(task);
      const cells = existingRow.querySelectorAll('td');

      // Load existing values into input fields
      inputFields.forEach((field, index) => {
        const val = cells[index + 1].textContent;
        field.value = (val === '-') ? '' : val;
      });

      editingTask = task;
      return;
    }

    // Create new row
    const row = document.createElement('tr');

    // Task name
    const taskCell = document.createElement('td');
    taskCell.textContent = task;
    row.appendChild(taskCell);

    // Time inputs
    inputFields.forEach(field => {
      const cell = document.createElement('td');
      cell.textContent = field.value || '-';
      row.appendChild(cell);
    });

    // Delete column
    const delCell = document.createElement('td');
    const delBtn = document.createElement('span');
    delBtn.textContent = '❌';
    delBtn.style.cursor = 'pointer';
    delBtn.style.color = 'red';
    delBtn.addEventListener('click', () => {
      row.remove();
      taskMap.delete(task);
      if (editingTask === task) {
        editingTask = null;
        cancelBtn.click();
      }
    });
    delCell.appendChild(delBtn);
    row.appendChild(delCell);

    // Append row and track task
    dataRows.appendChild(row);
    taskMap.set(task, row);
    cancelBtn.click();
  });

  // Submit: convert table rows to JSON
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
