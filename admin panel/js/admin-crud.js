const RECORDS_KEY = 'graveFinderRecords';
const RECORDS_SEED_VERSION_KEY = 'graveFinderRecordsSeedVersion';
const CURRENT_RECORDS_SEED_VERSION = 'single-sample-v1';

// Initial records used only when there is no saved data in localStorage yet.
const defaultRecords = [
  {
    id: 1001,
    name: 'Maria Santos',
    lastName: 'Santos',
    firstName: 'Maria',
    middleInitial: '',
    deceasedDate: '2020-12-12',
    buyerDate: '2019-01-15',
    buyerName: 'Juan Santos',
    buyerLastName: 'Santos',
    buyerFirstName: 'Juan',
    buyerMiddleInitial: '',
    buyerAddress: 'San Fernando, Pampanga',
    location: 'Garden of Memories Area',
    lotNo: 'GOA-ASCSD1232-12',
    section: 'B',
    block: '1',
    recordClass: 'Memorial Lot',
    phase: '1',
    mlUv: 'ML',
    buyerLegend: '1',
    certNo: 'CERT-1001',
    buyerRemarks: '',
    intermentOrderNo: 'INT-1001',
    vaultType: 'Standard',
    deceasedRemarks: '',
    deceasedLegend: '',
    status: 'active'
  }
];

let editingRecordId = null;
let pendingArchiveRecordId = null;
let pendingArchiveReason = '';
let pendingRestoreRecordId = null;
let isSavingRecord = false;
let toastTimer = null;
let recordsPage = 1;
let archivedRecordsPage = 1;
const RECORDS_PAGE_SIZE = 5;
const ARCHIVED_RECORDS_PAGE_SIZE = 10;

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
  const seedVersion = localStorage.getItem(RECORDS_SEED_VERSION_KEY);
  const saved = localStorage.getItem(RECORDS_KEY);
  if (!saved) {
    saveRecords(defaultRecords);
    localStorage.setItem(RECORDS_SEED_VERSION_KEY, CURRENT_RECORDS_SEED_VERSION);
    return [...defaultRecords];
  }

  try {
    const records = JSON.parse(saved);
    if (!Array.isArray(records)) return [...defaultRecords];

    const isOldStarterData = !seedVersion
      && records.length > 1
      && records.every(record => record.id >= 1001 && record.id <= 1013 && !record.buyerName && !record.lotNo);

    if (isOldStarterData) {
      saveRecords(defaultRecords);
      localStorage.setItem(RECORDS_SEED_VERSION_KEY, CURRENT_RECORDS_SEED_VERSION);
      return [...defaultRecords];
    }

    if (!seedVersion) localStorage.setItem(RECORDS_SEED_VERSION_KEY, CURRENT_RECORDS_SEED_VERSION);
    return records;
  } catch {
    saveRecords(defaultRecords);
    localStorage.setItem(RECORDS_SEED_VERSION_KEY, CURRENT_RECORDS_SEED_VERSION);
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
  const requiredFields = ['location', 'lotNo', 'buyerLastName', 'buyerFirstName', 'deceasedDate', 'lastName', 'firstName'];
  let isValid = true;

  requiredFields.forEach(name => {
    const input = form.querySelector(`[name="${name}"]`);
    const message = input && input.value.trim() ? '' : 'This field is required.';
    setFieldError(input, message);
    if (message) isValid = false;
  });

  return isValid;
}

function formatNameParts(lastName, firstName, middleInitial) {
  const cleanLastName = String(lastName || '').trim();
  const cleanFirstName = String(firstName || '').trim();
  const cleanMiddleInitial = String(middleInitial || '').trim().replace(/\.$/, '');
  const firstPart = [cleanFirstName, cleanMiddleInitial ? `${cleanMiddleInitial}.` : ''].filter(Boolean).join(' ');
  return [cleanLastName, firstPart].filter(Boolean).join(', ');
}

function fullDeceasedName(record) {
  if (record.lastName || record.firstName || record.middleInitial) {
    return formatNameParts(record.lastName, record.firstName, record.middleInitial);
  }
  const nameParts = splitNameParts(record.name);
  return formatNameParts(nameParts.lastName, nameParts.firstName, nameParts.middleInitial) || record.name || '';
}

function splitNameParts(fullName) {
  const value = String(fullName || '').trim();
  if (!value) return { lastName: '', firstName: '', middleInitial: '' };
  if (value.includes(',')) {
    const [lastName, rest = ''] = value.split(',');
    const pieces = rest.trim().split(/\s+/).filter(Boolean);
    const possibleMi = pieces.length > 1 ? pieces[pieces.length - 1].replace(/\.$/, '') : '';
    const hasMi = possibleMi.length === 1;
    return {
      lastName: lastName.trim(),
      firstName: hasMi ? pieces.slice(0, -1).join(' ') : pieces.join(' '),
      middleInitial: hasMi ? possibleMi : ''
    };
  }
  const pieces = value.split(/\s+/).filter(Boolean);
  return {
    lastName: pieces.length > 1 ? pieces[pieces.length - 1] : '',
    firstName: pieces.length > 1 ? pieces.slice(0, -1).join(' ') : value,
    middleInitial: ''
  };
}

