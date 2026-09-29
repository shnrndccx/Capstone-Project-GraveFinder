const APPOINTMENTS_KEY = 'graveFinderAppointments';
const INQUIRIES_KEY = 'graveFinderInquiries';
const SETTINGS_KEY = 'graveFinderSettings';

// Starter appointment data shown until the admin edits, confirms, or cancels items.
const defaultAppointments = [
  {
    id: 1,
    dateTime: '2025-10-28T10:00',
    client: 'Juan Dela Cruz',
    service: 'Burial Lots',
    contact: '+63 917 123 4567',
    status: 'Pending'
  },
  {
    id: 2,
    dateTime: '2025-10-29T14:30',
    client: 'Elena Rosales',
    service: 'Chapel Services',
    contact: 'elena@example.com',
    status: 'Pending'
  },
  {
    id: 3,
    dateTime: '2025-09-14T09:00',
    client: 'Marites Villanueva',
    service: 'Grave Location Assistance',
    contact: '+63 918 555 0192',
    status: 'Completed',
    archivedAt: '2025-09-14T17:00'
  },
  {
    id: 4,
    dateTime: '2025-09-20T13:30',
    client: 'Ramon Dizon',
    service: 'Document Request',
    contact: 'ramon.dizon@example.com',
    status: 'Completed',
    archivedAt: '2025-09-20T17:15'
  },
  {
    id: 5,
    dateTime: '2025-09-27T11:00',
    client: 'Liza Mercado',
    service: 'Memorial Visit Inquiry',
    contact: '+63 927 440 1120',
    status: 'Cancelled',
    archivedAt: '2025-09-26T15:20'
  },
  {
    id: 6,
    dateTime: '2026-10-03T09:30',
    client: 'Angela Santos',
    service: 'Burial Record Assistance',
    contact: '+63 917 204 8891',
    status: 'Pending'
  },
  {
    id: 7,
    dateTime: '2026-10-05T14:00',
    client: 'Miguel Reyes',
    service: 'Grave Location Visit',
    contact: 'miguel.reyes@example.com',
    status: 'Pending'
  },
  {
    id: 8,
    dateTime: '2026-10-08T10:30',
    client: 'Carla Mendoza',
    service: 'Family Plot Inquiry',
    contact: '+63 926 118 4402',
    contactNumber: '+63 926 118 4402',
    email: 'carla.mendoza@email.com',
    details: 'Looking to check available adjacent family plots in Section B.',
    status: 'Pending'
  },
  {
    id: 9,
    dateTime: '2026-10-12T09:00',
    client: 'Roberto Bautista',
    service: 'Interment inquiry',
    contact: '+63 917 845 3310',
    contactNumber: '+63 917 845 3310',
    email: 'roberto.bautista@email.com',
    details: 'Inquiring about interment requirements and scheduling for next week.',
    status: 'Pending'
  },
  {
    id: 10,
    dateTime: '2026-10-15T11:00',
    client: 'Patricia Navarro',
    service: 'Grave or niche inquiry',
    contact: '+63 918 392 6641',
    contactNumber: '+63 918 392 6641',
    email: 'patricia.navarro@email.com',
    details: 'Would like to view available columbarium niches and lawn lots.',
    status: 'Pending'
  },
  {
    id: 11,
    dateTime: '2026-10-19T13:30',
    client: 'Daniel Soriano',
    service: 'Document or records inquiry',
    contact: '+63 927 551 9082',
    contactNumber: '+63 927 551 9082',
    email: 'daniel.soriano@email.com',
    details: 'Requesting a certified copy of the purchase agreement and lot certificate.',
    status: 'Pending'
  },
  {
    id: 12,
    dateTime: '2026-10-22T15:00',
    client: 'Clarissa Aquino',
    service: 'Memorial service inquiry',
    contact: '+63 915 704 2198',
    contactNumber: '+63 915 704 2198',
    email: 'clarissa.aquino@email.com',
    details: 'Planning an anniversary memorial service at the chapel.',
    status: 'Pending'
  },
  {
    id: 13,
    dateTime: '2026-10-26T10:00',
    client: 'Victor Tolentino',
    service: 'Grave Location Visit',
    contact: '+63 919 630 4475',
    contactNumber: '+63 919 630 4475',
    email: 'victor.tolentino@email.com',
    details: 'Needs assistance locating the family grave in Phase 2 ahead of All Saints Day.',
    status: 'Pending'
  }
];

// Starter inquiry data shown until messages are marked read, replied to, or deleted.
const defaultInquiries = [
  {
    id: 1,
    receivedAt: '2025-10-25T08:15',
    sender: 'Mark Reyes',
    email: 'mark@email.com',
    subject: 'Pricing for family estates',
    message: 'Hello, I would like to inquire about the pricing and availability of family estates in Section B. Thank you!',
    status: 'New'
  },
  {
    id: 2,
    receivedAt: '2025-10-24T15:40',
    sender: 'Sarah Alonzo',
    email: 'sarah@email.com',
    subject: 'Question about visiting hours on holidays',
    message: 'Hi, are you open during upcoming national holidays? Please let me know the schedule. Thanks.',
    status: 'Read'
  }
];

