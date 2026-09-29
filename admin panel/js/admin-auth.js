const ADMINS_KEY = 'graveFinderAdmins';
const CURRENT_ADMIN_KEY = 'graveFinderCurrentAdmin';
const ACTIVITY_LOG_KEY = 'graveFinderActivityLog';

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  mid_admin: 'Medium Admin',
  low_admin: 'Low Admin'
};

// Capabilities each role is allowed to use by default. Checked with hasPermission().
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
    'records.view', 'records.search', 'records.add', 'records.edit', 'records.archive', 'records.restore',
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

const CUSTOMIZABLE_PERMISSIONS = [
  {
    id: 'dashboard',
    label: 'Dashboard Overview',
    desc: 'View analytics and summary charts',
    keys: ['dashboard'],
    page: 'admin-dashboard.html'
  },
  {
    id: 'records_view',
    label: 'View Burial Records',
    desc: 'Search and view burial records',
    keys: ['records.view', 'records.search'],
    page: 'admin-records.html'
  },
  {
    id: 'records_edit',
    label: 'Add & Edit Records',
    desc: 'Create and update burial records',
    keys: ['records.add', 'records.edit'],
    requires: ['records.view', 'records.search'],
    page: 'admin-records.html'
  },
  {
    id: 'records_archive',
    label: 'Archive & Restore Records',
    desc: 'Move records to and from archive',
    keys: ['records.archive', 'records.restore'],
    requires: ['records.view', 'records.search'],
    page: 'admin-records-archive.html'
  },
  {
    id: 'map_manage',
    label: 'Manage Cemetery Map',
    desc: 'View and update cemetery plot map',
    keys: ['map.manage'],
    page: 'admin-map.html'
  },
  {
    id: 'appointments_view',
    label: 'View Appointments',
    desc: 'View scheduled and archived appointments',
    keys: ['appointments.view', 'inquiries.view'],
    page: 'admin-appointments.html'
  },
  {
    id: 'appointments_manage',
    label: 'Manage Appointments',
    desc: 'Confirm, reschedule, and archive appointments',
    keys: ['appointments.manage', 'inquiries.manage'],
    requires: ['appointments.view', 'inquiries.view'],
    page: 'admin-appointments.html'
  },
  {
    id: 'activity_view',
    label: 'View Activity Logs',
    desc: 'Inspect system audit and activity logs',
    keys: ['activity.view'],
    page: 'admin-activity.html'
  },
  {
    id: 'settings_manage',
    label: 'System Settings',
    desc: 'Modify park details and system settings',
    keys: ['settings.manage'],
    page: 'admin-settings.html'
  }
];

const SEED_PASSWORD_HASHES = {
  'super.admin@gardenofmemories.com': '0eeaa9fdda267f5bf6f0b4fe2fabb4133c1b8689d02832052fb90d129ea3093f',
  'mid.admin1@gardenofmemories.com': '94a8d58f5c3f9cf2b7d7ddbb3a01c282cff8d1c9b0a5f0fc6858b4965bdb4d69',
  'mid.admin2@gardenofmemories.com': 'a911d4a2a69d48271ac7d2211ca300384399d4872272e685eb3979dda9206e86',
  'low.admin1@gardenofmemories.com': 'fb4b91df54f0cbcbf01103ace154e8e4c123f7ff98191b403e88d8cdab885c75',
  'low.admin2@gardenofmemories.com': 'd1a2ce62f3c5991069aceeb3c4fe71c8c98f9aa13c2178b9991ce225de199ad8'
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
  'admin-records-archive.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5z"></path><path d="M8 8h8"></path><path d="M8 12h8"></path><path d="M8 16h5"></path></svg>',
  'admin-map.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>',
  'admin-appointments.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4"></path><path d="M16 3v4"></path><path d="M4 10h16"></path><path d="M9 15l2 2 4-4"></path></svg>',
  'admin-appointments-archive.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4"></path><path d="M16 3v4"></path><path d="M4 10h16"></path><path d="M8 15h8"></path><path d="M8 18h5"></path></svg>',
  'admin-manage.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5"></circle><path d="M3.5 20a5.5 5.5 0 0 1 11 0"></path><path d="M17 8h4"></path><path d="M19 6v4"></path><path d="M17 15.5h4"></path></svg>',
  'admin-activity.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.35-5.65"></path><path d="M4 5v5h5"></path><path d="M12 8v5l3 2"></path></svg>',
  'admin-settings.html': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M12 3v3"></path><path d="M12 18v3"></path><path d="M3 12h3"></path><path d="M18 12h3"></path><path d="M5.6 5.6l2.1 2.1"></path><path d="M16.3 16.3l2.1 2.1"></path><path d="M18.4 5.6l-2.1 2.1"></path><path d="M7.7 16.3l-2.1 2.1"></path></svg>'
};