// Collects values from the add/edit record forms.
function getRecordFormValues(form) {
  const lastName = form.querySelector('[name="lastName"]').value.trim();
  const firstName = form.querySelector('[name="firstName"]').value.trim();
  const middleInitial = form.querySelector('[name="middleInitial"]').value.trim().replace(/\.$/, '');
  const name = fullDeceasedName({ lastName, firstName, middleInitial });
  const buyerLastName = form.querySelector('[name="buyerLastName"]').value.trim();
  const buyerFirstName = form.querySelector('[name="buyerFirstName"]').value.trim();
  const buyerMiddleInitial = form.querySelector('[name="buyerMiddleInitial"]').value.trim().replace(/\.$/, '');
  const buyerName = recordBuyer({ buyerLastName, buyerFirstName, buyerMiddleInitial });

  return {
    name,
    lastName,
    firstName,
    middleInitial,
    deceasedDate: form.querySelector('[name="deceasedDate"]').value,
    buyerDate: form.querySelector('[name="buyerDate"]').value,
    buyerName,
    buyerLastName,
    buyerFirstName,
    buyerMiddleInitial,
    buyerAddress: form.querySelector('[name="buyerAddress"]').value.trim(),
    location: form.querySelector('[name="location"]').value.trim(),
    lotNo: form.querySelector('[name="lotNo"]').value.trim(),
    section: form.querySelector('[name="section"]').value.trim(),
    block: form.querySelector('[name="block"]').value.trim(),
    recordClass: form.querySelector('[name="recordClass"]').value.trim(),
    phase: form.querySelector('[name="phase"]').value.trim(),
    mlUv: form.querySelector('[name="mlUv"]').value.trim(),
    buyerLegend: form.querySelector('[name="buyerLegend"]').value.trim(),
    certNo: form.querySelector('[name="certNo"]').value.trim(),
    buyerRemarks: form.querySelector('[name="buyerRemarks"]').value.trim(),
    intermentOrderNo: form.querySelector('[name="intermentOrderNo"]').value.trim(),
    vaultType: form.querySelector('[name="vaultType"]').value.trim(),
    deceasedRemarks: form.querySelector('[name="deceasedRemarks"]').value.trim(),
    deceasedLegend: form.querySelector('[name="deceasedLegend"]').value.trim()
  };
}

function recordDate(record) {
  return record.deceasedDate || record.deathDate || '';
}

function recordBuyer(record) {
  if (record.buyerLastName || record.buyerFirstName || record.buyerMiddleInitial) {
    return formatNameParts(record.buyerLastName, record.buyerFirstName, record.buyerMiddleInitial);
  }
  const nameParts = splitNameParts(record.buyerName);
  return formatNameParts(nameParts.lastName, nameParts.firstName, nameParts.middleInitial) || record.buyerName || '';
}

function recordLot(record) {
  return record.lotNo || '';
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
    fullDeceasedName(record),
    recordBuyer(record),
    record.buyerAddress,
    record.buyerDate,
    recordDate(record),
    recordLot(record),
    record.section,
    record.block,
    record.recordClass,
    record.phase,
    record.mlUv,
    record.buyerLegend,
    record.certNo,
    record.buyerRemarks,
    record.intermentOrderNo,
    record.vaultType,
    record.deceasedRemarks,
    record.deceasedLegend,
    record.birthDate,
    record.deathDate,
    formatDate(recordDate(record)),
    record.location,
    archiveText
  ].join(' ').toLowerCase().includes(searchText);
}

function getSearchValue(tableType) {
  const id = tableType === 'archived' ? 'archived-record-search-input' : 'record-search-input';
  const input = document.getElementById(id);
  return input ? input.value.trim().toLowerCase() : '';
}

function getRecordFilterValues() {
  return {
    name: document.getElementById('record-name-filter')?.value.trim().toLowerCase() || '',
    location: document.getElementById('record-location-filter')?.value.trim().toLowerCase() || '',
    lotId: document.getElementById('record-lot-id-filter')?.value.trim().toLowerCase() || '',
    born: document.getElementById('record-born-filter')?.value || '',
    died: document.getElementById('record-died-filter')?.value || '',
    intermentDate: document.getElementById('record-interment-filter')?.value || ''
  };
}

function recordMatchesFilters(record, filters) {
  if (filters.name && !fullDeceasedName(record).toLowerCase().includes(filters.name)) return false;
  if (filters.location && !String(record.location || '').toLowerCase().includes(filters.location)) return false;
  if (filters.lotId && !lotId(record).toLowerCase().includes(filters.lotId)) return false;
  if (filters.born && record.birthDate !== filters.born) return false;
  if (filters.died && record.deathDate !== filters.died) return false;
  if (filters.intermentDate && recordDate(record) !== filters.intermentDate) return false;
  return true;
}

