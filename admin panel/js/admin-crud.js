const RECORDS_KEY = 'graveFinderRecords';

// Initial records used only when there is no saved data in localStorage yet.
const defaultRecords = [
  { id: 1001, name: 'Maria Santos', birthDate: '1945-01-15', deathDate: '2020-12-12', location: 'Section D, Plot 12', status: 'active' },
  { id: 1002, name: 'Juan Manuel Dela Cruz', birthDate: '1950-02-20', deathDate: '2018-11-01', location: 'Section A, Plot 8', status: 'active' },
  { id: 1003, name: 'Elena Rosales Villanueva', birthDate: '1938-03-08', deathDate: '2015-06-15', location: 'Section B, Plot 24', status: 'active' },
  { id: 1004, name: 'Roberto Garcia Reyes', birthDate: '1960-04-12', deathDate: '2021-08-22', location: 'Section C, Plot 5', status: 'active' },
  { id: 1005, name: 'Carmen Mendoza Flores', birthDate: '1942-05-30', deathDate: '2019-09-10', location: 'Section D, Plot 18', status: 'active' },
  { id: 1006, name: 'Ricardo Castro Cruz', birthDate: '1955-06-25', deathDate: '2022-07-04', location: 'Section E, Plot 33', status: 'active' },
  { id: 1007, name: 'Teresita Bautista Perez', birthDate: '1948-07-18', deathDate: '2017-10-31', location: 'Section F, Plot 11', status: 'active' },
  { id: 1008, name: 'Eduardo Navarro Gomez', birthDate: '1935-08-05', deathDate: '2010-01-14', location: 'Section G, Plot 42', status: 'active' },
  { id: 1009, name: 'Josefina Ramos Ramos', birthDate: '1952-09-14', deathDate: '2020-03-08', location: 'Section H, Plot 7', status: 'active' },
  { id: 1010, name: 'Antonio Diaz Aquino', birthDate: '1940-10-02', deathDate: '2016-12-25', location: 'Section I, Plot 19', status: 'active' },
  { id: 1011, name: 'Lourdes Tolentino Cortez', birthDate: '1947-11-22', deathDate: '2014-02-18', location: 'Section J, Plot 2', status: 'active' },
  { id: 1012, name: 'Fernando De Leon Santos', birthDate: '1965-12-09', deathDate: '2023-04-05', location: 'Section A, Plot 55', status: 'active' },
  { id: 1013, name: 'Sol Martinez Alvarez', birthDate: '1955-03-10', deathDate: '2021-07-22', location: 'Section B, Plot 14', status: 'active' }
];

let editingRecordId = null;
let pendingArchiveRecordId = null;
let pendingRestoreRecordId = null;
let isSavingRecord = false;
let toastTimer = null;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

// Loads records from localStorage, then falls back to the starter records.
function getRecords() {
  const saved = localStorage.getItem(RECORDS_KEY);
  if (!saved) {
    saveRecords(defaultRecords);
    return [...defaultRecords];
  }

  try {
    const records = JSON.parse(saved);
    return Array.isArray(records) ? records : [...defaultRecords];
  } catch {
    saveRecords(defaultRecords);
    return [...defaultRecords];
  }
}

// Saves the latest records so admin changes remain after page refresh.
function saveRecords(records) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

// Convenience helpers for filtering by status.
function getActiveRecords() {
  return getRecords().filter(record => record.status !== 'archived');
}

