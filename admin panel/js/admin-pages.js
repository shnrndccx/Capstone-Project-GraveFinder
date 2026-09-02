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

// Reads an array/object from localStorage, then seeds it with starter data if empty.
function loadAdminData(key, fallback) {
  const saved = localStorage.getItem(key);
  if (!saved) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return Array.isArray(fallback) ? [...fallback] : { ...fallback };
  }

  try {
    return JSON.parse(saved);
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

  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments);
  const tbody = table.querySelector('tbody');

  tbody.innerHTML = appointments.map(appointment => {
    const statusClass = appointment.status === 'Confirmed' ? 'status-confirmed' : 'status-pending';
    const confirmButton = appointment.status === 'Pending'
      ? `<button class="action-btn" type="button" onclick="confirmAppointment(${appointment.id})">Confirm</button>`
      : '';

    return `
      <tr>
        <td>${formatDateTime(appointment.dateTime)}</td>
        <td>${appointment.client}</td>
        <td>${appointment.service}</td>
        <td>${appointment.contact}</td>
        <td><span class="status-badge ${statusClass}">${appointment.status}</span></td>
        <td>
          ${confirmButton}
          <button class="action-btn" type="button" onclick="startEditAppointment(${appointment.id})">Edit</button>
          <button class="action-btn delete" type="button" onclick="cancelAppointment(${appointment.id})">Cancel</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Marks an appointment as confirmed.
function confirmAppointment(id) {
  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments).map(appointment => (
    appointment.id === id ? { ...appointment, status: 'Confirmed' } : appointment
  ));
  saveAdminData(APPOINTMENTS_KEY, appointments);
  renderAppointments();
  showPageMessage('Appointment confirmed successfully!');
}

// Opens the appointment edit modal with the selected schedule.
function startEditAppointment(id) {
  const appointment = loadAdminData(APPOINTMENTS_KEY, defaultAppointments).find(item => item.id === id);
  const form = document.getElementById('edit-appointment-form');
  if (!appointment || !form) return;

  editingAppointmentId = id;
  form.querySelector('[name="dateTime"]').value = appointment.dateTime;
  openModal('edit-appointment-modal');
}

// Removes a cancelled appointment from the saved list.
function cancelAppointment(id) {
  if (!confirm('Are you sure you want to cancel this appointment?')) return;

  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments).filter(appointment => appointment.id !== id);
  saveAdminData(APPOINTMENTS_KEY, appointments);
  renderAppointments();
  showPageMessage('Appointment cancelled successfully!');
}

// Draws the inquiries table from saved inquiry data.
function renderInquiries() {
  const table = document.querySelector('[data-inquiries-table]');
  if (!table) return;

  const inquiries = loadAdminData(INQUIRIES_KEY, defaultInquiries);
  const tbody = table.querySelector('tbody');

  tbody.innerHTML = inquiries.map(inquiry => {
    const statusClass = inquiry.status === 'New' ? 'status-new' : 'status-read';

    return `
      <tr>
        <td>${formatDateTime(inquiry.receivedAt)}</td>
        <td>${inquiry.sender}<br><small>${inquiry.email}</small></td>
        <td>${inquiry.subject}</td>
        <td><span class="status-badge ${statusClass}">${inquiry.status}</span></td>
        <td>
          <button class="action-btn" type="button" onclick="openMessageModal(${inquiry.id})">View & Reply</button>
          <button class="action-btn delete" type="button" onclick="deleteInquiry(${inquiry.id})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
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

  saveAdminData(INQUIRIES_KEY, inquiries.map(item => (
    item.id === id ? { ...item, status: 'Read' } : item
  )));
  renderInquiries();
  openModal('view-message-modal');
}

// Deletes an inquiry from the inbox.
function deleteInquiry(id) {
  if (!confirm('Are you sure you want to delete this message?')) return;

  const inquiries = loadAdminData(INQUIRIES_KEY, defaultInquiries).filter(inquiry => inquiry.id !== id);
  saveAdminData(INQUIRIES_KEY, inquiries);
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
      const nextDateTime = appointmentForm.querySelector('[name="dateTime"]').value;
      const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments).map(appointment => (
        appointment.id === editingAppointmentId ? { ...appointment, dateTime: nextDateTime } : appointment
      ));
      saveAdminData(APPOINTMENTS_KEY, appointments);
      closeModal(event, 'edit-appointment-modal');
      renderAppointments();
      showPageMessage('Appointment updated successfully!');
    });
  }

  if (replyForm) {
    replyForm.addEventListener('submit', event => {
      event.preventDefault();
      replyForm.reset();
      closeModal(event, 'view-message-modal');
      showPageMessage(`Reply sent successfully for message #${activeInquiryId}.`);
    });
  }

  if (parkSettingsForm) {
    parkSettingsForm.addEventListener('submit', event => {
      event.preventDefault();
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
  renderInquiries();
  loadSettingsForms();
  setupAdminPageForms();
});