function archiveDetails(record) {
  return [
    record.archiveReason ? `Reason: ${escapeHtml(record.archiveReason)}` : 'Reason: Not recorded',
    record.archivedBy ? `By: ${escapeHtml(record.archivedBy)}` : 'By: Unknown',
    record.archivedAt ? `At: ${escapeHtml(formatDateTime(record.archivedAt))}` : ''
  ].filter(Boolean).join('<br>');
}

function burialLocation(record) {
  return [
    record.section ? `Section ${record.section}` : '',
    record.block ? `Block ${record.block}` : '',
    recordLot(record) ? `Lot ${recordLot(record)}` : ''
  ].filter(Boolean).join(' / ') || record.location || 'Not recorded';
}

function getArchivedFilterValues() {
  return {
    sort: document.getElementById('archived-sort-filter')?.value || 'newest',
    dateFrom: document.getElementById('archived-date-from')?.value || '',
    dateTo: document.getElementById('archived-date-to')?.value || ''
  };
}

function recordMatchesArchivedFilters(record, filters) {
  if (filters.dateFrom && (!record.archivedAt || record.archivedAt.slice(0, 10) < filters.dateFrom)) return false;
  if (filters.dateTo && (!record.archivedAt || record.archivedAt.slice(0, 10) > filters.dateTo)) return false;
  return true;
}

function sortArchivedRecords(records, sortMode) {
  return [...records].sort((a, b) => {
    if (sortMode === 'oldest') return new Date(a.archivedAt || 0) - new Date(b.archivedAt || 0);
    if (sortMode === 'name') return fullDeceasedName(a).localeCompare(fullDeceasedName(b));
    return new Date(b.archivedAt || 0) - new Date(a.archivedAt || 0);
  });
}

function updateArchivedSummary(visibleCount = null) {
  const records = getRecords();
  const archived = records.filter(record => record.status === 'archived');
  const restored = records.filter(record => record.restoredAt).length;
  document.querySelectorAll('[data-archive-stat="total"]').forEach(item => { item.textContent = archived.length; });
  document.querySelectorAll('[data-archive-stat="restored"]').forEach(item => { item.textContent = restored; });

  const countText = document.getElementById('archived-count-text');
  if (countText && visibleCount) {
    countText.textContent = visibleCount.total ? `Showing ${visibleCount.start}-${visibleCount.end} of ${visibleCount.total}` : '0 archived records';
  }

  const emptyMessage = document.getElementById('archived-empty-message');
  if (emptyMessage && visibleCount) emptyMessage.hidden = visibleCount.total > 0;
}

function renderArchivedPager(total) {
  const pager = document.getElementById('archived-pager');
  if (!pager) return;
  if (!total) {
    pager.innerHTML = '';
    return;
  }
  const pages = Math.max(1, Math.ceil(total / ARCHIVED_RECORDS_PAGE_SIZE));
  archivedRecordsPage = Math.min(archivedRecordsPage, pages);
  let html = `<button type="button" ${archivedRecordsPage === 1 ? 'disabled' : ''} onclick="changeArchivedRecordsPage(${archivedRecordsPage - 1})">Prev</button>`;
  for (let page = 1; page <= pages; page += 1) {
    html += `<button type="button" ${page === archivedRecordsPage ? 'aria-current="page"' : ''} onclick="changeArchivedRecordsPage(${page})">${page}</button>`;
  }
  html += `<button type="button" ${archivedRecordsPage === pages ? 'disabled' : ''} onclick="changeArchivedRecordsPage(${archivedRecordsPage + 1})">Next</button>`;
  pager.innerHTML = html;
}

function changeArchivedRecordsPage(page) {
  archivedRecordsPage = page;
  renderRecords();
}

function lotId(record) {
  const savedLot = String(record.lotNo || '').trim();
  if (/^[A-Z]{2,}-[A-Z0-9]+-\d+$/i.test(savedLot)) return savedLot.toUpperCase();
  const locationName = String(record.location || 'Garden of Memories Area');
  const locationCode = /garden of memories/i.test(locationName) ? 'GOA' : locationName
    .split(/\s+/)
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 3)
    .toUpperCase() || 'GOA';
  const sectionCode = String(record.section || record.block || 'A').trim().toUpperCase();
  const lotCode = String(savedLot || record.id).trim();
  return `${locationCode}-${sectionCode}-${lotCode}`;
}

function detailItem(label, value) {
  return `<div><span>${label}</span><strong>${escapeHtml(value || 'Not recorded')}</strong></div>`;
}

function duplicateRecordKeys(records) {
  const counts = records.reduce((items, record) => {
    const key = `${recordLot(record)}|${fullDeceasedName(record)}`.toLowerCase();
    items[key] = (items[key] || 0) + 1;
    return items;
  }, {});
  return counts;
}

function isDuplicateRecord(record, counts = duplicateRecordKeys(getRecords())) {
  const key = `${recordLot(record)}|${fullDeceasedName(record)}`.toLowerCase();
  return (counts[key] || 0) > 1;
}

