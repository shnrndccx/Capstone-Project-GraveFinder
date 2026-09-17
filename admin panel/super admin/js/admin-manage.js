let editingAdminId = null;

// Collects values from the add/edit admin forms.
function getAdminFormValues(form) {
  return {
    email: form.querySelector('[name="adminEmail"]').value.trim(),
    role: form.querySelector('[name="adminRole"]').value
  };
}

// Draws the admin roster table from saved data.
function renderAdmins() {
  const table = document.querySelector('[data-admins-table]');
  if (!table) return;

  const admins = getAdmins();
  const tbody = table.querySelector('tbody');

  tbody.innerHTML = admins.map(admin => {
    const statusClass = admin.status === 'Active' ? 'status-confirmed' : 'status-pending';
    const toggleLabel = admin.status === 'Active' ? 'Deactivate' : 'Activate';

    return `
      <tr data-admin-id="${admin.id}">
        <td>${admin.email}</td>
        <td>${ROLE_LABELS[admin.role] || admin.role}</td>
        <td><span class="status-badge ${statusClass}">${admin.status}</span></td>
        <td>
          <button class="action-btn" type="button" onclick="startEditAdmin(${admin.id})">Edit</button>
          <button class="action-btn delete" type="button" onclick="toggleAdminStatus(${admin.id})">${toggleLabel}</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Opens the edit modal and fills it with the selected admin's data.
function startEditAdmin(id) {
  const admin = getAdmins().find(item => item.id === id);
  const form = document.getElementById('edit-admin-form');
  if (!admin || !form) return;

  editingAdminId = id;
  form.querySelector('[name="adminEmail"]').value = admin.email;
  form.querySelector('[name="adminPassword"]').value = '';
  form.querySelector('[name="adminRole"]').value = admin.role;
  openModal('edit-admin-modal');
}

// Flips an admin's status between Active and Inactive instead of deleting the account.
function toggleAdminStatus(id) {
  const admins = getAdmins();
  const admin = admins.find(item => item.id === id);
  if (!admin) return;

  const nextStatus = admin.status === 'Active' ? 'Inactive' : 'Active';
  if (!confirm(`Are you sure you want to set ${admin.email} to ${nextStatus.toLowerCase()}?`)) return;

  saveAdmins(admins.map(item => (item.id === id ? { ...item, status: nextStatus } : item)));
  renderAdmins();
  showAdminManageMessage(`${admin.email} is now ${nextStatus.toLowerCase()}.`);
}

// Shows a reusable notification modal, with alert as backup.
function showAdminManageMessage(message) {
  const messageText = document.getElementById('system-message-text');
  if (messageText) {
    messageText.innerText = message;
    openModal('system-message-modal');
  } else {
    alert(message);
  }
}

// Connects add/edit admin form submissions to the localStorage roster.
function setupAdminManageForms() {
  const addForm = document.getElementById('add-admin-form');
  const editForm = document.getElementById('edit-admin-form');

  if (addForm) {
    addForm.addEventListener('submit', event => {
      event.preventDefault();

      const admins = getAdmins();
      const values = getAdminFormValues(addForm);
      const password = addForm.querySelector('[name="adminPassword"]').value;

      if (admins.some(admin => admin.email.toLowerCase() === values.email.toLowerCase())) {
        showAdminManageMessage('An admin with that email already exists.');
        return;
      }

      const nextId = admins.length ? Math.max(...admins.map(admin => admin.id)) + 1 : 1;
      admins.push({ id: nextId, ...values, password, status: 'Active' });
      saveAdmins(admins);
      addForm.reset();
      closeModal(event, 'add-admin-modal');
      renderAdmins();
      showAdminManageMessage('Admin added successfully!');
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', event => {
      event.preventDefault();

      const values = getAdminFormValues(editForm);
      const newPassword = editForm.querySelector('[name="adminPassword"]').value;

      const admins = getAdmins().map(admin => {
        if (admin.id !== editingAdminId) return admin;
        return { ...admin, ...values, password: newPassword ? newPassword : admin.password };
      });

      saveAdmins(admins);
      closeModal(event, 'edit-admin-modal');
      renderAdmins();
      showAdminManageMessage('Admin updated successfully!');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderAdmins();
  setupAdminManageForms();
});