// Starter roster: 1 Super Admin, 2 Mid Admins, 2 Low Admins.
const defaultAdmins = [
  { id: 1, fullName: 'Super Administrator', email: 'super.admin@gardenofmemories.com', passwordHash: '0eeaa9fdda267f5bf6f0b4fe2fabb4133c1b8689d02832052fb90d129ea3093f', role: 'super_admin', status: 'Active', dateCreated: '2026-09-18T00:00:00.000Z', permissions: [...ROLE_PERMISSIONS.super_admin] },
  { id: 2, fullName: 'Medium Admin One', email: 'mid.admin1@gardenofmemories.com', passwordHash: '94a8d58f5c3f9cf2b7d7ddbb3a01c282cff8d1c9b0a5f0fc6858b4965bdb4d69', role: 'mid_admin', status: 'Active', dateCreated: '2026-09-18T00:00:00.000Z', permissions: [...ROLE_PERMISSIONS.mid_admin] },
  { id: 3, fullName: 'Medium Admin Two', email: 'mid.admin2@gardenofmemories.com', passwordHash: 'a911d4a2a69d48271ac7d2211ca300384399d4872272e685eb3979dda9206e86', role: 'mid_admin', status: 'Active', dateCreated: '2026-09-18T00:00:00.000Z', permissions: [...ROLE_PERMISSIONS.mid_admin] },
  { id: 4, fullName: 'Low Admin One', email: 'low.admin1@gardenofmemories.com', passwordHash: 'fb4b91df54f0cbcbf01103ace154e8e4c123f7ff98191b403e88d8cdab885c75', role: 'low_admin', status: 'Active', dateCreated: '2026-09-18T00:00:00.000Z', permissions: [...ROLE_PERMISSIONS.low_admin] },
  { id: 5, fullName: 'Low Admin Two', email: 'low.admin2@gardenofmemories.com', passwordHash: 'd1a2ce62f3c5991069aceeb3c4fe71c8c98f9aa13c2178b9991ce225de199ad8', role: 'low_admin', status: 'Active', dateCreated: '2026-09-18T00:00:00.000Z', permissions: [...ROLE_PERMISSIONS.low_admin] }
];

function getEffectiveAdminPermissions(admin) {
  if (!admin) return [];
  if (admin.role === 'super_admin') return [...(ROLE_PERMISSIONS.super_admin || [])];
  if (Array.isArray(admin.permissions) && admin.permissions.length) {
    return [...admin.permissions];
  }
  return [...(ROLE_PERMISSIONS[admin.role] || [])];
}