function getArchivedRecords() {
  return getRecords().filter(record => record.status === 'archived');
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

function formatDateTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function showAdminToast(message) {
  const toast = document.getElementById('admin-toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

// Retained as a compatibility wrapper for pages that already call this helper.
function showAdminMessage(message) {
  showAdminToast(message);
}

function setFieldError(input, message) {
  const errorText = input ? input.parentElement.querySelector('.field-error-text') : null;
  if (!input) return;
  input.setCustomValidity(message || '');
  input.classList.toggle('input-invalid', Boolean(message));
  if (errorText) errorText.textContent = message || '';
}

function validateRecordForm(form) {
  const requiredFields = ['recordName', 'birthDate', 'deathDate', 'location'];
  let isValid = true;

  requiredFields.forEach(name => {
    const input = form.querySelector(`[name="${name}"]`);
    const message = input && input.value.trim() ? '' : 'This field is required.';
    setFieldError(input, message);
    if (message) isValid = false;
  });

  return isValid;
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

function recordMatchesSearch(record, searchText) {
  if (!searchText) return true;
  const archiveText = [
    record.archiveReason,
    record.archivedBy,
    formatDateTime(record.archivedAt)
  ].filter(Boolean).join(' ');

  return [
    record.id,
    record.name,
    record.birthDate,
    record.deathDate,
    formatDate(record.birthDate),
    formatDate(record.deathDate),
    record.location,
    archiveText
  ].join(' ').toLowerCase().includes(searchText);
}

function getSearchValue(tableType) {
  const id = tableType === 'archived' ? 'archived-record-search-input' : 'record-search-input';
  const input = document.getElementById(id);
  return input ? input.value.trim().toLowerCase() : '';
}

function archiveDetails(record) {
  return [
    record.archiveReason ? `Reason: ${escapeHtml(record.archiveReason)}` : 'Reason: Not recorded',
    record.archivedBy ? `By: ${escapeHtml(record.archivedBy)}` : 'By: Unknown',
    record.archivedAt ? `At: ${escapeHtml(formatDateTime(record.archivedAt))}` : ''
  ].filter(Boolean).join('<br>');
}

// Renders active, recent, or archived records depending on which table is on the page.
function renderRecords() {
  document.querySelectorAll('[data-records-table]').forEach(table => {
    const tableType = table.dataset.recordsTable;
    const tbody = table.querySelector('tbody');
    const canEdit = hasPermission('records.edit');
    const canArchive = hasPermission('records.archive');
    const canRestore = hasPermission('records.restore');
    const searchText = getSearchValue(tableType);

    let visibleRecords;
    if (tableType === 'recent') {
      visibleRecords = getActiveRecords().slice(-7).reverse();
    } else if (tableType === 'archived') {
      visibleRecords = getArchivedRecords().filter(record => recordMatchesSearch(record, searchText));
    } else {
      visibleRecords = getActiveRecords().filter(record => recordMatchesSearch(record, searchText));
    }

    tbody.innerHTML = visibleRecords.map(record => {
      const baseCells = tableType === 'recent'
        ? `
          <td>${escapeHtml(record.name)}</td>
          <td>${escapeHtml(formatDate(record.birthDate))}</td>
          <td>${escapeHtml(formatDate(record.deathDate))}</td>
          <td>${escapeHtml(record.location)}</td>
        `
        : `
          <td>#${escapeHtml(record.id)}</td>
          <td>${escapeHtml(record.name)}</td>
          <td>${escapeHtml(formatDate(record.birthDate, true))}</td>
          <td>${escapeHtml(formatDate(record.deathDate, true))}</td>
          <td>${escapeHtml(record.location)}</td>
        `;

      let actions = '';
      if (tableType === 'archived') {
        if (canRestore) actions += `<button class="action-btn" type="button" onclick="startRestoreRecord(${record.id})">Restore</button>`;
      } else if (tableType !== 'recent') {
        if (canEdit) actions += `<button class="action-btn" type="button" onclick="startEditRecord(${record.id})">Edit</button>`;
        if (canArchive) actions += `<button class="action-btn delete" type="button" onclick="startArchiveRecord(${record.id})">Archive</button>`;
      }

      const archiveCell = tableType === 'archived' ? `<td>${archiveDetails(record)}</td>` : '';

      return `
        <tr data-record-id="${record.id}">
          ${baseCells}
          ${archiveCell}
          ${tableType === 'recent' ? '' : `<td>${actions || 'View only'}</td>`}
        </tr>
      `;
    }).join('') || `<tr><td colspan="${tableType === 'archived' ? 7 : 6}">No records found.</td></tr>`;
  });

  const totalValue = document.querySelector('[data-stat="total-records"]');
  if (totalValue) totalValue.textContent = getActiveRecords().length.toLocaleString();
}

// Opens the edit modal and fills it with the selected record's data.
function startEditRecord(id) {
  if (!hasPermission('records.edit')) return;
  const record = getRecords().find(item => item.id === id && item.status !== 'archived');
  const form = document.getElementById('edit-record-form');
  if (!record || !form) return;

  editingRecordId = id;
  form.querySelector('[name="recordName"]').value = record.name;
  form.querySelector('[name="birthDate"]').value = record.birthDate;
  form.querySelector('[name="deathDate"]').value = record.deathDate;
  form.querySelector('[name="location"]').value = record.location;
  openModal('edit-record-modal');
}

function startArchiveRecord(id) {
  if (!hasPermission('records.archive')) return;
  const record = getRecords().find(item => item.id === id && item.status !== 'archived');
  const form = document.getElementById('archive-record-form');
  if (!record || !form) return;

  pendingArchiveRecordId = id;
  form.reset();
  setFieldError(form.querySelector('[name="archiveReason"]'), '');
  document.getElementById('archive-record-summary').textContent = `Record #${record.id}: ${record.name}`;
  openModal('archive-record-modal');
}

// Archives a record instead of deleting it outright; it stays in storage.
function archiveRecord(id, reason) {
  if (!hasPermission('records.archive')) return false;

  const currentAdmin = getCurrentAdmin();
  const records = getRecords();
  const record = records.find(item => item.id === id && item.status !== 'archived');
  if (!record) return false;

  saveRecords(records.map(item => (item.id === id ? {
    ...item,
    status: 'archived',
    archiveReason: reason.trim(),
    archivedBy: currentAdmin ? currentAdmin.email : 'Unknown',
    archivedAt: new Date().toISOString()
  } : item)));

  logActivity('Archived', record.name, `Record #${id} archived. Reason: ${reason.trim()}`);
  renderRecords();
  showAdminToast('Record archived successfully.');
  return true;
}

function startRestoreRecord(id) {
  if (!hasPermission('records.restore')) return;
  const record = getRecords().find(item => item.id === id && item.status === 'archived');
  if (!record) return;

  pendingRestoreRecordId = id;
  document.getElementById('restore-record-summary').textContent = `Restore record #${record.id}: ${record.name}?`;
  openModal('restore-record-modal');
}

// Restores an archived record back to the active list.
function restoreRecord(id) {
  if (!hasPermission('records.restore')) return false;
  const records = getRecords();
  const record = records.find(item => item.id === id && item.status === 'archived');
  if (!record) return false;

  saveRecords(records.map(item => (item.id === id ? {
    ...item,
    status: 'active',
    restoredBy: getCurrentAdmin() ? getCurrentAdmin().email : 'Unknown',
    restoredAt: new Date().toISOString()
  } : item)));

  logActivity('Restored', record.name, `Record #${id} restored to Grave Records.`);
  renderRecords();
  showAdminToast('Record restored successfully.');
  return true;
}

function confirmRestoreRecord() {
  if (!pendingRestoreRecordId) return;
  if (restoreRecord(pendingRestoreRecordId)) {
    pendingRestoreRecordId = null;
    closeModal(null, 'restore-record-modal');
  }
}

// Connects add/edit/archive form submissions to the localStorage CRUD behavior.
function setupRecordForms() {
  const addForm = document.getElementById('add-record-form');
  const editForm = document.getElementById('edit-record-form');
  const archiveForm = document.getElementById('archive-record-form');

  if (addForm) {
    addForm.addEventListener('submit', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!hasPermission('records.add') || isSavingRecord) return;
      if (!validateRecordForm(addForm)) {
        showAdminToast('Please complete all required record fields.');
        return;
      }

      isSavingRecord = true;
      const records = getRecords();
      const nextId = records.length ? Math.max(...records.map(record => record.id)) + 1 : 1001;
      const values = getRecordFormValues(addForm);
      records.push({ id: nextId, ...values, status: 'active' });
      saveRecords(records);
      addForm.reset();
      closeModal(event, 'add-record-modal');
      renderRecords();
      logActivity('Created', values.name, `New record #${nextId} added.`);
      showAdminToast('Record added successfully.');
      setTimeout(() => { isSavingRecord = false; }, 300);
    }, true);
  }

  if (editForm) {
    editForm.addEventListener('submit', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!hasPermission('records.edit') || isSavingRecord) return;
      if (!validateRecordForm(editForm)) {
        showAdminToast('Please complete all required record fields.');
        return;
      }

      isSavingRecord = true;
      const values = getRecordFormValues(editForm);
      const records = getRecords().map(record => (
        record.id === editingRecordId && record.status !== 'archived' ? { ...record, ...values } : record
      ));
      saveRecords(records);
      closeModal(event, 'edit-record-modal');
      renderRecords();
      logActivity('Updated', values.name, `Record #${editingRecordId} details updated.`);
      showAdminToast('Record updated successfully.');
      setTimeout(() => { isSavingRecord = false; }, 300);
    }, true);
  }

  if (archiveForm) {
    archiveForm.addEventListener('submit', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!hasPermission('records.archive') || isSavingRecord) return;

      const reasonInput = archiveForm.querySelector('[name="archiveReason"]');
      const reason = reasonInput.value.trim();
      if (!reason) {
        setFieldError(reasonInput, 'Archive reason is required.');
        showAdminToast('Archive reason is required.');
        return;
      }

      isSavingRecord = true;
      if (archiveRecord(pendingArchiveRecordId, reason)) {
        pendingArchiveRecordId = null;
        closeModal(event, 'archive-record-modal');
      }
      setTimeout(() => { isSavingRecord = false; }, 300);
    }, true);
  }
}

// Filters the Grave Records table by name, ID, date, reason, administrator, or location.
function filterRecords() {
  const input = document.getElementById('record-search-input');
  if (input && !input.value.trim()) {
    renderRecords();
    showAdminToast('Please enter a name, section, plot, date, or ID to filter records.');
    input.focus();
    return;
  }

  renderRecords();
}

function filterArchivedRecords() {
  const input = document.getElementById('archived-record-search-input');
  if (input && !input.value.trim()) {
    renderRecords();
    showAdminToast('Please enter a name, reason, section, plot, date, or ID to filter archived records.');
    input.focus();
    return;
  }

  renderRecords();
}

// Initializes the admin records UI after the page has loaded.
document.addEventListener('DOMContentLoaded', () => {
  renderRecords();
  setupRecordForms();

  const activeSearch = document.getElementById('record-search-input');
  const archivedSearch = document.getElementById('archived-record-search-input');
  if (activeSearch) activeSearch.addEventListener('input', renderRecords);
  if (archivedSearch) archivedSearch.addEventListener('input', renderRecords);
});