// Starter settings for the System Settings page.
const defaultSettings = {
  parkName: 'Garden of Memories Memorial Park',
  parkStatus: 'Open',
  parkAddress: 'San Fernando, Pampanga',
  parkHours: '6:00 AM - 6:00 PM Daily',
  officeHours: '8:00 AM - 5:00 PM',
  contactNumber: '',
  publicEmail: 'info@gardenofmemories.com',
  parkLogo: '../assets/logo.png',
  parkDescription: 'A peaceful memorial park for families and visitors.',
  appointmentStartTime: '08:00',
  appointmentEndTime: '17:00',
  maxAppointmentsPerDay: '10',
  bookingLeadTime: '2',
  availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  allowRescheduling: true,
  allowCancellation: true,
  autoBlockFullDates: true,
  specialClosures: '',
  defaultMapView: 'Main cemetery grounds',
  defaultZoomLevel: '16',
  visitorMapAccess: 'Enabled',
  mapLastUpdated: '2026-09-28',
  showLocationLabels: true,
  showGraveMarkers: true,
  showMapLegend: true,
  unavailableAreas: '',
  notifyNewAppointment: true,
  notifyAppointmentCancellation: true,
  notifyAppointmentReminder: false,
  notifyAdminChanges: true,
  notifyRecordArchiving: true,
  adminName: 'System Administrator',
  adminEmail: 'admin@gardenofmemories.com',
  adminPassword: '',
  backupFrequency: 'Daily',
  archiveRetention: 'Preserve indefinitely',
  activityLogRetention: '3 years',
  timezone: 'Asia/Manila',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12-hour',
  language: 'English',
  recordsPerPage: '10',
  sessionTimeout: '30 minutes',
  maintenanceMode: false
};

let editingAppointmentId = null;
let archivingAppointmentId = null;
let activeInquiryId = null;

function isAppointmentArchived(appointment) {
  if (appointment.archivedAt) return true;
  if (['Completed', 'Archived', 'Done', 'Cancelled'].includes(appointment.status)) return true;
  if (!appointment.dateTime) return false;
  return new Date(appointment.dateTime).getTime() < Date.now();
}

// Reads an array/object from localStorage, then seeds it with starter data if empty.
function loadAdminData(key, fallback) {
  const saved = localStorage.getItem(key);
  if (!saved) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return Array.isArray(fallback) ? [...fallback] : { ...fallback };
  }

  try {
    const parsed = JSON.parse(saved);
    if (key === APPOINTMENTS_KEY && Array.isArray(parsed) && Array.isArray(fallback)) {
      const savedIds = new Set(parsed.map(item => item.id));
      const missingFallbackItems = fallback.filter(item => !savedIds.has(item.id));
      let list = missingFallbackItems.length ? [...parsed, ...missingFallbackItems] : parsed;
      let changed = missingFallbackItems.length > 0;

      list = list.map(item => {
        if (!isAppointmentArchived(item) && !item.statusModifiedByAdmin && item.status !== 'Pending') {
          changed = true;
          return { ...item, status: 'Pending' };
        }
        return item;
      });

      if (changed) {
        localStorage.setItem(key, JSON.stringify(list));
      }
      return list;
    }
    return parsed;
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback));
    return Array.isArray(fallback) ? [...fallback] : { ...fallback };
  }
}

