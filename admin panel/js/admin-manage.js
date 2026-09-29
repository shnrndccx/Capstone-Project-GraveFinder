let editingAdminId = null;
let pendingRoleChange = null;
let pendingStatusChange = null;
let adminToastTimer = null;

const LEGACY_SEED_PASSWORD_HASHES = {
  'super.admin@gardenofmemories.com': '0eeaa9fdda267f5bf6f0b4fe2fabb4133c1b8689d02832052fb90d129ea3093f',
  'mid.admin1@gardenofmemories.com': '94a8d58f5c3f9cf2b7d7ddbb3a01c282cff8d1c9b0a5f0fc6858b4965bdb4d69',
  'mid.admin2@gardenofmemories.com': 'a911d4a2a69d48271ac7d2211ca300384399d4872272e685eb3979dda9206e86',
  'low.admin1@gardenofmemories.com': 'fb4b91df54f0cbcbf01103ace154e8e4c123f7ff98191b403e88d8cdab885c75',
  'low.admin2@gardenofmemories.com': 'd1a2ce62f3c5991069aceeb3c4fe71c8c98f9aa13c2178b9991ce225de199ad8'
};

const ROLE_DESCRIPTIONS = {
  mid_admin: 'Default access: Burial Records (View/Add/Edit/Archive), Cemetery Map, and Appointments (View/Manage).',
  low_admin: 'Default access: View Burial Records and View Appointments.'
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

function adminStatus(admin) {
  if (admin.status === 'Removed') return 'Deactivated';
  if (admin.passwordSetupRequired && !admin.passwordHash && admin.status !== 'Deactivated') return 'Pending';
  return admin.status || 'Active';
}

function formatAdminDate(value, fallback = 'Not recorded') {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatAdminShortDate(value, fallback = 'Not recorded') {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function renderPermissionsChecklists() {
  document.querySelectorAll('[data-permissions-checklist]').forEach(container => {
    container.innerHTML = CUSTOMIZABLE_PERMISSIONS.map(item => `
      <label class="admin-perm-item">
        <input type="checkbox" name="adminPermissionGroup" value="${item.id}">
        <span class="admin-perm-copy">
          <strong>${escapeHtml(item.label)}</strong>
          <small>${escapeHtml(item.desc)}</small>
        </span>
      </label>
    `).join('');

    container.querySelectorAll('input[name="adminPermissionGroup"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const permDef = CUSTOMIZABLE_PERMISSIONS.find(item => item.id === checkbox.value);
        if (checkbox.checked && permDef?.requires) {
          if (permDef.requires.includes('records.view')) {
            const viewBox = container.querySelector('input[value="records_view"]');
            if (viewBox) viewBox.checked = true;
          }
          if (permDef.requires.includes('appointments.view')) {
            const viewBox = container.querySelector('input[value="appointments_view"]');
            if (viewBox) viewBox.checked = true;
          }
        }
        if (!checkbox.checked) {
          if (checkbox.value === 'records_view') {
            const editBox = container.querySelector('input[value="records_edit"]');
            const archiveBox = container.querySelector('input[value="records_archive"]');
            if (editBox) editBox.checked = false;
            if (archiveBox) archiveBox.checked = false;
          }
          if (checkbox.value === 'appointments_view') {
            const manageBox = container.querySelector('input[value="appointments_manage"]');
            if (manageBox) manageBox.checked = false;
          }
        }
      });
    });
  });
}

function setFormPermissions(form, permissionList) {
  if (!form) return;
  const activeSet = new Set(permissionList || []);
  form.querySelectorAll('input[name="adminPermissionGroup"]').forEach(checkbox => {
    const permDef = CUSTOMIZABLE_PERMISSIONS.find(item => item.id === checkbox.value);
    if (!permDef) return;
    checkbox.checked = permDef.keys.every(key => activeSet.has(key));
  });
}

function getFormPermissions(form) {
  if (!form) return ['dashboard'];
  const granted = new Set();
  form.querySelectorAll('input[name="adminPermissionGroup"]:checked').forEach(checkbox => {
    const permDef = CUSTOMIZABLE_PERMISSIONS.find(item => item.id === checkbox.value);
    if (!permDef) return;
    permDef.keys.forEach(key => granted.add(key));
    (permDef.requires || []).forEach(key => granted.add(key));
  });
  if (!granted.size) {
    granted.add('dashboard');
  }
  return [...granted];
}

function resetFormPermissionsToRole(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const role = form.querySelector('[name="adminRole"]')?.value || 'low_admin';
  setFormPermissions(form, ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.low_admin);
}

