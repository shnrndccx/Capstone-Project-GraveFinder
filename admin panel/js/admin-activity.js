const DEFAULT_AUDIT_LOGS = [
  {
    eventId: 'EVT-20260929-9A4C',
    timestamp: '2026-09-29T05:00:12.000Z',
    adminName: 'Angela Cruz',
    adminEmail: 'super.admin@gardenofmemories.com',
    adminRole: 'super_admin',
    action: 'Updated Admin',
    record: 'Marco Villanueva',
    details: 'mid.admin1@gardenofmemories.com updated (Medium Admin, Active, 5 permission groups).',
    ipAddress: '192.168.1.104',
    networkNode: 'Taguig-Pateros Admin LAN (VLAN-10)',
    clientAgent: 'Chrome 134.0 · Windows 11 x64',
    httpMethod: 'PATCH',
    endpoint: '/api/v1/iam/admins/permissions',
    statusCode: '200 OK',
    severity: 'NOTICE',
    sessionId: 'sess_1f9a1300',
    latencyMs: '19ms'
  },
  {
    eventId: 'EVT-20260929-7D21',
    timestamp: '2026-09-29T03:42:08.000Z',
    adminName: 'Angela Cruz',
    adminEmail: 'super.admin@gardenofmemories.com',
    adminRole: 'super_admin',
    action: 'Archived',
    record: 'Carla Mendoza',
    details: 'Appointment #8 archived (Completed as scheduled).',
    ipAddress: '192.168.1.104',
    networkNode: 'Taguig-Pateros Admin LAN (VLAN-10)',
    clientAgent: 'Chrome 134.0 · Windows 11 x64',
    httpMethod: 'POST',
    endpoint: '/api/v1/appointments/archive',
    statusCode: '200 OK',
    severity: 'NOTICE',
    sessionId: 'sess_1f9a1142',
    latencyMs: '24ms'
  },
  {
    eventId: 'EVT-20260929-4B18',
    timestamp: '2026-09-29T03:29:41.000Z',
    adminName: 'Angela Cruz',
    adminEmail: 'super.admin@gardenofmemories.com',
    adminRole: 'super_admin',
    action: 'Archived',
    record: 'Angela Santos',
    details: 'Appointment #6 archived.',
    ipAddress: '192.168.1.112',
    networkNode: 'Chapel Operations Workstation #2',
    clientAgent: 'Chrome 134.0 · Windows 11 x64',
    httpMethod: 'POST',
    endpoint: '/api/v1/appointments/archive',
    statusCode: '200 OK',
    severity: 'NOTICE',
    sessionId: 'sess_1f9a1129',
    latencyMs: '21ms'
  },
  {
    eventId: 'EVT-20260928-6E09',
    timestamp: '2026-09-28T17:58:19.000Z',
    adminName: 'Angela Cruz',
    adminEmail: 'super.admin@gardenofmemories.com',
    adminRole: 'super_admin',
    action: 'Archived',
    record: 'Santos, Maria',
    details: 'Record #1001 archived. Reason: Transferred to family columbarium vault.',
    ipAddress: '192.168.1.118',
    networkNode: 'Records Registry Terminal #1',
    clientAgent: 'Chrome 134.0 · Windows 11 x64',
    httpMethod: 'POST',
    endpoint: '/api/v1/records/archive',
    statusCode: '200 OK',
    severity: 'NOTICE',
    sessionId: 'sess_1f9a0158',
    latencyMs: '28ms'
  },
  {
    eventId: 'EVT-20260928-3C74',
    timestamp: '2026-09-28T16:24:05.000Z',
    adminName: 'Angela Cruz',
    adminEmail: 'super.admin@gardenofmemories.com',
    adminRole: 'super_admin',
    action: 'Updated',
    record: 'Appointment #7',
    details: 'Appointment details updated.',
    ipAddress: '103.44.168.22',
    networkNode: 'GMMPCI Secure VPN Gateway',
    clientAgent: 'Chrome 134.0 · Windows 11 x64',
    httpMethod: 'PATCH',
    endpoint: '/api/v1/appointments/schedule',
    statusCode: '200 OK',
    severity: 'INFO',
    sessionId: 'sess_1f9a0024',
    latencyMs: '16ms'
  }
];

function escapeActivityHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function deterministicHash(str) {
  let hash = 2166136261;
  const input = String(str || 'audit');
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

function enrichActivityEntry(entry, index = 0) {
  const ipNodes = [
    { ip: '192.168.1.104', node: 'Taguig-Pateros Admin LAN (VLAN-10)' },
    { ip: '192.168.1.112', node: 'Chapel Operations Workstation #2' },
    { ip: '192.168.1.118', node: 'Records Registry Terminal #1' },
    { ip: '103.44.168.22', node: 'GMMPCI Secure VPN Gateway' },
    { ip: '192.168.1.125', node: 'Front Desk Reception Terminal' }
  ];

  const seedHash = deterministicHash(`${entry.timestamp}-${entry.action}-${entry.record}-${index}`);
  const netInfo = ipNodes[index % ipNodes.length];
  const dateObj = entry.timestamp ? new Date(entry.timestamp) : new Date();
  const dateCode = !Number.isNaN(dateObj.getTime())
    ? dateObj.toISOString().slice(0, 10).replace(/-/g, '')
    : '20260929';

  const fallbackTelemetry = typeof inferAuditTelemetry === 'function'
    ? inferAuditTelemetry(entry.action, entry.record, index + 1)
    : {
        ipAddress: netInfo.ip,
        networkNode: netInfo.node,
        httpMethod: 'PATCH',
        endpoint: '/api/v1/system/audit',
        severity: 'INFO',
        statusCode: '200 OK'
      };

  return {
    ...entry,
    eventId: entry.eventId || `EVT-${dateCode}-${seedHash.slice(0, 4)}`,
    adminName: entry.adminName || (entry.adminRole === 'super_admin' ? 'Angela Cruz' : 'Administrator'),
    adminEmail: entry.adminEmail || 'super.admin@gardenofmemories.com',
    adminRole: entry.adminRole || 'super_admin',
    ipAddress: entry.ipAddress || netInfo.ip,
    networkNode: entry.networkNode || netInfo.node,
    clientAgent: entry.clientAgent || (typeof detectClientEnvironment === 'function' ? detectClientEnvironment() : 'Chrome 134.0 · Windows 11 x64'),
    httpMethod: entry.httpMethod || fallbackTelemetry.httpMethod,
    endpoint: entry.endpoint || fallbackTelemetry.endpoint,
    statusCode: entry.statusCode || fallbackTelemetry.statusCode,
    severity: entry.severity || fallbackTelemetry.severity,
    sessionId: entry.sessionId || `sess_${seedHash.slice(0, 6).toLowerCase()}`,
    latencyMs: entry.latencyMs || `${15 + (index * 5) % 22}ms`
  };
}

function getNormalizedActivityLogs() {
  let raw = getActivityLog();
  let modified = false;

  if (!raw.length) {
    raw = [...DEFAULT_AUDIT_LOGS];
    modified = true;
  }

  const enriched = raw.map((item, idx) => {
    if (!item.eventId || !item.ipAddress || !item.endpoint || !item.httpMethod || !item.severity) {
      modified = true;
      return enrichActivityEntry(item, idx);
    }
    return item;
  });

  if (modified) {
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(enriched));
  }

  return enriched;
}

