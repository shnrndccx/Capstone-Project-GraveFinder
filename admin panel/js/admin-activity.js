// Draws the activity log: Super Admin sees everything, Mid Admin sees only their own actions.
function renderActivityLog() {
  const table = document.querySelector('[data-activity-table]');
  if (!table) return;

  const currentAdmin = getCurrentAdmin();
  const log = getActivityLog();
  const visibleEntries = hasPermission('activity.viewAll')
    ? log
    : log.filter(entry => currentAdmin && entry.adminEmail === currentAdmin.email);

  const tbody = table.querySelector('tbody');
  tbody.innerHTML = visibleEntries.map(entry => `
    <tr>
      <td>${new Date(entry.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</td>
      <td>${entry.adminEmail} <br><small>${ROLE_LABELS[entry.adminRole] || entry.adminRole}</small></td>
      <td>${entry.action}</td>
      <td>${entry.record}</td>
      <td>${entry.details}</td>
    </tr>
  `).join('') || '<tr><td colspan="5">No activity recorded yet.</td></tr>';
}

document.addEventListener('DOMContentLoaded', renderActivityLog);