// Saves updated admin page data after each action.
function saveAdminData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Formats date-time values for table display.
function formatDateTime(value) {
  const date = new Date(value);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function splitAppointmentContact(appointment) {
  return {
    contactNumber: appointment.contactNumber || (/[@]/.test(appointment.contact || '') ? '' : appointment.contact || ''),
    email: appointment.email || (/[@]/.test(appointment.contact || '') ? appointment.contact || '' : '')
  };
}

function splitAppointmentDateTime(value) {
  const [date = '', time = ''] = String(value || '').split('T');
  return { date, time };
}

function appointmentDateTimestamp(appointment) {
  return new Date(appointment.dateTime || '').getTime() || 0;
}

function setupAppointmentFilters() {
  const monthInput = document.getElementById('appointment-month-filter');
  const sortInput = document.getElementById('appointment-sort-filter');
  const helpText = document.getElementById('appointment-month-help');
  const currentYear = new Date().getFullYear();

  if (monthInput) {
    monthInput.min = `${currentYear}-01`;
    monthInput.max = `${currentYear}-12`;
    if (helpText) helpText.textContent = `Allowed months: January to December ${currentYear}.`;
    monthInput.addEventListener('change', () => {
      const selectedYear = Number(monthInput.value.slice(0, 4));
      if (monthInput.value && selectedYear !== currentYear) {
        monthInput.value = '';
        showPageMessage(`Please choose a month within ${currentYear} only.`);
      }
      renderAppointments();
    });
  }

  if (sortInput) sortInput.addEventListener('change', renderAppointments);
}

function getVisibleAppointments() {
  const monthInput = document.getElementById('appointment-month-filter');
  const sortInput = document.getElementById('appointment-sort-filter');
  const selectedMonth = monthInput ? monthInput.value : '';
  const sortDirection = sortInput ? sortInput.value : 'asc';

  return loadAdminData(APPOINTMENTS_KEY, defaultAppointments)
    .filter(appointment => !isAppointmentArchived(appointment))
    .filter(appointment => !selectedMonth || String(appointment.dateTime || '').startsWith(selectedMonth))
    .sort((a, b) => {
      const result = appointmentDateTimestamp(a) - appointmentDateTimestamp(b);
      return sortDirection === 'desc' ? -result : result;
    });
}

function clearAppointmentFilters() {
  const monthInput = document.getElementById('appointment-month-filter');
  const sortInput = document.getElementById('appointment-sort-filter');
  if (monthInput) monthInput.value = '';
  if (sortInput) sortInput.value = 'asc';
  renderAppointments();
}

// Shows a shared notification modal if the page has one.
function showPageMessage(message) {
  const messageText = document.getElementById('system-message-text');
  if (messageText) {
    messageText.innerText = message;
    openModal('system-message-modal');
  } else {
    alert(message);
  }
}

// Draws the appointments table from saved appointment data.
function renderAppointments() {
  const table = document.querySelector('[data-appointments-table]');
  if (!table) return;

  const appointments = getVisibleAppointments();
  const tbody = table.querySelector('tbody');
  const canView = hasPermission('appointments.view');
  const canManage = hasPermission('appointments.manage');

  if (!canView) {
    tbody.innerHTML = '<tr><td colspan="5">You do not have permission to view appointments.</td></tr>';
    return;
  }

  tbody.innerHTML = appointments.map(appointment => {
    const statusClass = appointment.status === 'Confirmed' ? 'status-confirmed' : 'status-pending';
    let actions = '';

    if (canManage) {
      actions = `
        <button class="action-btn" type="button" onclick="startEditAppointment(${appointment.id})">Edit</button>
        <button class="action-btn delete" type="button" onclick="archiveAppointment(${appointment.id})">Archive</button>
      `;
    } else if (canView) {
      actions = `
        <button class="action-btn" type="button" onclick="viewAppointment(${appointment.id})">View</button>
      `;
    }

    return `
      <tr>
        <td>${formatDateTime(appointment.dateTime)}</td>
        <td>${appointment.client}</td>
        <td>${appointment.service}</td>
        <td><span class="status-badge ${statusClass}">${appointment.status}</span></td>
        <td>${actions || 'View only'}</td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="5">No active appointments found.</td></tr>';
}

function renderArchivedAppointments() {
  const table = document.querySelector('[data-archived-appointments-table]');
  if (!table) return;

  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments).filter(isAppointmentArchived);
  const tbody = table.querySelector('tbody');
  const canView = hasPermission('appointments.view');

  if (!canView) {
    tbody.innerHTML = '<tr><td colspan="5">You do not have permission to view archived appointments.</td></tr>';
    return;
  }

  tbody.innerHTML = appointments.map(appointment => {
    return `
      <tr>
        <td>${formatDateTime(appointment.dateTime)}</td>
        <td>${appointment.client}</td>
        <td>${appointment.service}</td>
        <td><span class="status-badge status-read">Archived</span></td>
        <td><button class="action-btn" type="button" onclick="viewArchivedAppointment(${appointment.id})">View</button></td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="5">No archived appointments found.</td></tr>';
}

// Opens the archived appointment details modal.
function viewArchivedAppointment(id) {
  if (!hasPermission('appointments.view')) return;
  const appointment = loadAdminData(APPOINTMENTS_KEY, defaultAppointments).find(item => item.id === id);
  const form = document.getElementById('view-archived-appointment-form');
  if (!appointment || !form) return;

  const contact = splitAppointmentContact(appointment);
  const schedule = splitAppointmentDateTime(appointment.dateTime);
  const archivedAt = appointment.archivedAt || appointment.dateTime;
  form.querySelector('[name="client"]').value = appointment.client || '';
  form.querySelector('[name="contactNumber"]').value = contact.contactNumber || '';
  form.querySelector('[name="email"]').value = contact.email || '';
  form.querySelector('[name="appointmentDate"]').value = schedule.date || '';
  form.querySelector('[name="appointmentTime"]').value = schedule.time || '';
  form.querySelector('[name="service"]').value = appointment.service || '';
  form.querySelector('[name="details"]').value = appointment.details || appointment.appointmentDetails || '';
  form.querySelector('[name="status"]').value = 'Archived';
  form.querySelector('[name="archivedAt"]').value = formatDateTime(archivedAt);

  const scheduleConfirmField = form.querySelector('[name="scheduleConfirmation"]');
  const emailStatusField = form.querySelector('[name="emailStatus"]');
  const outcomeField = form.querySelector('[name="appointmentOutcome"]');
  const handlerField = form.querySelector('[name="handledBy"]');
  const followUpField = form.querySelector('[name="followUpNeeded"]');
  const notesField = form.querySelector('[name="archiveNotes"]');
  if (scheduleConfirmField) scheduleConfirmField.value = appointment.scheduleConfirmation || 'Confirmed on given date';
  if (emailStatusField) emailStatusField.value = appointment.emailStatus || 'Not recorded';
  if (outcomeField) outcomeField.value = appointment.appointmentOutcome || 'Completed as scheduled';
  if (handlerField) handlerField.value = appointment.handledBy || 'System Administrator';
  if (followUpField) followUpField.value = appointment.followUpNeeded || 'No follow-up needed';
  if (notesField) {
    const combinedNotes = [appointment.adminNotes, appointment.archiveNotes].filter(Boolean).join(' | ');
    notesField.value = combinedNotes || '';
  }

  openModal('view-archived-appointment-modal');
}

// Marks an appointment as confirmed.
function confirmAppointment(id) {
  if (!hasPermission('appointments.manage')) return;
  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments);
  const appointment = appointments.find(item => item.id === id);
  if (!appointment) return;

  saveAdminData(APPOINTMENTS_KEY, appointments.map(item => (
    item.id === id ? { ...item, status: 'Confirmed', statusModifiedByAdmin: true } : item
  )));
  logActivity('Confirmed', appointment.client, `Appointment #${id} confirmed.`);
  renderAppointments();
  showPageMessage('Appointment confirmed successfully!');
}

function getRescheduleDateBounds() {
  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const minStr = formatDate(today);
  const maxStr = formatDate(lastDayOfMonth);
  const todayLabel = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const maxLabel = lastDayOfMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return {
    today,
    lastDayOfMonth,
    minStr,
    maxStr,
    helpText: `Available from ${todayLabel} until ${maxLabel}.`,
    errorMessage: `Please select a reschedule date from ${todayLabel} until ${maxLabel}.`
  };
}

function validateRescheduleDateField(input, errorEl) {
  if (!input || input.disabled) {
    if (input) {
      input.setCustomValidity('');
      input.classList.remove('input-invalid');
    }
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  const { minStr, maxStr, errorMessage } = getRescheduleDateBounds();
  const value = input.value.trim();
  let message = '';

  if (!value) {
    message = 'Please select the reschedule date.';
  } else if (value < minStr || value > maxStr) {
    message = errorMessage;
  }

  input.setCustomValidity(message);
  input.classList.toggle('input-invalid', Boolean(message));
  if (errorEl) errorEl.textContent = message ? `⚠ ${message}` : '';
  return !message;
}

function syncRescheduleDateField(form, readOnly = false) {
  if (!form) return;
  const scheduleConfirmField = form.querySelector('[name="scheduleConfirmation"]');
  const rescheduleGroup = document.getElementById('reschedule-date-group');
  const rescheduleInput = document.getElementById('reschedule-date');
  const rescheduleHelp = document.getElementById('reschedule-date-help');
  const rescheduleError = document.getElementById('reschedule-date-error');
  if (!scheduleConfirmField || !rescheduleGroup || !rescheduleInput) return;

  const bounds = getRescheduleDateBounds();
  rescheduleInput.min = bounds.minStr;
  rescheduleInput.max = bounds.maxStr;
  rescheduleInput.title = bounds.errorMessage;
  if (rescheduleHelp) rescheduleHelp.textContent = bounds.helpText;

  const isReschedule = scheduleConfirmField.value === 'Rescheduled to new date';
  rescheduleGroup.style.display = isReschedule ? 'flex' : 'none';
  rescheduleInput.disabled = readOnly || !isReschedule;
  rescheduleInput.readOnly = readOnly;
  rescheduleInput.required = !readOnly && isReschedule;

  if (!isReschedule || readOnly) {
    rescheduleInput.setCustomValidity('');
    rescheduleInput.classList.remove('input-invalid');
    if (rescheduleError) rescheduleError.textContent = '';
  }
}

function openAppointmentModalWithMode(id, readOnly) {
  const appointment = loadAdminData(APPOINTMENTS_KEY, defaultAppointments).find(item => item.id === id);
  const form = document.getElementById('edit-appointment-form');
  if (!appointment || !form) return;

  editingAppointmentId = readOnly ? null : id;
  const modalTitle = document.getElementById('appointment-modal-title');
  const saveBtn = document.getElementById('appointment-save-btn');
  if (modalTitle) modalTitle.textContent = readOnly ? 'View appointment' : 'Edit appointment';
  if (saveBtn) saveBtn.style.display = readOnly ? 'none' : '';

  const contact = splitAppointmentContact(appointment);
  const originalSchedule = splitAppointmentDateTime(appointment.originalDateTime || appointment.dateTime);
  const currentSchedule = splitAppointmentDateTime(appointment.dateTime);
  form.querySelector('[name="client"]').value = appointment.client || '';
  form.querySelector('[name="contactNumber"]').value = contact.contactNumber;
  form.querySelector('[name="email"]').value = contact.email;
  form.querySelector('[name="appointmentDate"]').value = originalSchedule.date;
  form.querySelector('[name="appointmentTime"]').value = originalSchedule.time;
  form.querySelector('[name="service"]').value = appointment.service || '';
  form.querySelector('[name="status"]').value = appointment.status || 'Pending';
  form.querySelector('[name="details"]').value = appointment.details || appointment.appointmentDetails || '';

  const scheduleConfirmField = form.querySelector('[name="scheduleConfirmation"]');
  const emailStatusField = form.querySelector('[name="emailStatus"]');
  const statusField = form.querySelector('[name="status"]');
  const adminNotesField = form.querySelector('[name="adminNotes"]');
  const rescheduleInput = document.getElementById('reschedule-date');

  if (scheduleConfirmField) {
    scheduleConfirmField.value = appointment.scheduleConfirmation || 'Pending schedule review';
    scheduleConfirmField.disabled = readOnly;
  }
  if (emailStatusField) {
    emailStatusField.value = appointment.emailStatus || 'Not yet emailed';
    emailStatusField.disabled = readOnly;
  }
  if (statusField) {
    statusField.disabled = readOnly;
  }
  if (adminNotesField) {
    adminNotesField.value = appointment.adminNotes || '';
    adminNotesField.readOnly = readOnly;
  }
  if (rescheduleInput) {
    const { minStr, maxStr } = getRescheduleDateBounds();
    const candidateDate = appointment.rescheduledDate || currentSchedule.date || '';
    rescheduleInput.value = (candidateDate >= minStr && candidateDate <= maxStr) ? candidateDate : (appointment.rescheduledDate || '');
    rescheduleInput.setCustomValidity('');
    rescheduleInput.classList.remove('input-invalid');
  }
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.setCustomValidity('');
    field.classList.remove('input-invalid');
  });
  form.querySelectorAll('.field-error-text').forEach(el => {
    el.textContent = '';
  });

  syncRescheduleDateField(form, readOnly);
  openModal('edit-appointment-modal');
}

// Opens the appointment modal in read-only mode for admins with view-only permission.
function viewAppointment(id) {
  if (!hasPermission('appointments.view')) return;
  openAppointmentModalWithMode(id, true);
}

// Opens the appointment edit modal with the selected schedule.
function startEditAppointment(id) {
  if (!hasPermission('appointments.manage')) return;
  openAppointmentModalWithMode(id, false);
}

// Opens the Archive Appointment modal form for the selected appointment.
function archiveAppointment(id) {
  if (!hasPermission('appointments.manage')) return;
  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments);
  const appointment = appointments.find(item => item.id === id);
  const form = document.getElementById('archive-appointment-form');
  if (!appointment || !form) return;

  archivingAppointmentId = id;
  const idEl = document.getElementById('archive-appt-id');
  const clientEl = document.getElementById('archive-appt-client');
  const dateTimeEl = document.getElementById('archive-appt-datetime');
  const serviceEl = document.getElementById('archive-appt-service');
  const statusEl = document.getElementById('archive-appt-status');

  if (idEl) idEl.textContent = `#${appointment.id}`;
  if (clientEl) clientEl.textContent = appointment.client || '—';
  if (dateTimeEl) dateTimeEl.textContent = formatDateTime(appointment.dateTime);
  if (serviceEl) serviceEl.textContent = appointment.service || '—';
  if (statusEl) statusEl.textContent = appointment.status || 'Pending';

  form.reset();
  form.querySelectorAll('.field-error-text').forEach(el => { el.textContent = ''; });
  form.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid'));

  const currentAdmin = typeof getCurrentAdmin === 'function' ? getCurrentAdmin() : null;
  const handlerInput = form.querySelector('[name="handledBy"]');
  if (handlerInput && currentAdmin?.name) {
    handlerInput.value = currentAdmin.name;
  }

  openModal('archive-appointment-modal');
}

