const ADMINS_KEY = 'graveFinderAdmins';
const CURRENT_ADMIN_KEY = 'graveFinderCurrentAdmin';
const ACTIVITY_LOG_KEY = 'graveFinderActivityLog';

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  mid_admin: 'Mid Admin',
  low_admin: 'Low Admin'
};

// Capabilities each role is allowed to use. Checked with hasPermission().
const ROLE_PERMISSIONS = {
  super_admin: [
    'records.add', 'records.edit', 'records.archive', 'records.permanentDelete', 'records.viewArchived',
    'appointments.manage',
    'inquiries.manage',
    'activity.viewAll',
    'manageAdmins',
    'settings'
  ],
  mid_admin: [
    'records.add', 'records.edit', 'records.archive', 'records.viewArchived',
    'appointments.manage',
    'inquiries.manage',
    'activity.viewOwn'
  ],
  low_admin: [
    'inquiries.flagOnly'
  ]
};

// Starter roster: 1 Super Admin, 2 Mid Admins, 2 Low Admins.
const defaultAdmins = [
  { id: 1, email: 'super.admin@gardenofmemories.com', password: 'SuperAdmin123', role: 'super_admin', status: 'Active' },
  { id: 2, email: 'mid.admin1@gardenofmemories.com', password: 'MidAdmin123', role: 'mid_admin', status: 'Active' },
  { id: 3, email: 'mid.admin2@gardenofmemories.com', password: 'MidAdmin456', role: 'mid_admin', status: 'Active' },
  { id: 4, email: 'low.admin1@gardenofmemories.com', password: 'LowAdmin123', role: 'low_admin', status: 'Active' },
  { id: 5, email: 'low.admin2@gardenofmemories.com', password: 'LowAdmin456', role: 'low_admin', status: 'Active' }
];

// Loads the admin roster from localStorage, seeding it with starter accounts on first run.
function getAdmins() {
  const saved = localStorage.getItem(ADMINS_KEY);
  if (!saved) {
    saveAdmins(defaultAdmins);
    return [...defaultAdmins];
  }

  try {
    return JSON.parse(saved);
  } catch {
    saveAdmins(defaultAdmins);
    return [...defaultAdmins];
  }
}

// Saves the latest admin roster so changes persist after refresh.
function saveAdmins(admins) {
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
}

// Reads the currently logged-in admin for this browser tab/session.
function getCurrentAdmin() {
  try {
    return JSON.parse(sessionStorage.getItem(CURRENT_ADMIN_KEY));
  } catch {
    return null;
  }
}

// Remembers who is logged in for the rest of this session.
function setCurrentAdmin(admin) {
  sessionStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify({
    id: admin.id,
    email: admin.email,
    role: admin.role
  }));
}

// Clears the logged-in admin, used when logging out.
function clearCurrentAdmin() {
  sessionStorage.removeItem(CURRENT_ADMIN_KEY);
}

// Checks whether the logged-in admin's role includes the given capability.
function hasPermission(permission) {
  const currentAdmin = getCurrentAdmin();
  if (!currentAdmin) return false;
  return (ROLE_PERMISSIONS[currentAdmin.role] || []).includes(permission);
}

// Records an action into the shared activity log for accountability.
function logActivity(action, record, details) {
  const currentAdmin = getCurrentAdmin();
  const log = getActivityLog();

  log.unshift({
    timestamp: new Date().toISOString(),
    adminEmail: currentAdmin ? currentAdmin.email : 'Unknown',
    adminRole: currentAdmin ? currentAdmin.role : 'Unknown',
    action,
    record,
    details: details || ''
  });

  localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
}

// Reads the full activity log, most recent first.
function getActivityLog() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY)) || [];
  } catch {
    return [];
  }
}

// Hides sidebar items the current admin's role isn't allowed to use.
function applyRoleVisibility() {
  const currentAdmin = getCurrentAdmin();
  const role = currentAdmin ? currentAdmin.role : null;

  const manageAdminsLink = document.getElementById('manage-admins-link');
  if (manageAdminsLink && role !== 'super_admin') {
    manageAdminsLink.remove();
  }

  const superDashboardLink = document.getElementById('super-dashboard-link');
  if (superDashboardLink && role !== 'super_admin') {
    superDashboardLink.remove();
  }

  const midDashboardLink = document.getElementById('mid-dashboard-link');
  if (midDashboardLink && role !== 'mid_admin') {
    midDashboardLink.remove();
  }

  const lowDashboardLink = document.getElementById('low-dashboard-link');
  if (lowDashboardLink && role !== 'low_admin') {
    lowDashboardLink.remove();
  }

  // Hides any element declaring the permission(s) it requires via data-permission.
  // Multiple permissions can be comma-separated; the element stays if any of them match.
  document.querySelectorAll('[data-permission]').forEach(el => {
    const requiredPermissions = el.dataset.permission.split(',').map(permission => permission.trim());
    if (!requiredPermissions.some(permission => hasPermission(permission))) {
      el.remove();
    }
  });
}

// Sends admins away from pages that require a specific role, back to the shared dashboard.
function requireRole(role) {
  const currentAdmin = getCurrentAdmin();
  const homeHref = document.body.dataset.home || 'admin-login.html';
  if (!currentAdmin || currentAdmin.role !== role) {
    window.location.href = homeHref;
  }
}

// Sends non-super-admins away from pages that require the Super Admin role.
function requireSuperAdmin() {
  requireRole('super_admin');
}

// Sends admins away unless their role is in the allowed list (comma-separated).
function requireAnyRole(rolesCsv) {
  const currentAdmin = getCurrentAdmin();
  const allowedRoles = rolesCsv.split(',').map(role => role.trim());
  const homeHref = document.body.dataset.home || 'admin-login.html';
  if (!currentAdmin || !allowedRoles.includes(currentAdmin.role)) {
    window.location.href = homeHref;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyRoleVisibility();

  if (document.body.dataset.requiresSuperAdmin === 'true') {
    requireSuperAdmin();
  }

  if (document.body.dataset.requiresRole) {
    requireRole(document.body.dataset.requiresRole);
  }

  if (document.body.dataset.requiresAnyRole) {
    requireAnyRole(document.body.dataset.requiresAnyRole);
  }

  const logoutLink = document.getElementById('admin-logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', clearCurrentAdmin);
  }
});