function updateRecordSummary(visibleCount = null) {
  const records = getRecords();
  const duplicateCounts = duplicateRecordKeys(records);
  const duplicateCount = Object.values(duplicateCounts).reduce((total, count) => total + Math.max(0, count - 1), 0);
  document.querySelectorAll('[data-record-stat="total"]').forEach(item => { item.textContent = records.length; });
  document.querySelectorAll('[data-record-stat="duplicates"]').forEach(item => { item.textContent = duplicateCount; });

  const countText = document.getElementById('records-count-text');
  if (countText && visibleCount !== null) {
    if (!visibleCount.total) {
      countText.textContent = '0 records';
    } else {
      countText.textContent = `Showing ${visibleCount.start}-${visibleCount.end} of ${visibleCount.total}`;
    }
  }

  const emptyMessage = document.getElementById('records-empty-message');
  if (emptyMessage && visibleCount !== null) emptyMessage.hidden = visibleCount.total > 0;
}

function renderRecordsPager(total) {
  const pager = document.getElementById('records-pager');
  if (!pager) return;
  const pages = Math.max(1, Math.ceil(total / RECORDS_PAGE_SIZE));
  if (!total) {
    pager.innerHTML = '';
    return;
  }

  recordsPage = Math.min(recordsPage, pages);
  let html = `<button type="button" ${recordsPage === 1 ? 'disabled' : ''} onclick="changeRecordsPage(${recordsPage - 1})">Prev</button>`;
  for (let page = 1; page <= pages; page += 1) {
    html += `<button type="button" ${page === recordsPage ? 'aria-current="page"' : ''} onclick="changeRecordsPage(${page})">${page}</button>`;
  }
  html += `<button type="button" ${recordsPage === pages ? 'disabled' : ''} onclick="changeRecordsPage(${recordsPage + 1})">Next</button>`;
  pager.innerHTML = html;
}

function changeRecordsPage(page) {
  recordsPage = page;
  renderRecords();
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
    const filters = getRecordFilterValues();

    let visibleRecords;
    if (tableType === 'recent') {
      visibleRecords = getActiveRecords().slice(-7).reverse();
    } else if (tableType === 'archived') {
      const archiveFilters = getArchivedFilterValues();
      visibleRecords = sortArchivedRecords(
        getArchivedRecords()
          .filter(record => recordMatchesSearch(record, searchText))
          .filter(record => recordMatchesArchivedFilters(record, archiveFilters)),
        archiveFilters.sort
      );
    } else {
      visibleRecords = getActiveRecords().filter(record => recordMatchesSearch(record, searchText));
    }

    if (tableType !== 'recent') {
      visibleRecords = visibleRecords.filter(record => recordMatchesFilters(record, filters));
    }
    const duplicateMode = document.getElementById('record-duplicate-filter')?.value === 'duplicates';
    const duplicateCounts = duplicateRecordKeys(getRecords());
    if (tableType === 'all' && duplicateMode) {
      visibleRecords = visibleRecords.filter(record => isDuplicateRecord(record, duplicateCounts));
    }

    let displayRecords = visibleRecords;
    if (tableType === 'all') {
      const totalVisible = visibleRecords.length;
      const pages = Math.max(1, Math.ceil(totalVisible / RECORDS_PAGE_SIZE));
      recordsPage = Math.min(recordsPage, pages);
      const startIndex = (recordsPage - 1) * RECORDS_PAGE_SIZE;
      displayRecords = visibleRecords.slice(startIndex, startIndex + RECORDS_PAGE_SIZE);
      updateRecordSummary({
        total: totalVisible,
        start: totalVisible ? startIndex + 1 : 0,
        end: startIndex + displayRecords.length
      });
      renderRecordsPager(totalVisible);
    } else if (tableType === 'archived') {
      const totalVisible = visibleRecords.length;
      const pages = Math.max(1, Math.ceil(totalVisible / ARCHIVED_RECORDS_PAGE_SIZE));
      archivedRecordsPage = Math.min(archivedRecordsPage, pages);
      const startIndex = (archivedRecordsPage - 1) * ARCHIVED_RECORDS_PAGE_SIZE;
      displayRecords = visibleRecords.slice(startIndex, startIndex + ARCHIVED_RECORDS_PAGE_SIZE);
      updateArchivedSummary({
        total: totalVisible,
        start: totalVisible ? startIndex + 1 : 0,
        end: startIndex + displayRecords.length
      });
      renderArchivedPager(totalVisible);
    }

    tbody.innerHTML = displayRecords.map(record => {
      const baseCells = tableType === 'recent'
        ? `
          <td>${escapeHtml(fullDeceasedName(record))}</td>
          <td>${escapeHtml(recordBuyer(record))}</td>
          <td>${escapeHtml(formatDate(recordDate(record)))}</td>
          <td>${escapeHtml(record.location)}</td>
        `
        : tableType === 'archived'
          ? `
          <td>#${escapeHtml(record.id)}</td>
          <td>${escapeHtml(fullDeceasedName(record))}</td>
          <td>${escapeHtml(formatDateTime(record.archivedAt) || 'Not recorded')}</td>
          <td>${escapeHtml(record.archivedBy || 'Unknown')}</td>
          <td><span class="status-badge archived">Archived</span></td>
        `
        : `
          <td>${escapeHtml(lotId(record))}</td>
          <td>${escapeHtml(fullDeceasedName(record))}</td>
          <td>${escapeHtml(formatDate(recordDate(record), true))}</td>
        `;

      let actions = '';
      if (tableType === 'archived') {
        actions += `<button class="action-btn archive-detail-btn" type="button" aria-label="View archive details for ${escapeHtml(fullDeceasedName(record))}" onclick="viewArchiveDetails(${record.id})">Details</button>`;
      } else if (tableType !== 'recent') {
        actions += `<button class="action-btn" type="button" onclick="viewRecord(${record.id})">View</button>`;
        if (canEdit) actions += `<button class="action-btn" type="button" onclick="startEditRecord(${record.id})">Edit</button>`;
        if (canArchive) actions += `<button class="action-btn delete" type="button" onclick="startArchiveRecord(${record.id})">Archive</button>`;
      }

      const archiveCell = '';

      return `
        <tr data-record-id="${record.id}">
          ${baseCells}
          ${archiveCell}
          ${tableType === 'recent' ? '' : `<td>${actions || 'View only'}</td>`}
        </tr>
      `;
    }).join('') || `<tr><td colspan="${tableType === 'archived' ? 6 : 4}">No records found.</td></tr>`;
  });

  const totalValue = document.querySelector('[data-stat="total-records"]');
  if (totalValue) totalValue.textContent = getActiveRecords().length.toLocaleString();
  if (!document.querySelector('[data-records-table="all"]')) updateRecordSummary();
  if (document.querySelector('[data-records-table="archived"]')) updateArchivedSummary();
}