// Removes a cancelled appointment from the saved list.
function cancelAppointment(id) {
  if (!hasPermission('appointments.manage')) return;
  if (!confirm('Are you sure you want to cancel this appointment?')) return;

  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments);
  const appointment = appointments.find(item => item.id === id);
  if (!appointment) return;

  saveAdminData(APPOINTMENTS_KEY, appointments.filter(item => item.id !== id));
  logActivity('Cancelled', appointment.client, `Appointment #${id} cancelled.`);
  renderAppointments();
  showPageMessage('Appointment cancelled successfully!');
}

// Draws the inquiries table from saved inquiry data.
function renderInquiries() {
  const table = document.querySelector('[data-inquiries-table]');
  if (!table) return;

  const inquiries = loadAdminData(INQUIRIES_KEY, defaultInquiries);
  const tbody = table.querySelector('tbody');
  const canView = hasPermission('inquiries.view');
  const canManage = hasPermission('inquiries.manage');

  if (!canView) {
    tbody.innerHTML = '<tr><td colspan="5">You do not have permission to view inquiries.</td></tr>';
    return;
  }

  tbody.innerHTML = inquiries.map(inquiry => {
    const statusClass = inquiry.status === 'New' ? 'status-new' : 'status-read';
    const urgentBadge = inquiry.urgent ? '<span class="status-badge status-pending">Urgent</span>' : '';

    let actions = '';
    if (canManage) {
      actions = `
        <button class="action-btn" type="button" onclick="openMessageModal(${inquiry.id})">View & Reply</button>
        <button class="action-btn delete" type="button" onclick="deleteInquiry(${inquiry.id})">Delete</button>
      `;
    } else {
      actions = `<button class="action-btn" type="button" onclick="openMessageModal(${inquiry.id})">View</button>`;
    }

    return `
      <tr>
        <td>${formatDateTime(inquiry.receivedAt)}</td>
        <td>${inquiry.sender}<br><small>${inquiry.email}</small></td>
        <td>${inquiry.subject}</td>
        <td><span class="status-badge ${statusClass}">${inquiry.status}</span> ${urgentBadge}</td>
        <td>${actions}</td>
      </tr>
    `;
  }).join('');
}

