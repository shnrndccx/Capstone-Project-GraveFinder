const ADMINS_KEY = 'graveFinderAdmins';
const CURRENT_ADMIN_KEY = 'graveFinderCurrentAdmin';
const ACTIVITY_LOG_KEY = 'graveFinderActivityLog';

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  mid_admin: 'Medium Admin',
  low_admin: 'Low Admin'
};

// Capabilities each role is allowed to use. Checked with hasPermission().
const ROLE_PERMISSIONS = {
  super_admin: [
    'dashboard',
    'records.view', 'records.search', 'records.add', 'records.edit', 'records.archive', 'records.restore',
    'map.manage',
    'appointments.view', 'appointments.manage',
    'inquiries.view', 'inquiries.manage',
    'admins.manage',
    'activity.view',
    'settings.manage'
  ],
  mid_admin: [
    'dashboard',
    'records.view', 'records.search', 'records.add', 'records.edit',
    'map.manage',
    'appointments.view', 'appointments.manage',
    'inquiries.view', 'inquiries.manage'
  ],
  low_admin: [
    'dashboard',
    'records.view', 'records.search',
    'appointments.view',
    'inquiries.view'
  ]
};

const ROLE_DEFAULT_PAGE = {
  super_admin: 'admin-dashboard.html',
  mid_admin: 'admin-dashboard.html',
  low_admin: 'admin-dashboard.html'
};

const MANAGEABLE_ADMIN_ROLES = ['mid_admin', 'low_admin'];
const SIDEBAR_COLLAPSE_DELAY = 30000;
const SIDEBAR_ICONS = {
  'admin-dashboard.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h4A1.5 1.5 0 0 1 11 5.5v4A1.5 1.5 0 0 1 9.5 11h-4A1.5 1.5 0 0 1 4 9.5z"></path><path d="M13 5.5A1.5 1.5 0 0 1 14.5 4h4A1.5 1.5 0 0 1 20 5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 13 9.5z"></path><path d="M4 14.5A1.5 1.5 0 0 1 5.5 13h4a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 9.5 20h-4A1.5 1.5 0 0 1 4 18.5z"></path><path d="M13 14.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5z"></path></svg>',
  'admin-records.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="7" ry="3"></ellipse><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"></path><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"></path></svg>',
  'admin-map.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>',
  'admin-appointments.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4"></path><path d="M16 3v4"></path><path d="M4 10h16"></path><path d="M9 15l2 2 4-4"></path></svg>',
  'admin-appointments-archive.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4"></path><path d="M16 3v4"></path><path d="M4 10h16"></path><path d="M8 15h8"></path><path d="M8 18h5"></path></svg>',
  'admin-manage.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5"></circle><path d="M3.5 20a5.5 5.5 0 0 1 11 0"></path><path d="M17 8h4"></path><path d="M19 6v4"></path><path d="M17 15.5h4"></path></svg>',
  'admin-activity.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.35-5.65"></path><path d="M4 5v5h5"></path><path d="M12 8v5l3 2"></path></svg>',
  'admin-settings.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M12 3v3"></path><path d="M12 18v3"></path><path d="M3 12h3"></path><path d="M18 12h3"></path><path d="M5.6 5.6l2.1 2.1"></path><path d="M16.3 16.3l2.1 2.1"></path><path d="M18.4 5.6l-2.1 2.1"></path><path d="M7.7 16.3l-2.1 2.1"></path></svg>'
};