function formatArchiveReason(reason) {
  const raw = String(reason || '').trim();
  if (!raw) return 'Not recorded';
  const presets = [
    'Duplicate record',
    'Incorrect lot assignment',
    'Record replaced by updated file',
    'Administrative correction',
    'Other'
  ];
  for (const preset of presets) {
    if (raw.toLowerCase().startsWith(`${preset.toLowerCase()} `)) {
      const rest = raw.slice(preset.length).replace(/^[\s:—-]+/, '').trim();
      return rest ? `${preset} — ${rest}` : preset;
    }
  }
  return raw;
}

function viewArchiveDetails(id) {
  const record = getRecords().find(item => item.id === id && item.status === 'archived');
  const title = document.getElementById('archive-details-title');
  const content = document.getElementById('archive-details-content');
  if (!record || !title || !content) return;

  const canRestore = hasPermission('records.restore');
  title.innerHTML = `${escapeHtml(fullDeceasedName(record))} <em>#${escapeHtml(record.id)}</em>`;
  content.innerHTML = `
    <div class="archive-summary-card">
      <div class="archive-summary-header">
        <span>Burial &amp; Record Summary</span>
        <strong>${escapeHtml(lotId(record) || `#${record.id}`)}</strong>
      </div>
      <div class="archive-summary-grid">
        ${detailItem('Deceased Name', fullDeceasedName(record) || 'Not recorded')}
        ${detailItem('Date of Interment', formatDate(recordDate(record), true) || 'Not recorded')}
        ${detailItem('Burial Location', burialLocation(record))}
        ${detailItem('Park Area', record.location || 'Not recorded')}
        ${detailItem('Lot Owner / Buyer', recordBuyer(record) || 'Not recorded')}
        ${detailItem('Record ID', `#${record.id}`)}
      </div>
    </div>
    <div class="archive-summary-card">
      <div class="archive-summary-header">
        <span>Archive Audit</span>
        <span class="status-badge archived">Archived</span>
      </div>
      <div class="archive-summary-grid">
        ${detailItem('Archived By', record.archivedBy || 'Unknown')}
        ${detailItem('Date Archived', formatDateTime(record.archivedAt) || 'Not recorded')}
        <div class="archive-reason-box">
          <span>Reason for Archiving</span>
          <strong>${escapeHtml(formatArchiveReason(record.archiveReason))}</strong>
        </div>
      </div>
    </div>
    <div class="archive-details-footer">
      <button type="button" class="record-outline-btn" onclick="closeModal(event, 'archive-details-modal')">Close</button>
      ${canRestore ? `<button type="button" class="admin-primary-btn" onclick="closeModal(event, 'archive-details-modal'); startRestoreRecord(${record.id})">Restore Record</button>` : ''}
    </div>
  `;
  openModal('archive-details-modal');
}

function exportRecordsCsv() {
  const rows = getRecords().filter(record => record.status !== 'archived');
  const headers = ['Lot ID', 'Name of deceased', 'Location', 'Section', 'Block', 'Buyer', 'Remarks'];
  const csvRows = [headers, ...rows.map(record => [
    lotId(record),
    fullDeceasedName(record),
    record.location,
    record.section,
    record.block,
    recordBuyer(record),
    record.deceasedRemarks || record.buyerRemarks || ''
  ])];
  const csv = csvRows.map(row => row.map(value => `"${String(value || '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  link.download = 'burial-records.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

function viewRecord(id) {
  const record = getRecords().find(item => item.id === id);
  if (!record) return;

  const title = document.getElementById('view-record-title');
  const card = document.getElementById('view-record-card');
  if (!title || !card) return;

  const canEdit = hasPermission('records.edit') && record.status !== 'archived';
  const canArchive = hasPermission('records.archive') && record.status !== 'archived';
  const displayName = fullDeceasedName(record);
  title.innerHTML = `${escapeHtml(displayName)} <em>Record</em>`;
  card.innerHTML = `
    <div class="record-card-form record-card-view">
      <div class="record-template-header">
        <div class="record-template-brand">
          <h3>Garden of Memories</h3>
          <p>Memorial Park &amp; Life Plan, Inc.</p>
        </div>
        <h4>Memorial Record Card</h4>
        <div class="record-template-fields">
          <div class="record-template-line first">
            <label><span>Location</span><strong>${escapeHtml(record.location || '')}</strong></label>
            <label><span>Lot No.</span><strong>${escapeHtml(recordLot(record) || '')}</strong></label>
          </div>
          <div class="record-template-line">
            <label><span>Sec.</span><strong>${escapeHtml(record.section || '')}</strong></label>
            <label><span>Block</span><strong>${escapeHtml(record.block || '')}</strong></label>
          </div>
          <div class="record-template-line">
            <label><span>Class</span><strong>${escapeHtml(record.recordClass || '')}</strong></label>
            <label><span>Phase</span><strong>${escapeHtml(record.phase || '')}</strong></label>
          </div>
        </div>
      </div>
      <div class="record-template-double-line"></div>
      <table class="record-template-table buyer-template-table">
        <colgroup><col style="width:7%"><col style="width:26%"><col style="width:27%"><col style="width:5%"><col style="width:4%"><col style="width:8%"><col style="width:9%"><col style="width:14%"></colgroup>
        <thead><tr><th>Date</th><th>Name of Buyer</th><th>Address</th><th>ML<br>UV</th><th colspan="2">See Legend</th><th>Cert. No.</th><th>Remarks</th></tr></thead>
        <tbody>
          <tr><td>${escapeHtml(formatDate(record.buyerDate, true))}</td><td>${escapeHtml(recordBuyer(record))}</td><td>${escapeHtml(record.buyerAddress || '')}</td><td>${escapeHtml(record.mlUv || '')}</td><td colspan="2">${escapeHtml(record.buyerLegend || '')}</td><td>${escapeHtml(record.certNo || '')}</td><td>${escapeHtml(record.buyerRemarks || '')}</td></tr>
          <tr><td></td><td></td><td></td><td></td><td colspan="2"></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td colspan="2"></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td colspan="2"></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td colspan="2"></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td colspan="2"></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td colspan="2"></td><td></td><td></td></tr>
        </tbody>
      </table>
      <div class="record-card-section-title">Deceased</div>
      <table class="record-template-table deceased-template-table">
        <colgroup><col style="width:7%"><col style="width:27%"><col style="width:10%"><col style="width:10%"><col style="width:18%"><col style="width:4.5%"><col style="width:23.5%"></colgroup>
        <thead><tr><th>Date of<br>Interment</th><th>Names of Deceased</th><th>Interment<br>Order No.</th><th>Type of<br>Vault Used</th><th>Remarks</th><th colspan="2">Legend</th></tr></thead>
        <tbody>
          <tr><td>${escapeHtml(formatDate(recordDate(record), true))}</td><td>${escapeHtml(displayName)}</td><td>${escapeHtml(record.intermentOrderNo || '')}</td><td>${escapeHtml(record.vaultType || '')}</td><td>${escapeHtml(record.deceasedRemarks || '')}</td><td class="legend-key">1</td><td class="legend-text">Purchase Agreement</td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td class="legend-key">2</td><td class="legend-text">Add. To Purchase Agreement</td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td class="legend-key">3</td><td class="legend-text">Order of Cancellation</td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td class="legend-key">4</td><td class="legend-text">Deed of Assignment and Transfer</td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td class="legend-key">ML</td><td class="legend-text">Memorial Lot</td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td class="legend-key">UV</td><td class="legend-text">Underground Vault</td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td class="legend-key"></td><td class="legend-text"></td></tr>
        </tbody>
      </table>
    </div>
    <div class="archive-details-footer" style="margin-top: 1rem;">
      <button type="button" class="action-btn" onclick="closeModal(event, 'view-record-modal')">Close</button>
      ${canEdit ? `<button type="button" class="admin-primary-btn" onclick="closeModal(event, 'view-record-modal'); startEditRecord(${record.id});">Edit Record</button>` : ''}
      ${canArchive ? `<button type="button" class="action-btn delete" onclick="closeModal(event, 'view-record-modal'); startArchiveRecord(${record.id});">Archive</button>` : ''}
    </div>
  `;
  openModal('view-record-modal');
}

// Opens the edit modal and fills it with the selected record's data.
function startEditRecord(id) {
  if (!hasPermission('records.edit')) return;
  const record = getRecords().find(item => item.id === id && item.status !== 'archived');
  const form = document.getElementById('edit-record-form');
  if (!record || !form) return;

  editingRecordId = id;
  const nameParts = splitNameParts(fullDeceasedName(record));
  const buyerParts = splitNameParts(recordBuyer(record));
  const fieldValues = {
    lastName: record.lastName || nameParts.lastName,
    firstName: record.firstName || nameParts.firstName,
    middleInitial: record.middleInitial || nameParts.middleInitial,
    deceasedDate: recordDate(record),
    buyerDate: record.buyerDate || '',
    buyerLastName: record.buyerLastName || buyerParts.lastName,
    buyerFirstName: record.buyerFirstName || buyerParts.firstName,
    buyerMiddleInitial: record.buyerMiddleInitial || buyerParts.middleInitial,
    buyerAddress: record.buyerAddress || '',
    location: record.location || '',
    lotNo: recordLot(record),
    section: record.section || '',
    block: record.block || '',
    recordClass: record.recordClass || '',
    phase: record.phase || '',
    mlUv: record.mlUv || '',
    buyerLegend: record.buyerLegend || '',
    certNo: record.certNo || '',
    buyerRemarks: record.buyerRemarks || '',
    intermentOrderNo: record.intermentOrderNo || '',
    vaultType: record.vaultType || '',
    deceasedRemarks: record.deceasedRemarks || '',
    deceasedLegend: record.deceasedLegend || ''
  };
  Object.entries(fieldValues).forEach(([name, value]) => {
    const input = form.querySelector(`[name="${name}"]`);
    if (input) input.value = value;
  });
  openModal('edit-record-modal');
}

function startArchiveRecord(id) {
  if (!hasPermission('records.archive')) return;
  const record = getRecords().find(item => item.id === id && item.status !== 'archived');
  const form = document.getElementById('archive-record-form');
  if (!record || !form) return;

  pendingArchiveRecordId = id;
  pendingArchiveReason = '';
  form.reset();
  setFieldError(form.querySelector('[name="archiveReasonPreset"]'), '');
  setFieldError(form.querySelector('[name="archiveReason"]'), '');
  const locationParts = [
    record.section ? `Section ${record.section}` : '',
    record.block ? `Block ${record.block}` : ''
  ].filter(Boolean).join(' / ') || record.location || 'Not recorded';
  const summaryValues = {
    'archive-record-id': `#${record.id}`,
    'archive-deceased-name': fullDeceasedName(record) || 'Not recorded',
    'archive-record-id-detail': `#${record.id}`,
    'archive-burial-location': locationParts,
    'archive-lot-number': lotId(record) || 'Not recorded'
  };
  Object.entries(summaryValues).forEach(([id, value]) => {
    const item = document.getElementById(id);
    if (item) item.textContent = value;
  });
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

  logActivity('Archived', fullDeceasedName(record), `Record #${id} archived. Reason: ${reason.trim()}`);
  renderRecords();
  showAdminToast('Record archived successfully.');
  return true;
}

function confirmArchiveRecord() {
  if (!pendingArchiveRecordId || !pendingArchiveReason) return;
  if (isSavingRecord) return;
  isSavingRecord = true;
  if (archiveRecord(pendingArchiveRecordId, pendingArchiveReason)) {
    pendingArchiveRecordId = null;
    pendingArchiveReason = '';
    closeModal(null, 'confirm-archive-modal');
    closeModal(null, 'archive-record-modal');
  }
  setTimeout(() => { isSavingRecord = false; }, 300);
}

function startRestoreRecord(id) {
  if (!hasPermission('records.restore')) return;
  const record = getRecords().find(item => item.id === id && item.status === 'archived');
  if (!record) return;

  pendingRestoreRecordId = id;
  document.getElementById('restore-record-summary').textContent = `Restore record #${record.id}: ${fullDeceasedName(record)}?`;
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

  logActivity('Restored', fullDeceasedName(record), `Record #${id} restored to Grave Records.`);
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

      const record = getRecords().find(item => item.id === pendingArchiveRecordId && item.status !== 'archived');
      if (!record) return;
      const reasonInput = archiveForm.querySelector('[name="archiveReason"]');
      const presetInput = archiveForm.querySelector('[name="archiveReasonPreset"]');
      const preset = presetInput ? presetInput.value.trim() : '';
      const details = reasonInput.value.trim();
      if (!preset) {
        setFieldError(presetInput, 'Please select an archive reason.');
        showAdminToast('Please select an archive reason.');
        return;
      }
      if (!details) {
        setFieldError(reasonInput, 'Reason details are required.');
        showAdminToast('Reason details are required.');
        return;
      }
      if (!/^[a-zA-Z0-9 ]+$/.test(details)) {
        setFieldError(reasonInput, 'Use letters, numbers, and spaces only.');
        showAdminToast('Reason details can only use letters, numbers, and spaces.');
        return;
      }

      setFieldError(presetInput, '');
      setFieldError(reasonInput, '');
      const reason = `${preset} — ${details}`;
      pendingArchiveReason = reason;
      const confirmSummary = document.getElementById('confirm-archive-summary');
      if (confirmSummary) {
        confirmSummary.textContent = `Are you sure you want to archive the burial record of ${fullDeceasedName(record)}?`;
      }
      openModal('confirm-archive-modal');
    }, true);
  }
}