// Lets Low Admin flag an inquiry as urgent without replying or deleting it.
function toggleInquiryFlag(id) {
  if (!hasPermission('inquiries.manage')) return;
  const inquiries = loadAdminData(INQUIRIES_KEY, defaultInquiries);
  const inquiry = inquiries.find(item => item.id === id);
  if (!inquiry) return;

  const nextUrgent = !inquiry.urgent;
  saveAdminData(INQUIRIES_KEY, inquiries.map(item => (
    item.id === id ? { ...item, urgent: nextUrgent } : item
  )));
  logActivity(nextUrgent ? 'Flagged' : 'Unflagged', inquiry.sender, `Message #${id} marked ${nextUrgent ? 'urgent' : 'not urgent'}.`);
  renderInquiries();
  showPageMessage(nextUrgent ? 'Message flagged as urgent.' : 'Message unflagged.');
}

// Opens the message modal and marks a new inquiry as read.
function openMessageModal(id) {
  const inquiries = loadAdminData(INQUIRIES_KEY, defaultInquiries);
  const inquiry = inquiries.find(item => item.id === id);
  if (!inquiry) return;

  activeInquiryId = id;
  document.getElementById('modal-sender-name').innerText = inquiry.sender;
  document.getElementById('modal-sender-email').innerText = inquiry.email;
  document.getElementById('modal-msg-subject').innerText = inquiry.subject;
  document.getElementById('modal-msg-body').innerText = inquiry.message;

  if (hasPermission('inquiries.manage')) {
    saveAdminData(INQUIRIES_KEY, inquiries.map(item => (
      item.id === id ? { ...item, status: 'Read' } : item
    )));
    renderInquiries();
  }
  openModal('view-message-modal');
}

