const RECORDS_KEY = 'graveFinderRecords';

// Initial records used only when there is no saved data in localStorage yet.
const defaultRecords = [
  { id: 1001, name: 'Maria Santos', birthDate: '1945-01-15', deathDate: '2020-12-12', location: 'Section D, Plot 12' },
  { id: 1002, name: 'Juan Manuel Dela Cruz', birthDate: '1950-02-20', deathDate: '2018-11-01', location: 'Section A, Plot 8' },
  { id: 1003, name: 'Elena Rosales Villanueva', birthDate: '1938-03-08', deathDate: '2015-06-15', location: 'Section B, Plot 24' },
  { id: 1004, name: 'Roberto Garcia Reyes', birthDate: '1960-04-12', deathDate: '2021-08-22', location: 'Section C, Plot 5' },
  { id: 1005, name: 'Carmen Mendoza Flores', birthDate: '1942-05-30', deathDate: '2019-09-10', location: 'Section D, Plot 18' },
  { id: 1006, name: 'Ricardo Castro Cruz', birthDate: '1955-06-25', deathDate: '2022-07-04', location: 'Section E, Plot 33' },
  { id: 1007, name: 'Teresita Bautista Perez', birthDate: '1948-07-18', deathDate: '2017-10-31', location: 'Section F, Plot 11' },
  { id: 1008, name: 'Eduardo Navarro Gomez', birthDate: '1935-08-05', deathDate: '2010-01-14', location: 'Section G, Plot 42' },
  { id: 1009, name: 'Josefina Ramos Ramos', birthDate: '1952-09-14', deathDate: '2020-03-08', location: 'Section H, Plot 7' },
  { id: 1010, name: 'Antonio Diaz Aquino', birthDate: '1940-10-02', deathDate: '2016-12-25', location: 'Section I, Plot 19' },
  { id: 1011, name: 'Lourdes Tolentino Cortez', birthDate: '1947-11-22', deathDate: '2014-02-18', location: 'Section J, Plot 2' },
  { id: 1012, name: 'Fernando De Leon Santos', birthDate: '1965-12-09', deathDate: '2023-04-05', location: 'Section A, Plot 55' },
  { id: 1013, name: 'Sol Martinez Alvarez', birthDate: '1955-03-10', deathDate: '2021-07-22', location: 'Section B, Plot 14' }
];

let editingRecordId = null;

// Loads records from localStorage, then falls back to the starter records.
function getRecords() {
  const saved = localStorage.getItem(RECORDS_KEY);
  if (!saved) {
    saveRecords(defaultRecords);
    return [...defaultRecords];
  }

  try {
    return JSON.parse(saved);
  } catch {
    saveRecords(defaultRecords);
    return [...defaultRecords];
  }
}

// Saves the latest records so admin changes remain after page refresh.
function saveRecords(records) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

// Converts date input values into readable dates for the admin tables.
function formatDate(value, short = false) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    month: short ? 'short' : 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

// Shows a reusable admin notification modal, with alert as backup.
function showAdminMessage(message) {
  const messageText = document.getElementById('system-message-text');
  if (messageText) {
    messageText.innerText = message;
    openModal('system-message-modal');
  } else {
    alert(message);
  }
}

// Collects values from the add/edit record forms.
function getRecordFormValues(form) {
  return {
    name: form.querySelector('[name="recordName"]').value.trim(),
    birthDate: form.querySelector('[name="birthDate"]').value,
    deathDate: form.querySelector('[name="deathDate"]').value,
    location: form.querySelector('[name="location"]').value.trim()
  };
}

// Renders either all records or dashboard recent records depending on the table.
function renderRecords() {
  const table = document.querySelector('[data-records-table]');
  if (!table) return;

  const records = getRecords();
  const tbody = table.querySelector('tbody');
  const isDashboard = table.dataset.recordsTable === 'recent';
  const visibleRecords = isDashboard ? records.slice(-7).reverse() : records;

  tbody.innerHTML = visibleRecords.map(record => {
    const cells = isDashboard
      ? `
        <td>${record.name}</td>
        <td>${formatDate(record.birthDate)}</td>
        <td>${formatDate(record.deathDate)}</td>
        <td>${record.location}</td>
      `
      : `
        <td>#${record.id}</td>
        <td>${record.name}</td>
        <td>${formatDate(record.birthDate, true)}</td>
        <td>${formatDate(record.deathDate, true)}</td>
        <td>${record.location}</td>
      `;

    return `
      <tr data-record-id="${record.id}">
        ${cells}
        <td>
          <button class="action-btn" type="button" onclick="startEditRecord(${record.id})">Edit</button>
          <button class="action-btn delete" type="button" onclick="deleteRecord(${record.id})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');

  const totalValue = document.querySelector('[data-stat="total-records"]');
  if (totalValue) totalValue.textContent = records.length.toLocaleString();
}

// Opens the edit modal and fills it with the selected record's data.
function startEditRecord(id) {
  const record = getRecords().find(item => item.id === id);
  const form = document.getElementById('edit-record-form');
  if (!record || !form) return;

  editingRecordId = id;
  form.querySelector('[name="recordName"]').value = record.name;
  form.querySelector('[name="birthDate"]').value = record.birthDate;
  form.querySelector('[name="deathDate"]').value = record.deathDate;
  form.querySelector('[name="location"]').value = record.location;
  openModal('edit-record-modal');
}

// Deletes one record from storage and refreshes the table.
function deleteRecord(id) {
  if (!confirm('Are you sure you want to delete this record?')) return;

  const records = getRecords().filter(record => record.id !== id);
  saveRecords(records);
  renderRecords();
  showAdminMessage('Record deleted successfully!');
}

// Connects add/edit form submissions to the localStorage CRUD behavior.
function setupRecordForms() {
  const addForm = document.getElementById('add-record-form');
  const editForm = document.getElementById('edit-record-form');

  if (addForm) {
    addForm.addEventListener('submit', event => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const records = getRecords();
      const nextId = records.length ? Math.max(...records.map(record => record.id)) + 1 : 1001;
      records.push({ id: nextId, ...getRecordFormValues(addForm) });
      saveRecords(records);
      addForm.reset();
      closeModal(event, 'add-record-modal');
      renderRecords();
      showAdminMessage('Record added successfully!');
    }, true);
  }

  if (editForm) {
    editForm.addEventListener('submit', event => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const records = getRecords().map(record => (
        record.id === editingRecordId ? { ...record, ...getRecordFormValues(editForm) } : record
      ));
      saveRecords(records);
      closeModal(event, 'edit-record-modal');
      renderRecords();
      showAdminMessage('Record updated successfully!');
    }, true);
  }
}

// Filters the Grave Records table by name, ID, date, or location.
function filterRecords() {
  const input = document.getElementById('record-search-input');
  const rows = document.querySelectorAll('[data-records-table="all"] tbody tr');
  const searchText = input ? input.value.toLowerCase() : '';

  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(searchText) ? '' : 'none';
  });
}

// Initializes the admin records UI after the page has loaded.
document.addEventListener('DOMContentLoaded', () => {
  renderRecords();
  setupRecordForms();
});