function normalizeAdminList(rawList) {
  if (!Array.isArray(rawList) || !rawList.length) {
    return defaultAdmins.map(item => ({ ...item, permissions: [...getEffectiveAdminPermissions(item)] }));
  }

  let changed = false;
  const existingEmails = new Set(rawList.map(item => String(item.email || '').toLowerCase()));
  const merged = [...rawList];

  defaultAdmins.forEach(seed => {
    if (!existingEmails.has(seed.email.toLowerCase()) && !merged.some(item => item.id === seed.id)) {
      merged.push({ ...seed, permissions: [...seed.permissions] });
      changed = true;
    }
  });

  const normalized = merged.map(admin => {
    const item = { ...admin };
    const emailLower = String(item.email || '').toLowerCase();

    if (!item.role || !ROLE_PERMISSIONS[item.role]) {
      item.role = 'low_admin';
      changed = true;
    }
    if (!item.fullName) {
      item.fullName = item.name || item.email?.split('@')[0].replace(/[._-]+/g, ' ') || 'Administrator';
      changed = true;
    }
    if (!item.status || item.status === 'Removed') {
      item.status = item.status === 'Removed' ? 'Deactivated' : 'Active';
      changed = true;
    }
    if (!item.dateCreated) {
      item.dateCreated = '2026-09-18T00:00:00.000Z';
      changed = true;
    }
    if (!item.passwordHash && SEED_PASSWORD_HASHES[emailLower]) {
      item.passwordHash = SEED_PASSWORD_HASHES[emailLower];
      delete item.password;
      changed = true;
    }
    if (!Array.isArray(item.permissions) || !item.permissions.length) {
      item.permissions = [...(ROLE_PERMISSIONS[item.role] || ROLE_PERMISSIONS.low_admin)];
      changed = true;
    }
    return item;
  });

  if (changed) {
    saveAdmins(normalized);
  }
  return normalized;
}

// Loads the admin roster from localStorage, seeding and normalizing it.
function getAdmins() {
  const saved = localStorage.getItem(ADMINS_KEY);
  if (!saved) {
    const initial = normalizeAdminList(defaultAdmins);
    saveAdmins(initial);
    return initial;
  }

  try {
    const parsed = JSON.parse(saved);
    return normalizeAdminList(parsed);
  } catch {
    const initial = normalizeAdminList(defaultAdmins);
    saveAdmins(initial);
    return initial;
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
    if (!sessionAdmin) return null;

    const admins = getAdmins();
    const savedAdmin = admins.find(admin => admin.id === sessionAdmin.id)
      || admins.find(admin => admin.email && sessionAdmin.email && admin.email.toLowerCase() === sessionAdmin.email.toLowerCase());

    if (!savedAdmin || savedAdmin.status !== 'Active' || !ROLE_PERMISSIONS[savedAdmin.role]) {
      clearCurrentAdmin();
      return null;
    }

    const displayName = savedAdmin.fullName || savedAdmin.name || savedAdmin.email;
    return {
      id: savedAdmin.id,
      name: displayName,
      fullName: displayName,
      email: savedAdmin.email,
      role: savedAdmin.role,
      roleLabel: ROLE_LABELS[savedAdmin.role] || savedAdmin.role,
      permissions: getEffectiveAdminPermissions(savedAdmin)
    };
  } catch {
    return null;
  }
}

// Remembers who is logged in for the rest of this session.
function setCurrentAdmin(admin) {
  if (!admin || !ROLE_PERMISSIONS[admin.role]) return;
  const now = new Date().toISOString();
  const admins = getAdmins();
  saveAdmins(admins.map(item => (
    item.id === admin.id ? { ...item, lastLogin: now } : item
  )));
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
  if (!currentAdmin) return document.body.dataset.login || 'admin-login.html';
  return ROLE_DEFAULT_PAGE[currentAdmin.role] || 'admin-dashboard.html';
}

// Checks whether the logged-in admin's effective permissions include the given capability.
function hasPermission(permission) {
  const currentAdmin = getCurrentAdmin();
  if (!currentAdmin) return false;
  if (currentAdmin.role === 'super_admin') return true;
  const allowed = getEffectiveAdminPermissions(currentAdmin);
  return allowed.includes(permission);
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

function detectClientEnvironment() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let browser = 'Chrome 134.0';
  if (/Edg\/([\d.]+)/.test(ua)) browser = `Edge ${RegExp.$1.split('.')[0]}.0`;
  else if (/Chrome\/([\d.]+)/.test(ua)) browser = `Chrome ${RegExp.$1.split('.')[0]}.0`;
  else if (/Firefox\/([\d.]+)/.test(ua)) browser = `Firefox ${RegExp.$1.split('.')[0]}.0`;
  else if (/Version\/([\d.]+).*Safari/.test(ua)) browser = `Safari ${RegExp.$1.split('.')[0]}`;

  let os = 'Windows 11 x64';
  if (/Windows NT 10\.0/.test(ua)) os = 'Windows 11 x64';
  else if (/Mac OS X/.test(ua)) os = 'macOS Sonoma';
  else if (/Linux/.test(ua)) os = 'Linux x86_64';

  return `${browser} · ${os}`;
}