// Deletes an inquiry from the inbox.
function deleteInquiry(id) {
  if (!hasPermission('inquiries.manage')) return;
  if (!confirm('Are you sure you want to delete this message?')) return;

  const inquiries = loadAdminData(INQUIRIES_KEY, defaultInquiries);
  const inquiry = inquiries.find(item => item.id === id);
  if (!inquiry) return;

  saveAdminData(INQUIRIES_KEY, inquiries.filter(item => item.id !== id));
  logActivity('Deleted', inquiry.sender, `Message #${id} deleted.`);
  renderInquiries();
  showPageMessage('Message deleted successfully!');
}

// Connects non-record admin forms: appointment edit, reply, and settings.
function setupAdminPageForms() {
  const appointmentForm = document.getElementById('edit-appointment-form');
  const archiveAppointmentForm = document.getElementById('archive-appointment-form');
  const replyForm = document.getElementById('reply-message-form');

  if (appointmentForm) {
    const dateInput = appointmentForm.querySelector('[name="appointmentDate"]');
    const timeInput = appointmentForm.querySelector('[name="appointmentTime"]');
    const scheduleConfirmField = appointmentForm.querySelector('[name="scheduleConfirmation"]');
    const statusField = appointmentForm.querySelector('[name="status"]');
    const rescheduleInput = document.getElementById('reschedule-date');
    const rescheduleError = document.getElementById('reschedule-date-error');

    if (scheduleConfirmField) {
      scheduleConfirmField.addEventListener('change', () => {
        syncRescheduleDateField(appointmentForm);
        if (
          statusField &&
          (scheduleConfirmField.value === 'Confirmed on given date' || scheduleConfirmField.value === 'Rescheduled to new date') &&
          statusField.value === 'Pending'
        ) {
          statusField.value = 'Confirmed';
        }
        if (scheduleConfirmField.value === 'Rescheduled to new date' && rescheduleInput) {
          rescheduleInput.focus();
        }
      });
    }

    if (rescheduleInput) {
      const handleRescheduleDateChange = () => {
        validateRescheduleDateField(rescheduleInput, rescheduleError);
      };
      rescheduleInput.addEventListener('input', handleRescheduleDateChange);
      rescheduleInput.addEventListener('change', handleRescheduleDateChange);
    }

    appointmentForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!hasPermission('appointments.manage')) return;
      const scheduleConfirmation = scheduleConfirmField ? scheduleConfirmField.value : 'Pending schedule review';

      if (scheduleConfirmation === 'Rescheduled to new date') {
        const isRescheduleValid = validateRescheduleDateField(rescheduleInput, rescheduleError);
        if (!isRescheduleValid) {
          if (rescheduleInput) rescheduleInput.focus();
          return;
        }
      }

      const nextStatus = appointmentForm.querySelector('[name="status"]').value;
      const originalDate = dateInput ? dateInput.value : '';
      const originalTime = timeInput ? timeInput.value : '';
      const rescheduledDate = (scheduleConfirmation === 'Rescheduled to new date' && rescheduleInput)
        ? rescheduleInput.value.trim()
        : '';
      const emailStatus = appointmentForm.querySelector('[name="emailStatus"]')?.value || 'Not yet emailed';
      const adminNotes = appointmentForm.querySelector('[name="adminNotes"]')?.value.trim() || '';

      const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments).map(appointment => {
        if (appointment.id !== editingAppointmentId) return appointment;
        const baseOriginalDateTime = appointment.originalDateTime || appointment.dateTime;
        const effectiveDate = rescheduledDate || originalDate;
        const updatedDateTime = (effectiveDate && originalTime) ? `${effectiveDate}T${originalTime}` : baseOriginalDateTime;
        return {
          ...appointment,
          originalDateTime: baseOriginalDateTime,
          rescheduledDate: rescheduledDate || '',
          dateTime: updatedDateTime,
          status: nextStatus,
          statusModifiedByAdmin: true,
          scheduleConfirmation,
          emailStatus,
          adminNotes
        };
      });
      saveAdminData(APPOINTMENTS_KEY, appointments);
      closeModal(event, 'edit-appointment-modal');
      renderAppointments();
      renderArchivedAppointments();
      logActivity('Updated', `Appointment #${editingAppointmentId}`, `Appointment updated (${scheduleConfirmation}, ${emailStatus}).`);
      showPageMessage('Appointment updated successfully!');
    });
  }

  if (archiveAppointmentForm) {
    archiveAppointmentForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!hasPermission('appointments.manage')) return;

      const outcomeSelect = archiveAppointmentForm.querySelector('[name="appointmentOutcome"]');
      const handlerInput = archiveAppointmentForm.querySelector('[name="handledBy"]');
      const followUpSelect = archiveAppointmentForm.querySelector('[name="followUpNeeded"]');
      const notesInput = archiveAppointmentForm.querySelector('[name="archiveNotes"]');

      const outcome = outcomeSelect ? outcomeSelect.value.trim() : '';
      const handledBy = handlerInput ? handlerInput.value.trim() : '';
      const followUpNeeded = followUpSelect ? followUpSelect.value.trim() : '';
      const archiveNotes = notesInput ? notesInput.value.trim() : '';

      let hasError = false;
      const setFieldError = (field, errorId, message) => {
        const errorEl = document.getElementById(errorId);
        if (errorEl) errorEl.textContent = message;
        if (field) field.classList.toggle('input-invalid', Boolean(message));
        if (message) hasError = true;
      };

      setFieldError(outcomeSelect, 'archive-appt-outcome-error', outcome ? '' : 'Please select whether the appointment was completed.');
      setFieldError(handlerInput, 'archive-appt-handler-error', handledBy ? '' : 'Please enter who handled the appointment.');
      setFieldError(followUpSelect, 'archive-appt-followup-error', followUpNeeded ? '' : 'Please select a follow-up status.');
      setFieldError(notesInput, 'archive-appt-notes-error', archiveNotes ? '' : 'Please provide brief archive/completion notes.');

      if (hasError) return;

      const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments);
      const target = appointments.find(item => item.id === archivingAppointmentId);
      if (!target) return;

      saveAdminData(APPOINTMENTS_KEY, appointments.map(item => (
        item.id === archivingAppointmentId ? {
          ...item,
          status: 'Archived',
          archivedAt: new Date().toISOString(),
          appointmentOutcome: outcome,
          handledBy,
          followUpNeeded,
          archiveNotes
        } : item
      )));

      closeModal(event, 'archive-appointment-modal');
      logActivity('Archived', target.client, `Appointment #${archivingAppointmentId} archived (${outcome}).`);
      renderAppointments();
      renderArchivedAppointments();
      showPageMessage('Appointment archived successfully!');
    });
  }

  if (replyForm) {
    replyForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!hasPermission('inquiries.manage')) return;
      replyForm.reset();
      closeModal(event, 'view-message-modal');
      logActivity('Replied', `Message #${activeInquiryId}`, 'Reply sent to inquiry.');
      showPageMessage(`Reply sent successfully for message #${activeInquiryId}.`);
    });
  }

  setupSettingsNavigation();
  setupSettingsForms();
}