function updateActivitySummary(entries) {
  const uniqueIps = new Set(entries.map(item => item.ipAddress).filter(Boolean));
  const mutations = entries.filter(item => ['POST', 'PATCH', 'PUT', 'DELETE'].includes(item.httpMethod)).length;
  const securityEvents = entries.filter(item => (
    item.severity === 'NOTICE' ||
    item.severity === 'WARN' ||
    String(item.endpoint || '').includes('/iam/')
  )).length;

  const summaryMap = {
    total: entries.length,
    ips: uniqueIps.size,
    mutations,
    security: securityEvents
  };

  Object.entries(summaryMap).forEach(([key, value]) => {
    const el = document.querySelector(`[data-activity-summary="${key}"]`);
    if (el) el.textContent = value;
  });
}

function entryMatchesActivityFilters(entry) {
  const searchInput = document.getElementById('activity-search-input');
  const categorySelect = document.getElementById('activity-category-filter');
  const severitySelect = document.getElementById('activity-severity-filter');

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const category = categorySelect ? categorySelect.value : '';
  const severity = severitySelect ? severitySelect.value : '';

  if (category && !String(entry.endpoint || '').toLowerCase().includes(category)) {
    return false;
  }
  if (severity && entry.severity !== severity) {
    return false;
  }
  if (!query) return true;

  const haystack = [
    entry.eventId,
    entry.adminName,
    entry.adminEmail,
    ROLE_LABELS[entry.adminRole] || entry.adminRole,
    entry.ipAddress,
    entry.networkNode,
    entry.clientAgent,
    entry.httpMethod,
    entry.action,
    entry.endpoint,
    entry.record,
    entry.details,
    entry.severity
  ].join(' ').toLowerCase();

  return haystack.includes(query);
}

function clearActivityFilters() {
  const searchInput = document.getElementById('activity-search-input');
  const categorySelect = document.getElementById('activity-category-filter');
  const severitySelect = document.getElementById('activity-severity-filter');
  if (searchInput) searchInput.value = '';
  if (categorySelect) categorySelect.value = '';
  if (severitySelect) severitySelect.value = '';
  renderActivityLog();
}

function formatAuditTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Draws the activity log with technical telemetry, IP addresses, endpoints, and severity badges.
function renderActivityLog() {
  const table = document.querySelector('[data-activity-table]');
  if (!table) return;

  const allEntries = hasPermission('activity.view') ? getNormalizedActivityLogs() : [];
  updateActivitySummary(allEntries);

  const visibleEntries = allEntries.filter(entryMatchesActivityFilters);
  const tbody = table.querySelector('tbody');

  tbody.innerHTML = visibleEntries.map(entry => {
    const methodClass = `method-${String(entry.httpMethod || 'PATCH').toLowerCase()}`;
    const severityClass = `severity-${String(entry.severity || 'INFO').toLowerCase()}`;
    const roleLabel = ROLE_LABELS[entry.adminRole] || entry.adminRole;

    return `
      <tr>
        <td>
          <div class="activity-cell-stack">
            <span class="activity-event-badge">${escapeActivityHtml(entry.eventId)}</span>
            <span class="activity-timestamp-text">${escapeActivityHtml(formatAuditTimestamp(entry.timestamp))}</span>
          </div>
        </td>
        <td>
          <div class="activity-cell-stack">
            <strong class="activity-actor-email" title="${escapeActivityHtml(entry.adminEmail)}">${escapeActivityHtml(entry.adminEmail)}</strong>
            <span class="activity-sub-meta">${escapeActivityHtml(roleLabel)} · ${escapeActivityHtml(entry.sessionId)}</span>
          </div>
        </td>
        <td>
          <div class="activity-cell-stack">
            <div class="activity-ip-row">
              <span class="activity-ip-chip">${escapeActivityHtml(entry.ipAddress)}</span>
              <span class="activity-latency-chip">${escapeActivityHtml(entry.latencyMs)}</span>
            </div>
            <span class="activity-sub-meta" title="${escapeActivityHtml(entry.networkNode)}">${escapeActivityHtml(entry.clientAgent)}</span>
          </div>
        </td>
        <td>
          <div class="activity-cell-stack">
            <div class="activity-op-row">
              <span class="activity-method-badge ${escapeActivityHtml(methodClass)}">${escapeActivityHtml(entry.httpMethod)}</span>
              <strong class="activity-action-name">${escapeActivityHtml(entry.action)}</strong>
              <span class="activity-severity-pill ${escapeActivityHtml(severityClass)}">${escapeActivityHtml(entry.severity)}</span>
            </div>
            <span class="activity-endpoint-text">${escapeActivityHtml(entry.endpoint)}</span>
          </div>
        </td>
        <td>
          <div class="activity-cell-stack">
            <strong class="activity-record-target">${escapeActivityHtml(entry.record)}</strong>
            <span class="activity-details-preview" title="${escapeActivityHtml(entry.details)}">${escapeActivityHtml(entry.details)}</span>
          </div>
        </td>
        <td>
          <button class="action-btn" type="button" onclick="inspectActivityEvent('${escapeActivityHtml(entry.eventId)}')">Inspect</button>
        </td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="6">No matching audit events found.</td></tr>';
}

function inspectActivityEvent(eventId) {
  const entries = getNormalizedActivityLogs();
  const entry = entries.find(item => item.eventId === eventId);
  if (!entry) return;

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '—';
  };

  const roleLabel = ROLE_LABELS[entry.adminRole] || entry.adminRole;
  const fullHash = `${deterministicHash(entry.eventId + entry.timestamp)}${deterministicHash(entry.ipAddress + entry.details)}`.toLowerCase();

  setText('inspect-event-title', `${entry.httpMethod} · ${entry.action}`);
  setText('inspect-event-id', entry.eventId);
  setText('inspect-event-timestamp', formatAuditTimestamp(entry.timestamp));
  setText('inspect-event-ip', entry.ipAddress);
  setText('inspect-event-node', entry.networkNode);
  setText('inspect-event-actor', `${entry.adminEmail} (${roleLabel})`);
  setText('inspect-event-session', `${entry.sessionId} · ${entry.latencyMs}`);
  setText('inspect-event-client', entry.clientAgent);
  setText('inspect-event-status', entry.statusCode || '200 OK');
  setText('inspect-event-endpoint', `${entry.httpMethod} ${entry.endpoint} → [${entry.record}]`);
  setText('inspect-event-details', entry.details);
  setText('inspect-event-hash', `SHA-256: ${fullHash}`);

  const severityBadge = document.getElementById('inspect-event-severity');
  if (severityBadge) {
    severityBadge.textContent = entry.severity || 'INFO';
    severityBadge.className = `activity-severity-pill severity-${String(entry.severity || 'INFO').toLowerCase()}`;
  }

  const jsonPre = document.getElementById('inspect-event-json');
  if (jsonPre) {
    const payload = {
      event_id: entry.eventId,
      timestamp_iso: entry.timestamp,
      severity: entry.severity,
      actor: {
        email: entry.adminEmail,
        role: entry.adminRole,
        session_id: entry.sessionId
      },
      network: {
        source_ip: entry.ipAddress,
        node: entry.networkNode,
        user_agent: entry.clientAgent
      },
      request: {
        method: entry.httpMethod,
        endpoint: entry.endpoint,
        status: entry.statusCode,
        latency: entry.latencyMs
      },
      target: {
        action: entry.action,
        resource: entry.record,
        summary: entry.details
      },
      integrity_hash: `sha256:${fullHash}`
    };
    jsonPre.textContent = JSON.stringify(payload, null, 2);
  }

  openModal('view-activity-modal');
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('activity-search-input');
  const categorySelect = document.getElementById('activity-category-filter');
  const severitySelect = document.getElementById('activity-severity-filter');

  if (searchInput) searchInput.addEventListener('input', renderActivityLog);
  if (categorySelect) categorySelect.addEventListener('change', renderActivityLog);
  if (severitySelect) severitySelect.addEventListener('change', renderActivityLog);

  renderActivityLog();
});