function getAdminFormValues(form) {
  const statusSelect = form.querySelector('[name="adminStatus"]');
  const values = {
    fullName: form.querySelector('[name="adminName"]').value.trim(),
    email: form.querySelector('[name="adminEmail"]').value.trim(),
    role: form.querySelector('[name="adminRole"]').value,
    permissions: getFormPermissions(form)
  };
  if (statusSelect && statusSelect.value) {
    values.status = statusSelect.value;
  }
  return values;
}

function canManageAdminRole(role) {
  return MANAGEABLE_ADMIN_ROLES.includes(role);
}

function isPrimarySuperAdmin(admin) {
  return admin.role === 'super_admin' || admin.id === 1;
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
    if (!normalized.status || normalized.status === 'Removed') {
      normalized.status = normalized.status === 'Removed' ? 'Deactivated' : 'Active';
      changed = true;
    }
    if (!normalized.lastLogin && normalized.role === 'super_admin') {
      normalized.lastLogin = '2026-09-29T00:00:00.000Z';
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
  const statusFilter = document.getElementById('admin-status-filter');
  const searchText = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const selectedRole = roleFilter ? roleFilter.value : '';
  const selectedStatus = statusFilter ? statusFilter.value : '';
  if (selectedRole && admin.role !== selectedRole) return false;
  if (selectedStatus && adminStatus(admin) !== selectedStatus) return false;
  return [adminDisplayName(admin), admin.email, ROLE_LABELS[admin.role] || admin.role, adminStatus(admin)].join(' ').toLowerCase().includes(searchText);
}

function clearAdminFilters() {
  const searchInput = document.getElementById('admin-search-input');
  const roleFilter = document.getElementById('admin-role-filter');
  const statusFilter = document.getElementById('admin-status-filter');
  if (searchInput) searchInput.value = '';
  if (roleFilter) roleFilter.value = '';
  if (statusFilter) statusFilter.value = '';
  renderAdmins();
}

function renderAdminSummary(admins) {
  const counts = {
    total: admins.length,
    super_admin: admins.filter(admin => admin.role === 'super_admin').length,
    mid_admin: admins.filter(admin => admin.role === 'mid_admin').length,
    low_admin: admins.filter(admin => admin.role === 'low_admin').length
  };
  Object.entries(counts).forEach(([key, value]) => {
    const target = document.querySelector(`[data-admin-summary="${key}"]`);
    if (target) target.textContent = value;
  });
}

function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-');
}

function renderActionButtons(admin) {
  return `
    <div class="admin-row-actions">
      <button class="action-btn" type="button" onclick="viewAdmin(${admin.id})">View</button>
    </div>
  `;
}