function setupArchiveReasonDetailsValidation() {
  const archiveForm = document.getElementById('archive-record-form');
  if (!archiveForm) return;
  const reasonInput = archiveForm.querySelector('[name="archiveReason"]');
  if (!reasonInput) return;

  reasonInput.addEventListener('beforeinput', event => {
    if (event.data && !/^[a-zA-Z0-9 ]+$/.test(event.data)) {
      event.preventDefault();
    }
  });

  reasonInput.addEventListener('input', () => {
    const cleanValue = reasonInput.value.replace(/[^a-zA-Z0-9 ]+/g, '');
    if (reasonInput.value !== cleanValue) reasonInput.value = cleanValue;
  });
}

// Filters the Grave Records table by name, ID, date, reason, administrator, or location.
function filterRecords() {
  const input = document.getElementById('record-search-input');
  recordsPage = 1;
  if (input && !input.value.trim()) {
    renderRecords();
    showAdminToast('Please enter a deceased name, buyer, location, lot, date, or ID to search records.');
    input.focus();
    return;
  }

  renderRecords();
}

function dateInRange(inputId, minYear, maxYear, label) {
  const input = document.getElementById(inputId);
  if (!input || !input.value) return true;
  const year = Number(input.value.slice(0, 4));
  const valid = year >= minYear && year <= maxYear;
  if (!valid) {
    showAdminToast(`${label} must be from ${minYear} to ${maxYear}.`);
    input.focus();
  }
  return valid;
}

