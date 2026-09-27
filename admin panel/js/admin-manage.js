let editingAdminId = null;
let pendingRoleChange = null;
let pendingRemoveAccessId = null;
let adminToastTimer = null;

const LEGACY_SEED_PASSWORD_HASHES = {
  'super.admin@gardenofmemories.com': '0eeaa9fdda267f5bf6f0b4fe2fabb4133c1b8689d02832052fb90d129ea3093f',
  'mid.admin1@gardenofmemories.com': '94a8d58f5c3f9cf2b7d7ddbb3a01c282cff8d1c9b0a5f0fc6858b4965bdb4d69',
  'mid.admin2@gardenofmemories.com': 'a911d4a2a69d48271ac7d2211ca300384399d4872272e685eb3979dda9206e86',
  'low.admin1@gardenofmemories.com': 'fb4b91df54f0cbcbf01103ace154e8e4c123f7ff98191b403e88d8cdab885c75',
  'low.admin2@gardenofmemories.com': 'd1a2ce62f3c5991069aceeb3c4fe71c8c98f9aa13c2178b9991ce225de199ad8'
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

function adminDisplayName(admin) {
  return admin.fullName || admin.name || admin.email.split('@')[0].replace(/[._-]+/g, ' ');
}

function formatAdminDate(value) {
  if (!value) return 'Not recorded';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getAdminFormValues(form) {
  return {
    fullName: form.querySelector('[name="adminName"]').value.trim(),
    email: form.querySelector('[name="adminEmail"]').value.trim(),
    role: form.querySelector('[name="adminRole"]').value
  };
}

function canManageAdminRole(role) {
  return MANAGEABLE_ADMIN_ROLES.includes(role);
}

function showAdminManageMessage(message, isError = false) {
  const toast = document.getElementById('admin-toast');
  if (!toast) return;

  toast.textContent = message;
  toast.style.background = isError ? '#7d3333' : '';
  toast.classList.add('is-visible');
  clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function setAdminFieldError(input, message) {
  if (!input) return;
  const errorText = input.parentElement.querySelector('.field-error-text');
  input.setCustomValidity(message || '');
  input.classList.toggle('input-invalid', Boolean(message));
  if (errorText) errorText.textContent = message || '';
}

function validateAdminForm(form) {
  let isValid = true;
  const nameInput = form.querySelector('[name="adminName"]');
  const emailInput = form.querySelector('[name="adminEmail"]');
  const roleInput = form.querySelector('[name="adminRole"]');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameMessage = nameInput.value.trim() ? '' : 'Full name is required.';
  const emailMessage = emailPattern.test(emailInput.value.trim()) ? '' : 'Enter a valid email address.';
  const roleMessage = canManageAdminRole(roleInput.value) ? '' : 'Select Medium Admin or Low Admin.';

  setAdminFieldError(nameInput, nameMessage);
  setAdminFieldError(emailInput, emailMessage);
  setAdminFieldError(roleInput, roleMessage);

  if (nameMessage || emailMessage || roleMessage) isValid = false;
  return isValid;
}

function normalizedAdmins() {
  let changed = false;
  const admins = getAdmins().map(admin => {
    const normalized = { ...admin };

    if (!normalized.fullName) {
      normalized.fullName = adminDisplayName(normalized);
      changed = true;
    }

    if (!normalized.dateCreated) {
      normalized.dateCreated = new Date().toISOString();
      changed = true;
    }

    if (normalized.password && LEGACY_SEED_PASSWORD_HASHES[normalized.email.toLowerCase()]) {
      normalized.passwordHash = LEGACY_SEED_PASSWORD_HASHES[normalized.email.toLowerCase()];
      delete normalized.password;
      changed = true;
    } else if (normalized.password) {
      normalized.passwordSetupRequired = true;
      delete normalized.password;
      changed = true;
    }

    return normalized;
  });

  if (changed) saveAdmins(admins);
  return admins;
}

function adminMatchesFilters(admin) {
  const searchInput = document.getElementById('admin-search-input');
  const roleFilter = document.getElementById('admin-role-filter');
  const searchText = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const selectedRole = roleFilter ? roleFilter.value : '';

  if (admin.status === 'Removed') return false;
  if (selectedRole && admin.role !== selectedRole) return false;

  return [
    adminDisplayName(admin),
    admin.email,
    ROLE_LABELS[admin.role] || admin.role
  ].join(' ').toLowerCase().includes(searchText);
}

function renderAdmins() {
  const table = document.querySelector('[data-admins-table]');
  if (!table || !hasPermission('admins.manage')) return;

  const admins = normalizedAdmins().filter(adminMatchesFilters);
  const tbody = table.querySelector('tbody');

  tbody.innerHTML = admins.map(admin => {
    const actions = canManageAdminRole(admin.role)
      ? `
          <button class="action-btn" type="button" onclick="viewAdmin(${admin.id})">View</button>
          <button class="action-btn" type="button" onclick="startEditAdmin(${admin.id})">Edit</button>
          <button class="action-btn delete" type="button" onclick="startRemoveAccess(${admin.id})">Remove Access</button>
        `
      : `
          <button class="action-btn" type="button" onclick="viewAdmin(${admin.id})">View</button>
          <span>Protected</span>
        `;

    return `
      <tr data-admin-id="${admin.id}">
        <td>${escapeHtml(adminDisplayName(admin))}</td>
        <td>${escapeHtml(admin.email)}</td>
        <td>${escapeHtml(ROLE_LABELS[admin.role] || admin.role)}</td>
        <td>${escapeHtml(formatAdminDate(admin.dateCreated))}</td>
        <td>${actions}</td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="5">No administrator accounts found.</td></tr>';
}

function viewAdmin(id) {
  if (!hasPermission('admins.manage')) return;
  const admin = normalizedAdmins().find(item => item.id === id);
  if (!admin) return;

  document.getElementById('view-admin-name').textContent = adminDisplayName(admin);
  document.getElementById('view-admin-details').innerHTML = `
    <strong>Email:</strong> ${escapeHtml(admin.email)}<br>
    <strong>Role:</strong> ${escapeHtml(ROLE_LABELS[admin.role] || admin.role)}<br>
    <strong>Date Created:</strong> ${escapeHtml(formatAdminDate(admin.dateCreated))}<br>
    <strong>Account Setup:</strong> ${admin.passwordHash ? 'Password configured' : 'Pending secure password setup'}
  `;
  openModal('view-admin-modal');
}

function startEditAdmin(id) {
  if (!hasPermission('admins.manage')) return;
  const admin = normalizedAdmins().find(item => item.id === id);
  const form = document.getElementById('edit-admin-form');
  if (!admin || !form) return;
  if (!canManageAdminRole(admin.role)) {
    showAdminManageMessage('Super Admin accounts are protected and cannot be edited here.', true);
    return;
  }

  editingAdminId = id;
  form.querySelector('[name="adminName"]').value = adminDisplayName(admin);
  form.querySelector('[name="adminEmail"]').value = admin.email;
  form.querySelector('[name="adminRole"]').value = admin.role;
  openModal('edit-admin-modal');
}

function startRemoveAccess(id) {
  if (!hasPermission('admins.manage')) return;
  const admin = normalizedAdmins().find(item => item.id === id);
  if (!admin) return;
  if (!canManageAdminRole(admin.role)) {
    showAdminManageMessage('Super Admin accounts are protected and cannot be removed here.', true);
    return;
  }

  pendingRemoveAccessId = id;
  document.getElementById('remove-access-summary').textContent = `Remove administrator access for ${adminDisplayName(admin)} (${admin.email})?`;
  openModal('remove-access-modal');
}

function confirmRemoveAccess() {
  if (!hasPermission('admins.manage') || !pendingRemoveAccessId) return;
  const currentAdmin = getCurrentAdmin();
  const admins = normalizedAdmins();
  const admin = admins.find(item => item.id === pendingRemoveAccessId);
  if (!admin || !canManageAdminRole(admin.role)) return;

  const updatedAdmins = admins.map(item => (
    item.id === pendingRemoveAccessId
      ? {
          ...item,
          status: 'Removed',
          accessRemovedAt: new Date().toISOString(),
          accessRemovedBy: currentAdmin ? currentAdmin.email : 'Unknown'
        }
      : item
  ));

  saveAdmins(updatedAdmins);
  logActivity('Removed Access', adminDisplayName(admin), `${admin.email} no longer has administrator access.`);
  pendingRemoveAccessId = null;
  closeModal(null, 'remove-access-modal');
  renderAdmins();
  showAdminManageMessage('Administrator access removed.');
}

function applyAdminUpdate(id, values) {
  const admins = normalizedAdmins();
  const existing = admins.find(admin => admin.id === id);
  if (!existing || !canManageAdminRole(existing.role) || !canManageAdminRole(values.role)) return false;

  if (admins.some(admin => admin.id !== id && admin.status !== 'Removed' && admin.email.toLowerCase() === values.email.toLowerCase())) {
    showAdminManageMessage('An administrator with that email already exists.', true);
    return false;
  }

  const updatedAdmins = admins.map(admin => (
    admin.id === id ? { ...admin, ...values } : admin
  ));

  saveAdmins(updatedAdmins);
  const roleChanged = existing.role !== values.role;
  logActivity(
    roleChanged ? 'Changed Admin Role' : 'Updated Admin',
    values.fullName,
    roleChanged
      ? `${existing.email} changed from ${ROLE_LABELS[existing.role]} to ${ROLE_LABELS[values.role]}.`
      : `${values.email} administrator details updated.`
  );
  return true;
}

function confirmRoleChange() {
  if (!pendingRoleChange) return;

  if (applyAdminUpdate(pendingRoleChange.id, pendingRoleChange.values)) {
    pendingRoleChange = null;
    closeModal(null, 'role-change-modal');
    closeModal(null, 'edit-admin-modal');
    renderAdmins();
    showAdminManageMessage('Administrator role updated.');
  }
}

function setupAdminManageForms() {
  const addForm = document.getElementById('add-admin-form');
  const editForm = document.getElementById('edit-admin-form');
  const searchInput = document.getElementById('admin-search-input');
  const roleFilter = document.getElementById('admin-role-filter');

  if (searchInput) searchInput.addEventListener('input', renderAdmins);
  if (roleFilter) roleFilter.addEventListener('change', renderAdmins);

  if (addForm) {
    addForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!hasPermission('admins.manage')) return;
      if (!validateAdminForm(addForm)) {
        showAdminManageMessage('Please complete all required administrator fields.', true);
        return;
      }

      const admins = normalizedAdmins();
      const values = getAdminFormValues(addForm);

      if (admins.some(admin => admin.status !== 'Removed' && admin.email.toLowerCase() === values.email.toLowerCase())) {
        showAdminManageMessage('An administrator with that email already exists.', true);
        return;
      }

      const nextId = admins.length ? Math.max(...admins.map(admin => admin.id)) + 1 : 1;
      const newAdmin = {
        id: nextId,
        ...values,
        status: 'Active',
        dateCreated: new Date().toISOString(),
        passwordSetupRequired: true
      };

      saveAdmins([...admins, newAdmin]);
      addForm.reset();
      closeModal(event, 'add-admin-modal');
      renderAdmins();
      logActivity('Created Admin', values.fullName, `${values.email} created as ${ROLE_LABELS[values.role]}. Pending secure password setup.`);
      showAdminManageMessage('Administrator account created. Password setup still requires a secure backend invitation flow.');
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!hasPermission('admins.manage')) return;
      if (!validateAdminForm(editForm)) {
        showAdminManageMessage('Please complete all required administrator fields.', true);
        return;
      }

      const admins = normalizedAdmins();
      const currentAdmin = admins.find(admin => admin.id === editingAdminId);
      const values = getAdminFormValues(editForm);
      if (!currentAdmin || !canManageAdminRole(currentAdmin.role) || !canManageAdminRole(values.role)) {
        showAdminManageMessage('You can only manage Medium and Low Admin accounts.', true);
        return;
      }

      if (currentAdmin.role !== values.role) {
        pendingRoleChange = { id: editingAdminId, values };
        document.getElementById('role-change-summary').textContent = `Change ${adminDisplayName(currentAdmin)} from ${ROLE_LABELS[currentAdmin.role]} to ${ROLE_LABELS[values.role]}?`;
        openModal('role-change-modal');
        return;
      }

      if (applyAdminUpdate(editingAdminId, values)) {
        closeModal(event, 'edit-admin-modal');
        renderAdmins();
        showAdminManageMessage('Administrator details updated.');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderAdmins();
  setupAdminManageForms();
});