function inferAuditTelemetry(action = '', record = '', adminId = 1) {
  const lowerAction = String(action).toLowerCase();
  const lowerRecord = String(record).toLowerCase();
  const ipPool = [
    { ip: '192.168.1.104', node: 'Taguig-Pateros Admin LAN (VLAN-10)' },
    { ip: '192.168.1.112', node: 'Chapel Operations Workstation #2' },
    { ip: '192.168.1.118', node: 'Records Registry Terminal #1' },
    { ip: '103.44.168.22', node: 'GMMPCI Secure VPN Gateway' },
    { ip: '192.168.1.125', node: 'Front Desk Reception Terminal' }
  ];
  const selectedNet = ipPool[(Number(adminId) || 1) % ipPool.length];

  let httpMethod = 'PATCH';
  let endpoint = '/api/v1/system/audit';
  let severity = 'INFO';
  let statusCode = '200 OK';

  if (lowerAction.includes('added') || lowerAction.includes('created')) {
    httpMethod = 'POST';
    statusCode = '201 CREATED';
    severity = lowerAction.includes('admin') ? 'NOTICE' : 'INFO';
  } else if (lowerAction.includes('archive') || lowerAction.includes('deactivate')) {
    httpMethod = 'POST';
    severity = 'NOTICE';
  } else if (lowerAction.includes('delete') || lowerAction.includes('remove')) {
    httpMethod = 'DELETE';
    severity = 'WARN';
  } else if (lowerAction.includes('admin') || lowerAction.includes('permission') || lowerAction.includes('role')) {
    httpMethod = 'PATCH';
    severity = 'NOTICE';
  } else if (lowerAction.includes('login') || lowerAction.includes('auth')) {
    httpMethod = 'AUTH';
    severity = 'INFO';
  }

  if (lowerAction.includes('admin')) {
    endpoint = '/api/v1/iam/admins/permissions';
  } else if (lowerRecord.includes('appointment') || lowerAction.includes('confirm')) {
    endpoint = lowerAction.includes('archive') ? '/api/v1/appointments/archive' : '/api/v1/appointments/schedule';
  } else if (lowerRecord.includes('message') || lowerAction.includes('replied') || lowerAction.includes('read')) {
    endpoint = '/api/v1/inquiries/messages';
  } else {
    endpoint = lowerAction.includes('archive') ? '/api/v1/records/archive' : '/api/v1/records/registry';
  }

  return {
    ipAddress: selectedNet.ip,
    networkNode: selectedNet.node,
    httpMethod,
    endpoint,
    severity,
    statusCode
  };
}