// Fills settings forms with the latest saved values.
function loadSettingsForms() {
  const currentAdmin = typeof getCurrentAdmin === 'function' ? getCurrentAdmin() : null;
  const settings = {
    ...defaultSettings,
    ...loadAdminData(SETTINGS_KEY, defaultSettings),
    ...(currentAdmin ? {
      adminName: currentAdmin.fullName || currentAdmin.name,
      adminEmail: currentAdmin.email
    } : {})
  };
  document.querySelectorAll('.settings-form').forEach(form => populateSettingsForm(form, settings));
}

function setupSettingsNavigation() {
  const navItems = document.querySelectorAll('[data-settings-target]');
  if (!navItems.length) return;

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(nav => nav.classList.remove('active'));
      document.querySelectorAll('.settings-panel').forEach(panel => panel.classList.remove('active'));
      item.classList.add('active');
      document.getElementById(item.dataset.settingsTarget)?.classList.add('active');
    });
  });
}

function setupSettingsForms() {
  document.querySelectorAll('.settings-form').forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!hasPermission('settings.manage')) return;
      if (form.id === 'account-settings-form' && !validateAccountSettingsForm(form)) return;

      const formValues = collectSettingsFormValues(form);
      const settings = { ...defaultSettings, ...loadAdminData(SETTINGS_KEY, defaultSettings) };
      saveAdminData(SETTINGS_KEY, { ...settings, ...formValues });

      if (form.id === 'account-settings-form' && typeof getCurrentAdmin === 'function') {
        const currentAdmin = getCurrentAdmin();
        if (currentAdmin) {
          const newPassword = form.querySelector('[name="adminPassword"]')?.value || '';
          const nextHash = newPassword && typeof hashPassword === 'function' ? await hashPassword(newPassword) : null;
          const updatedAdmins = getAdmins().map(admin => {
            if (admin.id !== currentAdmin.id) return admin;
            return {
              ...admin,
              fullName: formValues.adminName || admin.fullName,
              email: formValues.adminEmail || admin.email,
              ...(nextHash ? { passwordHash: nextHash } : {})
            };
          });
          saveAdmins(updatedAdmins);
        }
      }

      logActivity('Updated Settings', form.id || 'System Settings', 'System configuration settings updated.');
      form.querySelectorAll('input[type="password"]').forEach(input => { input.value = ''; });
      showPageMessage('Settings updated successfully!');
    });
  });
}