function applyRecordFilters(event) {
  if (
    !dateInRange('record-born-filter', 1899, 2026, 'Born date') ||
    !dateInRange('record-died-filter', 1987, 2026, 'Died date') ||
    !dateInRange('record-interment-filter', 1987, 2026, 'Date of interment')
  ) return;

  recordsPage = 1;
  renderRecords();
  closeModal(event, 'record-filter-modal');
  showAdminToast('Record filters applied.');
}

function clearRecordFilters() {
  [
    'record-name-filter',
    'record-location-filter',
    'record-lot-id-filter',
    'record-born-filter',
    'record-died-filter',
    'record-interment-filter'
  ].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = '';
  });
  recordsPage = 1;
  renderRecords();
  showAdminToast('Record filters cleared.');
}

function filterArchivedRecords() {
  const input = document.getElementById('archived-record-search-input');
  const dateFrom = document.getElementById('archived-date-from');
  const dateTo = document.getElementById('archived-date-to');
  archivedRecordsPage = 1;
  if (input && !input.value.trim() && !dateFrom?.value && !dateTo?.value) {
    renderRecords();
    showAdminToast('Please enter a deceased name, buyer, location, lot, date, reason, or ID to filter archived records.');
    input.focus();
    return;
  }

  renderRecords();
}