// Starter roster: 1 Super Admin, 2 Mid Admins, 2 Low Admins.
const defaultAdmins = [
  { id: 1, fullName: 'Super Administrator', email: 'super.admin@gardenofmemories.com', passwordHash: '0eeaa9fdda267f5bf6f0b4fe2fabb4133c1b8689d02832052fb90d129ea3093f', role: 'super_admin', status: 'Active', dateCreated: '2026-09-18T00:00:00.000Z' },
  { id: 2, fullName: 'Medium Admin One', email: 'mid.admin1@gardenofmemories.com', passwordHash: '94a8d58f5c3f9cf2b7d7ddbb3a01c282cff8d1c9b0a5f0fc6858b4965bdb4d69', role: 'mid_admin', status: 'Active', dateCreated: '2026-09-18T00:00:00.000Z' },
  { id: 3, fullName: 'Medium Admin Two', email: 'mid.admin2@gardenofmemories.com', passwordHash: 'a911d4a2a69d48271ac7d2211ca300384399d4872272e685eb3979dda9206e86', role: 'mid_admin', status: 'Active', dateCreated: '2026-09-18T00:00:00.000Z' },
  { id: 4, fullName: 'Low Admin One', email: 'low.admin1@gardenofmemories.com', passwordHash: 'fb4b91df54f0cbcbf01103ace154e8e4c123f7ff98191b403e88d8cdab885c75', role: 'low_admin', status: 'Active', dateCreated: '2026-09-18T00:00:00.000Z' },
  { id: 5, fullName: 'Low Admin Two', email: 'low.admin2@gardenofmemories.com', passwordHash: 'd1a2ce62f3c5991069aceeb3c4fe71c8c98f9aa13c2178b9991ce225de199ad8', role: 'low_admin', status: 'Active', dateCreated: '2026-09-18T00:00:00.000Z' }
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

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function authenticateAdmin(email, password) {
  const admins = getAdmins();
  const admin = admins.find(item => item.email.toLowerCase() === email.toLowerCase());
  if (!admin) return { error: 'Incorrect email or password.' };
  if (admin.status !== 'Active') return { error: 'This admin account does not currently have access.' };
  if (!admin.passwordHash && !admin.password) return { error: 'This admin account is pending secure password setup.' };

  const passwordHash = await hashPassword(password);
  if (admin.passwordHash && admin.passwordHash === passwordHash) return { admin };

  if (admin.password && admin.password === password) {
    const updatedAdmins = admins.map(item => {
      if (item.id !== admin.id) return item;
      const { password: _password, ...safeAdmin } = item;
      return { ...safeAdmin, passwordHash };
    });
    saveAdmins(updatedAdmins);
    return { admin: { ...admin, passwordHash, password: undefined } };
  }

  return { error: 'Incorrect email or password.' };
}

// Reads the currently logged-in admin for this browser tab/session.
function getCurrentAdmin() {
  try {
    const sessionAdmin = JSON.parse(sessionStorage.getItem(CURRENT_ADMIN_KEY));
    if (!sessionAdmin || !ROLE_PERMISSIONS[sessionAdmin.role]) return null;

    const savedAdmin = getAdmins().find(admin => (
      admin.id === sessionAdmin.id &&
      admin.email.toLowerCase() === sessionAdmin.email.toLowerCase()
    ));

    if (!savedAdmin || savedAdmin.status !== 'Active' || !ROLE_PERMISSIONS[savedAdmin.role]) {
      clearCurrentAdmin();
      return null;
    }

    return {
      id: savedAdmin.id,
      email: savedAdmin.email,
      role: savedAdmin.role
    };
  } catch {
    return null;
  }
}

// Remembers who is logged in for the rest of this session.
function setCurrentAdmin(admin) {
  if (!admin || !ROLE_PERMISSIONS[admin.role]) return;
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

function getAdminHome() {
  const currentAdmin = getCurrentAdmin();
  return currentAdmin ? ROLE_DEFAULT_PAGE[currentAdmin.role] : (document.body.dataset.login || 'admin-login.html');
}

// Checks whether the logged-in admin's role includes the given capability.
function hasPermission(permission) {
  const currentAdmin = getCurrentAdmin();
  if (!currentAdmin) return false;
  return (ROLE_PERMISSIONS[currentAdmin.role] || []).includes(permission);
}

function hasAnyPermission(permissions) {
  return permissions.some(permission => hasPermission(permission));
}

function requirePermission(permission) {
  if (hasPermission(permission)) return true;
  const homeHref = document.body.dataset.home || getAdminHome();
  window.location.href = homeHref;
  return false;
}

function requireAllPermissions(permissionsCsv) {
  const permissions = parseCsv(permissionsCsv);
  if (permissions.every(permission => hasPermission(permission))) return true;
  window.location.href = document.body.dataset.home || getAdminHome();
  return false;
}

function requireAnyPermission(permissionsCsv) {
  if (hasAnyPermission(parseCsv(permissionsCsv))) return true;
  window.location.href = document.body.dataset.home || getAdminHome();
  return false;
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
function permissionMatches(value) {
  return parseCsv(value).some(permission => hasPermission(permission));
}

function parseCsv(value) {
  return String(value || '').split(',').map(item => item.trim()).filter(Boolean);
}

function applyRolePermissions() {
  document.querySelectorAll('[data-permission]').forEach(el => {
    if (!permissionMatches(el.dataset.permission)) el.remove();
  });

  document.querySelectorAll('[data-section-permission]').forEach(el => {
    if (!permissionMatches(el.dataset.sectionPermission)) el.hidden = true;
  });
}

function guardPermissionEvent(event) {
  const protectedElement = event.target.closest('[data-permission]');
  if (!protectedElement || permissionMatches(protectedElement.dataset.permission)) return;

  event.preventDefault();
  event.stopImmediatePropagation();
}

function setupCollapsibleSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  const content = document.querySelector('.admin-content');
  if (!sidebar || !content) return;

  const appointmentsItem = sidebar.querySelector('a[href="admin-appointments.html"]')?.closest('li');
  if (appointmentsItem && !appointmentsItem.querySelector('.sidebar-submenu')) {
    const submenu = document.createElement('ul');
    submenu.className = 'sidebar-submenu';
    submenu.innerHTML = '<li><a href="admin-appointments-archive.html">Archived Appointments</a></li>';
    appointmentsItem.appendChild(submenu);
  }

  sidebar.querySelectorAll('.sidebar-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const icon = Object.keys(SIDEBAR_ICONS).find(key => href.includes(key));
    const label = link.textContent.trim();
    if (href && location.pathname.endsWith(href)) link.classList.add('active');

    link.innerHTML = `
      <span class="sidebar-icon" aria-hidden="true">${SIDEBAR_ICONS[icon] || '•'}</span>
      <span class="sidebar-label">${label}</span>
    `;
    link.setAttribute('title', label);
  });

  const setCollapsed = collapsed => {
    document.body.classList.toggle('admin-sidebar-collapsed', collapsed);
  };

  let collapseTimer = null;
  let sidebarIsActive = false;
  const scheduleCollapse = event => {
    clearTimeout(collapseTimer);
    if (window.matchMedia('(max-width: 900px)').matches) {
      setCollapsed(false);
      return;
    }
    if (
      sidebarIsActive ||
      sidebar.matches(':hover') ||
      sidebar.contains(document.activeElement) ||
      (event && sidebar.contains(event.target))
    ) {
      setCollapsed(false);
      return;
    }
    collapseTimer = setTimeout(() => setCollapsed(true), SIDEBAR_COLLAPSE_DELAY);
  };

  const expandSidebar = () => {
    sidebarIsActive = true;
    clearTimeout(collapseTimer);
    setCollapsed(false);
  };

  sidebar.addEventListener('mouseenter', expandSidebar);
  sidebar.addEventListener('focusin', expandSidebar);
  sidebar.addEventListener('mouseleave', () => {
    sidebarIsActive = false;
    scheduleCollapse();
  });
  sidebar.addEventListener('focusout', () => {
    sidebarIsActive = sidebar.contains(document.activeElement);
    scheduleCollapse();
  });
  document.addEventListener('mousemove', scheduleCollapse, { passive: true });
  document.addEventListener('keydown', scheduleCollapse);
  window.addEventListener('resize', scheduleCollapse);

  scheduleCollapse();
}

// Sends admins away from pages that require a specific role, back to the shared dashboard.
function requireRole(role) {
  const currentAdmin = getCurrentAdmin();
  const homeHref = document.body.dataset.home || getAdminHome();
  if (!currentAdmin || currentAdmin.role !== role) {
    window.location.href = homeHref;
    return false;
  }
  return true;
}

// Sends non-super-admins away from pages that require the Super Admin role.
function requireSuperAdmin() {
  return requireRole('super_admin');
}

// Sends admins away unless their role is in the allowed list (comma-separated).
function requireAnyRole(rolesCsv) {
  const currentAdmin = getCurrentAdmin();
  const allowedRoles = parseCsv(rolesCsv);
  const homeHref = document.body.dataset.home || getAdminHome();
  if (!currentAdmin || !allowedRoles.includes(currentAdmin.role)) {
    window.location.href = homeHref;
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  if (!getCurrentAdmin() && !location.pathname.endsWith('admin-login.html')) {
    window.location.href = document.body.dataset.login || 'admin-login.html';
    return;
  }

  if (document.body.dataset.requiresSuperAdmin === 'true') {
    if (!requireSuperAdmin()) return;
  }

  if (document.body.dataset.requiresRole) {
    if (!requireRole(document.body.dataset.requiresRole)) return;
  }

  if (document.body.dataset.requiresAnyRole) {
    if (!requireAnyRole(document.body.dataset.requiresAnyRole)) return;
  }

  if (document.body.dataset.requiresPermission) {
    if (!requirePermission(document.body.dataset.requiresPermission)) return;
  }

  if (document.body.dataset.requiresAllPermissions) {
    if (!requireAllPermissions(document.body.dataset.requiresAllPermissions)) return;
  }

  if (document.body.dataset.requiresAnyPermission) {
    if (!requireAnyPermission(document.body.dataset.requiresAnyPermission)) return;
  }

  document.addEventListener('click', guardPermissionEvent, true);
  document.addEventListener('submit', guardPermissionEvent, true);
  applyRolePermissions();
  setupCollapsibleSidebar();

  const logoutLink = document.getElementById('admin-logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', clearCurrentAdmin);
  }
});
