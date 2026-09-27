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
    status: 'Confirmed'
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
    status: 'Confirmed'
  },
  {
    id: 8,
    dateTime: '2026-10-08T10:30',
    client: 'Carla Mendoza',
    service: 'Family Plot Inquiry',
    contact: '+63 926 118 4402',
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
  parkHours: '6:00 AM - 6:00 PM Daily',
  officeHours: '8:00 AM - 5:00 PM',
  publicEmail: 'info@gardenofmemories.com',
  adminName: 'System Administrator',
  adminEmail: 'admin@gardenofmemories.com',
  adminPassword: ''
};

let editingAppointmentId = null;
let activeInquiryId = null;

function isAppointmentArchived(appointment) {
  if (['Completed', 'Archived', 'Done'].includes(appointment.status)) return true;
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
      if (missingFallbackItems.length) {
        const merged = [...parsed, ...missingFallbackItems];
        localStorage.setItem(key, JSON.stringify(merged));
        return merged;
      }
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

  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments).filter(appointment => !isAppointmentArchived(appointment));
  const tbody = table.querySelector('tbody');
  const canView = hasPermission('appointments.view');
  const canManage = hasPermission('appointments.manage');

  if (!canView) {
    tbody.innerHTML = '<tr><td colspan="6">You do not have permission to view appointments.</td></tr>';
    return;
  }

  tbody.innerHTML = appointments.map(appointment => {
    const statusClass = appointment.status === 'Confirmed' ? 'status-confirmed' : 'status-pending';
    let actions = '';

    if (canManage) {
      actions = `
        <button class="action-btn" type="button" onclick="startEditAppointment(${appointment.id})">Edit</button>
      `;
    }

    return `
      <tr>
        <td>${formatDateTime(appointment.dateTime)}</td>
        <td>${appointment.client}</td>
        <td>${appointment.service}</td>
        <td>${appointment.contact}</td>
        <td><span class="status-badge ${statusClass}">${appointment.status}</span></td>
        <td>${actions || 'View only'}</td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="6">No active appointments found.</td></tr>';
}

function renderArchivedAppointments() {
  const table = document.querySelector('[data-archived-appointments-table]');
  if (!table) return;

  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments).filter(isAppointmentArchived);
  const tbody = table.querySelector('tbody');
  const canView = hasPermission('appointments.view');

  if (!canView) {
    tbody.innerHTML = '<tr><td colspan="6">You do not have permission to view archived appointments.</td></tr>';
    return;
  }

  tbody.innerHTML = appointments.map(appointment => {
    const archivedAt = appointment.archivedAt || appointment.dateTime;
    return `
      <tr>
        <td>${formatDateTime(appointment.dateTime)}</td>
        <td>${appointment.client}</td>
        <td>${appointment.service}</td>
        <td>${appointment.contact}</td>
        <td><span class="status-badge status-read">${appointment.status || 'Completed'}</span></td>
        <td>${formatDateTime(archivedAt)}</td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="6">No archived appointments found.</td></tr>';
}

// Marks an appointment as confirmed.
function confirmAppointment(id) {
  if (!hasPermission('appointments.manage')) return;
  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments);
  const appointment = appointments.find(item => item.id === id);
  if (!appointment) return;

  saveAdminData(APPOINTMENTS_KEY, appointments.map(item => (
    item.id === id ? { ...item, status: 'Confirmed' } : item
  )));
  logActivity('Confirmed', appointment.client, `Appointment #${id} confirmed.`);
  renderAppointments();
  showPageMessage('Appointment confirmed successfully!');
}

// Opens the appointment edit modal with the selected schedule.
function startEditAppointment(id) {
  if (!hasPermission('appointments.manage')) return;
  const appointment = loadAdminData(APPOINTMENTS_KEY, defaultAppointments).find(item => item.id === id);
  const form = document.getElementById('edit-appointment-form');
  if (!appointment || !form) return;

  editingAppointmentId = id;
  form.querySelector('[name="dateTime"]').value = appointment.dateTime;
  openModal('edit-appointment-modal');
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
  const replyForm = document.getElementById('reply-message-form');
  const parkSettingsForm = document.getElementById('park-settings-form');
  const accountSettingsForm = document.getElementById('account-settings-form');

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!hasPermission('appointments.manage')) return;
      const nextDateTime = appointmentForm.querySelector('[name="dateTime"]').value;
      const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments).map(appointment => (
        appointment.id === editingAppointmentId ? { ...appointment, dateTime: nextDateTime } : appointment
      ));
      saveAdminData(APPOINTMENTS_KEY, appointments);
      closeModal(event, 'edit-appointment-modal');
      renderAppointments();
      logActivity('Updated', `Appointment #${editingAppointmentId}`, 'Appointment schedule updated.');
      showPageMessage('Appointment updated successfully!');
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

  if (parkSettingsForm) {
    parkSettingsForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!hasPermission('settings.manage')) return;
      const settings = loadAdminData(SETTINGS_KEY, defaultSettings);
      saveAdminData(SETTINGS_KEY, {
        ...settings,
        parkName: parkSettingsForm.querySelector('[name="parkName"]').value.trim(),
        parkHours: parkSettingsForm.querySelector('[name="parkHours"]').value.trim(),
        officeHours: parkSettingsForm.querySelector('[name="officeHours"]').value.trim(),
        publicEmail: parkSettingsForm.querySelector('[name="publicEmail"]').value.trim()
      });
      showPageMessage('Park details updated successfully!');
    });
  }

  if (accountSettingsForm) {
    accountSettingsForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!hasPermission('settings.manage')) return;
      const settings = loadAdminData(SETTINGS_KEY, defaultSettings);
      saveAdminData(SETTINGS_KEY, {
        ...settings,
        adminName: accountSettingsForm.querySelector('[name="adminName"]').value.trim(),
        adminEmail: accountSettingsForm.querySelector('[name="adminEmail"]').value.trim(),
        adminPassword: accountSettingsForm.querySelector('[name="adminPassword"]').value
      });
      accountSettingsForm.querySelector('[name="adminPassword"]').value = '';
      showPageMessage('Account credentials updated successfully!');
    });
  }
}

// Fills settings forms with the latest saved values.
function loadSettingsForms() {
  const settings = loadAdminData(SETTINGS_KEY, defaultSettings);
  const parkSettingsForm = document.getElementById('park-settings-form');
  const accountSettingsForm = document.getElementById('account-settings-form');

  if (parkSettingsForm) {
    parkSettingsForm.querySelector('[name="parkName"]').value = settings.parkName;
    parkSettingsForm.querySelector('[name="parkHours"]').value = settings.parkHours;
    parkSettingsForm.querySelector('[name="officeHours"]').value = settings.officeHours;
    parkSettingsForm.querySelector('[name="publicEmail"]').value = settings.publicEmail;
  }

  if (accountSettingsForm) {
    accountSettingsForm.querySelector('[name="adminName"]').value = settings.adminName;
    accountSettingsForm.querySelector('[name="adminEmail"]').value = settings.adminEmail;
  }
}

// Initializes the page-specific admin behavior for whichever page is open.
document.addEventListener('DOMContentLoaded', () => {
  renderAppointments();
  renderArchivedAppointments();
  renderInquiries();
  loadSettingsForms();
  setupAdminPageForms();
});