function renderAdmins() {
  const table = document.querySelector('[data-admins-table]');
  if (!table || !hasPermission('admins.manage')) return;
  const allAdmins = normalizedAdmins();
  const admins = allAdmins.filter(adminMatchesFilters);
  const tbody = table.querySelector('tbody');
  renderAdminSummary(allAdmins);

  tbody.innerHTML = admins.map(admin => {
    const status = adminStatus(admin);
    return `
      <tr data-admin-id="${admin.id}">
        <td>${escapeHtml(adminDisplayName(admin))}</td>
        <td>${escapeHtml(admin.email)}</td>
        <td>${escapeHtml(ROLE_LABELS[admin.role] || admin.role)}</td>
        <td><span class="status-badge status-${statusClass(status)}">${escapeHtml(status)}</span></td>
        <td>${escapeHtml(formatAdminShortDate(admin.lastLogin, 'Never'))}</td>
        <td>${escapeHtml(formatAdminShortDate(admin.dateCreated))}</td>
        <td>${renderActionButtons(admin)}</td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="7">No administrator accounts found.</td></tr>';
}

function viewAdmin(id) {
  if (!hasPermission('admins.manage')) return;
  const admin = normalizedAdmins().find(item => item.id === id);
  if (!admin) return;
  const status = adminStatus(admin);
  const effectivePerms = new Set(getEffectiveAdminPermissions(admin));
  const grantedLabels = admin.role === 'super_admin'
    ? ['All System Features & Super Admin Controls']
    : CUSTOMIZABLE_PERMISSIONS
      .filter(item => item.keys.every(key => effectivePerms.has(key)))
      .map(item => item.label);

  document.getElementById('view-admin-status').textContent = status;
  document.getElementById('view-admin-status').className = `status-badge status-${statusClass(status)}`;
  document.getElementById('view-admin-name').textContent = adminDisplayName(admin);
  document.getElementById('view-admin-role').textContent = ROLE_LABELS[admin.role] || admin.role;
  document.getElementById('view-admin-details').innerHTML = `
    <section class="archive-summary-card">
      <div class="archive-summary-header">
        <span>Account Information</span>
        <strong>#${escapeHtml(admin.id)}</strong>
      </div>
      <div class="archive-summary-grid">
        <div><span>Email Address</span><strong>${escapeHtml(admin.email)}</strong></div>
        <div><span>Role</span><strong>${escapeHtml(ROLE_LABELS[admin.role] || admin.role)}</strong></div>
        <div><span>Date Created</span><strong>${escapeHtml(formatAdminDate(admin.dateCreated))}</strong></div>
        <div><span>Last Login</span><strong>${escapeHtml(formatAdminDate(admin.lastLogin, 'Never'))}</strong></div>
      </div>
    </section>
    <section class="archive-summary-card">
      <div class="archive-summary-header">
        <span>Access Powers &amp; Permissions</span>
        <strong>${grantedLabels.length} Active</strong>
      </div>
      <div class="admin-perm-tags">
        ${grantedLabels.map(label => `<span class="admin-perm-tag">${escapeHtml(label)}</span>`).join('') || '<span>No permissions assigned</span>'}
      </div>
    </section>
  `;

  const footer = document.getElementById('view-admin-footer');
  if (footer) {
    footer.innerHTML = isPrimarySuperAdmin(admin)
      ? `<button type="button" class="action-btn" onclick="closeModal(event, 'view-admin-modal')">Close</button>`
      : `
        <button type="button" class="action-btn" onclick="closeModal(event, 'view-admin-modal')">Close</button>
        <button type="button" class="submit-btn" onclick="closeModal(event, 'view-admin-modal'); startEditAdmin(${admin.id});">Edit Permissions</button>
      `;
  }

  openModal('view-admin-modal');
}

function startEditAdmin(id) {
  if (!hasPermission('admins.manage')) return;
  const admin = normalizedAdmins().find(item => item.id === id);
  const form = document.getElementById('edit-admin-form');
  if (!admin || !form) return;
  if (isPrimarySuperAdmin(admin)) {
    showAdminManageMessage('The primary Super Admin account is protected and cannot be edited here.', true);
    return;
  }
  editingAdminId = id;
  form.querySelectorAll('.field-error-text').forEach(el => { el.textContent = ''; });
  form.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid'));
  form.querySelector('[name="adminName"]').value = adminDisplayName(admin);
  form.querySelector('[name="adminEmail"]').value = admin.email;
  form.querySelector('[name="adminRole"]').value = admin.role;
  const statusSelect = form.querySelector('[name="adminStatus"]');
  if (statusSelect) statusSelect.value = adminStatus(admin);
  updateRoleDescription(form.querySelector('[name="adminRole"]'));
  setFormPermissions(form, getEffectiveAdminPermissions(admin));
  openModal('edit-admin-modal');
}

function startAccountStatusChange(id, nextStatus) {
  if (!hasPermission('admins.manage')) return;
  const admin = normalizedAdmins().find(item => item.id === id);
  if (!admin) return;
  if (isPrimarySuperAdmin(admin)) {
    showAdminManageMessage('The primary Super Admin account is protected and cannot be deactivated.', true);
    return;
  }
  pendingStatusChange = { id, nextStatus };
  const isDeactivate = nextStatus === 'Deactivated';
  document.getElementById('account-status-title').innerHTML = isDeactivate ? 'Confirm deactivation' : 'Confirm reactivation';
  document.getElementById('account-status-summary').textContent = isDeactivate
    ? `Deactivate ${adminDisplayName(admin)} (${admin.email})? This account will immediately lose admin access on its next permission check.`
    : `Reactivate ${adminDisplayName(admin)} (${admin.email}) and restore admin access?`;
  document.getElementById('account-status-confirm-btn').textContent = isDeactivate ? 'Deactivate Account' : 'Reactivate Account';
  openModal('account-status-modal');
}

function confirmAccountStatusChange() {
  if (!hasPermission('admins.manage') || !pendingStatusChange) return;
  const currentAdmin = getCurrentAdmin();
  const admins = normalizedAdmins();
  const admin = admins.find(item => item.id === pendingStatusChange.id);
  if (!admin || isPrimarySuperAdmin(admin)) return;
  const now = new Date().toISOString();
  const updatedAdmins = admins.map(item => (
    item.id === pendingStatusChange.id
      ? { ...item, status: pendingStatusChange.nextStatus, statusChangedAt: now, statusChangedBy: currentAdmin ? currentAdmin.email : 'Unknown' }
      : item
  ));
  saveAdmins(updatedAdmins);
  const action = pendingStatusChange.nextStatus === 'Deactivated' ? 'Deactivated Admin' : 'Reactivated Admin';
  logActivity(action, adminDisplayName(admin), `${admin.email} status changed to ${pendingStatusChange.nextStatus}.`);
  if (currentAdmin && currentAdmin.id === admin.id && pendingStatusChange.nextStatus === 'Deactivated') clearCurrentAdmin();
  pendingStatusChange = null;
  closeModal(null, 'account-status-modal');
  renderAdmins();
  showAdminManageMessage('Administrator account status updated.');
}

function applyAdminUpdate(id, values) {
  const admins = normalizedAdmins();
  const existing = admins.find(admin => admin.id === id);
  if (!existing || isPrimarySuperAdmin(existing) || !canManageAdminRole(values.role)) return false;
  if (admins.some(admin => admin.id !== id && adminStatus(admin) !== 'Deactivated' && admin.email.toLowerCase() === values.email.toLowerCase())) {
    showAdminManageMessage('An administrator with that email already exists.', true);
    return false;
  }
  saveAdmins(admins.map(admin => (admin.id === id ? { ...admin, ...values } : admin)));
  const roleChanged = existing.role !== values.role;
  logActivity(
    roleChanged ? 'Changed Admin Role' : 'Updated Admin',
    values.fullName,
    roleChanged
      ? `${existing.email} changed from ${ROLE_LABELS[existing.role]} to ${ROLE_LABELS[values.role]} with updated permissions.`
      : `${values.email} administrator details and permissions updated.`
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
    showAdminManageMessage('Administrator role and permissions updated.');
  }
}

function updateRoleDescription(select) {
  if (!select) return;
  const description = select.parentElement.querySelector('[data-role-description]');
  if (description) description.textContent = ROLE_DESCRIPTIONS[select.value] || '';
}

function setupRoleDescriptions() {
  document.querySelectorAll('[name="adminRole"]').forEach(select => {
    updateRoleDescription(select);
    select.addEventListener('change', () => {
      updateRoleDescription(select);
      const form = select.closest('form');
      if (form && ROLE_PERMISSIONS[select.value]) {
        setFormPermissions(form, ROLE_PERMISSIONS[select.value]);
      }
    });
  });
}

function setupAdminManageForms() {
  const addForm = document.getElementById('add-admin-form');
  const editForm = document.getElementById('edit-admin-form');
  const searchInput = document.getElementById('admin-search-input');
  const roleFilter = document.getElementById('admin-role-filter');
  const statusFilter = document.getElementById('admin-status-filter');
  if (searchInput) searchInput.addEventListener('input', renderAdmins);
  if (roleFilter) roleFilter.addEventListener('change', renderAdmins);
  if (statusFilter) statusFilter.addEventListener('change', renderAdmins);

  if (addForm) {
    setFormPermissions(addForm, ROLE_PERMISSIONS.mid_admin);
    addForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!hasPermission('admins.manage')) return;
      if (!validateAdminForm(addForm)) {
        showAdminManageMessage('Please complete all required administrator fields.', true);
        return;
      }
      const admins = normalizedAdmins();
      const values = getAdminFormValues(addForm);
      if (admins.some(admin => adminStatus(admin) !== 'Deactivated' && admin.email.toLowerCase() === values.email.toLowerCase())) {
        showAdminManageMessage('An administrator with that email already exists.', true);
        return;
      }
      const nextId = admins.length ? Math.max(...admins.map(admin => admin.id)) + 1 : 1;
      const newAdmin = {
        id: nextId,
        ...values,
        status: 'Pending',
        dateCreated: new Date().toISOString(),
        passwordSetupRequired: true
      };
      saveAdmins([...admins, newAdmin]);
      addForm.reset();
      updateRoleDescription(addForm.querySelector('[name="adminRole"]'));
      setFormPermissions(addForm, ROLE_PERMISSIONS.mid_admin);
      closeModal(event, 'add-admin-modal');
      renderAdmins();
      logActivity('Created Admin', values.fullName, `${values.email} created as ${ROLE_LABELS[values.role]}.`);
      showAdminManageMessage('Administrator account created with selected permissions.');
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
      if (!currentAdmin || isPrimarySuperAdmin(currentAdmin) || !canManageAdminRole(values.role)) {
        showAdminManageMessage('You can only manage Medium and Low Admin accounts.', true);
        return;
      }
      if (currentAdmin.role !== values.role) {
        pendingRoleChange = { id: editingAdminId, values };
        document.getElementById('role-change-summary').textContent = `Change ${adminDisplayName(currentAdmin)} from ${ROLE_LABELS[currentAdmin.role]} to ${ROLE_LABELS[values.role]} and apply the selected permissions?`;
        openModal('role-change-modal');
        return;
      }
      if (applyAdminUpdate(editingAdminId, values)) {
        closeModal(event, 'edit-admin-modal');
        renderAdmins();
        showAdminManageMessage('Administrator details and permissions updated.');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderPermissionsChecklists();
  renderAdmins();
  setupRoleDescriptions();
  setupAdminManageForms();
});