function collectSettingsFormValues(form) {
  const values = {};
  form.querySelectorAll('input[name], select[name], textarea[name]').forEach(input => {
    if (input.type === 'checkbox') {
      if (input.name === 'availableDays') {
        values.availableDays = Array.from(form.querySelectorAll('[name="availableDays"]:checked')).map(item => item.value);
      } else {
        values[input.name] = input.checked;
      }
      return;
    }
    if (input.type === 'password' && !input.value) return;
    values[input.name] = input.value.trim();
  });
  return values;
}

function populateSettingsForm(form, settings) {
  form.querySelectorAll('input[name], select[name], textarea[name]').forEach(input => {
    if (input.type === 'checkbox') {
      input.checked = input.name === 'availableDays'
        ? (settings.availableDays || []).includes(input.value)
        : Boolean(settings[input.name]);
      return;
    }
    if (input.type === 'password') return;
    input.value = settings[input.name] ?? '';
  });
}

function validateAccountSettingsForm(form) {
  const currentPassword = form.querySelector('[name="currentPassword"]');
  const newPassword = form.querySelector('[name="adminPassword"]');
  const confirmPassword = form.querySelector('[name="confirmPassword"]');
  const changingPassword = newPassword?.value || confirmPassword?.value;

  if (changingPassword && !currentPassword.value) {
    showPageMessage('Current password is required when changing password.');
    currentPassword.focus();
    return false;
  }
  if (newPassword.value !== confirmPassword.value) {
    showPageMessage('New password and confirm password must match.');
    confirmPassword.focus();
    return false;
  }
  return true;
}

// Initializes the page-specific admin behavior for whichever page is open.
document.addEventListener('DOMContentLoaded', () => {
  setupAppointmentFilters();
  renderAppointments();
  renderArchivedAppointments();
  renderInquiries();
  loadSettingsForms();
  setupAdminPageForms();
});