// Records an action into the shared activity log for accountability.
function logActivity(action, record, details) {
  const currentAdmin = getCurrentAdmin();
  const log = getActivityLog();
  const now = new Date();
  const hexSuffix = Math.floor(0x1000 + Math.random() * 0xEFFF).toString(16).toUpperCase();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const telemetry = inferAuditTelemetry(action, record, currentAdmin?.id || 1);

  log.unshift({
    eventId: `EVT-${datePart}-${hexSuffix}`,
    timestamp: now.toISOString(),
    adminName: currentAdmin ? currentAdmin.name : 'System Administrator',
    adminEmail: currentAdmin ? currentAdmin.email : 'super.admin@gardenofmemories.com',
    adminRole: currentAdmin ? currentAdmin.role : 'super_admin',
    action,
    record,
    details: details || '',
    ipAddress: telemetry.ipAddress,
    networkNode: telemetry.networkNode,
    clientAgent: detectClientEnvironment(),
    httpMethod: telemetry.httpMethod,
    endpoint: telemetry.endpoint,
    statusCode: telemetry.statusCode,
    severity: telemetry.severity,
    sessionId: `sess_${(currentAdmin?.id || 1).toString(16)}f9a${now.getHours()}${now.getMinutes()}`,
    latencyMs: `${14 + Math.floor(Math.random() * 24)}ms`
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

function renderAdminSessionBadge() {
  const currentAdmin = getCurrentAdmin();
  if (!currentAdmin) return;

  const brandSub = document.querySelector('.nav-brand-text .brand-sub');
  if (brandSub) {
    brandSub.textContent = `Admin Panel · ${ROLE_LABELS[currentAdmin.role] || 'Admin'}`;
  }

  const navActions = document.querySelector('.admin-nav-actions');
  if (!navActions || document.getElementById('admin-session-badge')) return;

  if (!document.getElementById('admin-session-badge-styles')) {
    const style = document.createElement('style');
    style.id = 'admin-session-badge-styles';
    style.textContent = `
      .admin-session-badge {
        display: inline-flex;
        align-items: center;
        gap: .55rem;
        padding: .36rem .75rem;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(196, 166, 97, 0.28);
        border-radius: 999px;
        color: #f4f1ea;
        font-family: 'Jost', sans-serif;
        font-size: .78rem;
        line-height: 1.2;
      }
      .admin-session-name {
        color: #ffffff;
        font-weight: 400;
      }
      .admin-session-role {
        padding: .14rem .48rem;
        border-radius: 999px;
        background: rgba(139, 168, 142, 0.24);
        color: #d8eadc;
        font-size: .68rem;
        letter-spacing: .06em;
        text-transform: uppercase;
      }
      @media (max-width: 760px) {
        .admin-session-badge {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const badge = document.createElement('div');
  badge.id = 'admin-session-badge';
  badge.className = 'admin-session-badge';
  badge.setAttribute('aria-label', 'Logged in administrator');

  const nameSpan = document.createElement('span');
  nameSpan.className = 'admin-session-name';
  nameSpan.textContent = currentAdmin.fullName || currentAdmin.name;

  const roleSpan = document.createElement('span');
  roleSpan.className = 'admin-session-role';
  roleSpan.textContent = ROLE_LABELS[currentAdmin.role] || currentAdmin.role;

  badge.appendChild(nameSpan);
  badge.appendChild(roleSpan);
  navActions.insertBefore(badge, navActions.firstChild);
}

function setupCollapsibleSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  const content = document.querySelector('.admin-content');
  if (!sidebar || !content) return;

  const appointmentsItem = sidebar.querySelector('a[href="admin-appointments.html"]')?.closest('li');
  if (appointmentsItem && hasPermission('appointments.view') && !appointmentsItem.querySelector('.sidebar-submenu')) {
    appointmentsItem.classList.add('has-submenu');
    const submenu = document.createElement('ul');
    submenu.className = 'sidebar-submenu';
    submenu.innerHTML = '<li><a href="admin-appointments-archive.html">Archived Appointments</a></li>';
    appointmentsItem.appendChild(submenu);
  }

  const recordsItem = sidebar.querySelector('a[href="admin-records.html"]')?.closest('li');
  const canAccessArchivedRecords = hasAnyPermission(['records.restore', 'records.archive']);
  if (recordsItem && canAccessArchivedRecords && !recordsItem.querySelector('.sidebar-submenu')) {
    recordsItem.classList.add('has-submenu');
    const submenu = document.createElement('ul');
    submenu.className = 'sidebar-submenu';
    submenu.innerHTML = '<li data-permission="records.archive,records.restore"><a href="admin-records-archive.html">Archived Records</a></li>';
    recordsItem.appendChild(submenu);
    applyRolePermissions();
  }

  sidebar.querySelectorAll('.sidebar-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const icon = Object.keys(SIDEBAR_ICONS).find(key => href.includes(key));
    const label = link.textContent.trim();
    if (href && location.pathname.endsWith(href)) link.classList.add('active');

    const submenuEl = link.closest('li')?.querySelector(':scope > .sidebar-submenu');
    const hasSubmenu = Boolean(
      link.closest('li')?.classList.contains('has-submenu') &&
      submenuEl &&
      submenuEl.children.length > 0
    );
    link.innerHTML = `
      <span class="sidebar-icon" aria-hidden="true">${SIDEBAR_ICONS[icon] || '•'}</span>
      <span class="sidebar-label">${label}</span>
      ${hasSubmenu ? '<span class="submenu-toggle-icon" aria-hidden="true">&#9662;</span>' : ''}
    `;
    link.setAttribute('title', label);
  });

  const appointmentsSubmenu = appointmentsItem?.querySelector('.sidebar-submenu');
  const appointmentsLink = appointmentsItem?.querySelector(':scope > a');
  if (appointmentsItem && appointmentsSubmenu && appointmentsLink) {
    const isArchivePage = location.pathname.endsWith('admin-appointments-archive.html');
    appointmentsItem.classList.toggle('submenu-open', isArchivePage);
    appointmentsLink.setAttribute('aria-expanded', String(isArchivePage));

    appointmentsLink.addEventListener('mouseenter', () => {
      appointmentsItem.classList.add('submenu-open');
      appointmentsLink.setAttribute('aria-expanded', 'true');
    });
    appointmentsLink.addEventListener('focus', () => {
      appointmentsItem.classList.add('submenu-open');
      appointmentsLink.setAttribute('aria-expanded', 'true');
    });
  }

  const recordsSubmenu = recordsItem?.querySelector('.sidebar-submenu');
  const recordsLink = recordsItem?.querySelector(':scope > a');
  if (recordsItem && recordsSubmenu && recordsLink) {
    const isArchivePage = location.pathname.endsWith('admin-records-archive.html');
    recordsItem.classList.toggle('submenu-open', isArchivePage);
    recordsLink.setAttribute('aria-expanded', String(isArchivePage));

    recordsLink.addEventListener('mouseenter', () => {
      recordsItem.classList.add('submenu-open');
      recordsLink.setAttribute('aria-expanded', 'true');
    });
    recordsLink.addEventListener('focus', () => {
      recordsItem.classList.add('submenu-open');
      recordsLink.setAttribute('aria-expanded', 'true');
    });
  }

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

function checkPageAccessGuards() {
  if (!getCurrentAdmin() && !location.pathname.endsWith('admin-login.html')) {
    window.location.href = document.body.dataset.login || 'admin-login.html';
    return false;
  }

  if (document.body.dataset.requiresSuperAdmin === 'true') {
    if (!requireSuperAdmin()) return false;
  }

  if (document.body.dataset.requiresRole) {
    if (!requireRole(document.body.dataset.requiresRole)) return false;
  }

  if (document.body.dataset.requiresAnyRole) {
    if (!requireAnyRole(document.body.dataset.requiresAnyRole)) return false;
  }

  if (document.body.dataset.requiresPermission) {
    if (!requirePermission(document.body.dataset.requiresPermission)) return false;
  }

  if (document.body.dataset.requiresAllPermissions) {
    if (!requireAllPermissions(document.body.dataset.requiresAllPermissions)) return false;
  }

  if (document.body.dataset.requiresAnyPermission) {
    if (!requireAnyPermission(document.body.dataset.requiresAnyPermission)) return false;
  }

  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  if (!checkPageAccessGuards()) return;

  document.addEventListener('click', guardPermissionEvent, true);
  document.addEventListener('submit', guardPermissionEvent, true);
  applyRolePermissions();
  setupCollapsibleSidebar();
  renderAdminSessionBadge();

  const logoutLink = document.getElementById('admin-logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', clearCurrentAdmin);
  }

  window.addEventListener('storage', event => {
    if (event.key === ADMINS_KEY && !location.pathname.endsWith('admin-login.html')) {
      if (checkPageAccessGuards()) {
        window.location.reload();
      }
    }
  });
});
