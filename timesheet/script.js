document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('#task-dropdown');
  const inputFields = document.querySelectorAll('.time-input');
  const dataRows = document.querySelector('#data-rows');
  const addBtn = document.querySelector('#add-btn');
  const cancelBtn = document.querySelector('#cancel-btn');
  const submitBtn = document.querySelector('#submit-btn');
  const outputJSON = document.querySelector('#output-json');

  const taskMap = new Map();
  let editingTask = null;

  function toggleSubmitButton() {
    submitBtn.disabled = dataRows.querySelectorAll('tr').length === 0;
  }

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

  cancelBtn.addEventListener('click', () => {
    dropdown.value = '';
    inputFields.forEach(field => field.value = '');
    editingTask = null;
  });

  addBtn.addEventListener('click', () => {
    const task = dropdown.value;
    if (!task) {
      alert("Select a task!");
      return;
    }

    const hasInput = Array.from(inputFields).some(field => field.value.trim() !== '');
    if (!hasInput) {
      alert("Enter time for at least one day!");
      return;
    }

    if (editingTask) {
      const row = taskMap.get(editingTask);
      const cells = row.querySelectorAll('td');
      inputFields.forEach((field, i) => {
        cells[i + 1].textContent = field.value || '-';
      });
      editingTask = null;
      cancelBtn.click();
      return;
    }

    if (taskMap.has(task)) {
      alert(`Task "${task}" already exists. Editing it.`);
      const existingRow = taskMap.get(task);
      const cells = existingRow.querySelectorAll('td');
      inputFields.forEach((field, i) => {
        const val = cells[i + 1].textContent;
        field.value = val === '-' ? '' : val;
      });
      editingTask = task;
      return;
    }

    const row = document.createElement('tr');

    const taskCell = document.createElement('td');
    taskCell.textContent = task;
    row.appendChild(taskCell);

    inputFields.forEach(field => {
      const cell = document.createElement('td');
      cell.textContent = field.value || '-';
      row.appendChild(cell);
    });

    const delCell = document.createElement('td');
    const delBtn = document.createElement('span');
    delBtn.textContent = '❌';
    delBtn.style.cursor = 'pointer';
    delBtn.addEventListener('click', () => {
      row.remove();
      taskMap.delete(task);
      if (editingTask === task) {
        editingTask = null;
        cancelBtn.click();
      }
      toggleSubmitButton();
    });
    delCell.appendChild(delBtn);
    row.appendChild(delCell);

    dataRows.appendChild(row);
    taskMap.set(task, row);
    toggleSubmitButton();
    cancelBtn.click();
  });

  submitBtn.addEventListener('click', () => {
    const rows = dataRows.querySelectorAll('tr');
    const timesheet = [];

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      timesheet.push({
        task: cells[0].textContent,
        Mon: cells[1].textContent,
        Tue: cells[2].textContent,
        Wed: cells[3].textContent,
        Thur: cells[4].textContent,
        Friday: cells[5].textContent
      });
    });

    outputJSON.textContent = JSON.stringify(timesheet, null, 2);
  });
});