function applyArchivedFilters(event) {
  archivedRecordsPage = 1;
  renderRecords();
  closeModal(event, 'archived-record-filter-modal');
  showAdminToast('Archived record filters applied.');
}

function clearArchivedFilters() {
  const searchInput = document.getElementById('archived-record-search-input');
  const sortInput = document.getElementById('archived-sort-filter');
  const dateFrom = document.getElementById('archived-date-from');
  const dateTo = document.getElementById('archived-date-to');
  if (searchInput) searchInput.value = '';
  if (sortInput) sortInput.value = 'newest';
  if (dateFrom) dateFrom.value = '';
  if (dateTo) dateTo.value = '';
  archivedRecordsPage = 1;
  renderRecords();
  showAdminToast('Archived record filters cleared.');
}

// Initializes the admin records UI after the page has loaded.
document.addEventListener('DOMContentLoaded', () => {
  renderRecords();
  setupRecordForms();
  setupArchiveReasonDetailsValidation();

  const activeSearch = document.getElementById('record-search-input');
  const archivedSearch = document.getElementById('archived-record-search-input');
  const archivedDateFrom = document.getElementById('archived-date-from');
  const archivedDateTo = document.getElementById('archived-date-to');
  if (activeSearch) activeSearch.addEventListener('input', () => {
    recordsPage = 1;
    renderRecords();
  });
  if (archivedSearch) archivedSearch.addEventListener('input', () => {
    archivedRecordsPage = 1;
    renderRecords();
  });
  if (archivedDateFrom) archivedDateFrom.addEventListener('change', () => {
    archivedRecordsPage = 1;
    renderRecords();
  });
  if (archivedDateTo) archivedDateTo.addEventListener('change', () => {
    archivedRecordsPage = 1;
    renderRecords();
  });
});

