function adminDisplayName(admin) {
  if (!admin) return 'Admin';
  if (admin.fullName) return admin.fullName;
  return admin.email ? admin.email.split('@')[0].replace(/[._-]+/g, ' ') : 'Admin';
}

function countPendingAppointments() {
  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments);
  return appointments.filter(appointment => appointment.status === 'Pending' && !isAppointmentArchived(appointment)).length;
}

function dashboardDateLabel(value) {
  if (!value) return 'Unknown';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function relativeTime(value) {
  if (!value) return '';
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return dashboardDateLabel(value);
}

function recordMonthKey(record) {
  const sourceDate = record.createdAt || record.deathDate || record.birthDate;
  if (!sourceDate) return 'Unknown';
  const date = new Date(`${sourceDate}`.includes('T') ? sourceDate : `${sourceDate}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function extractSection(location) {
  const text = String(location || 'Unspecified');
  const sectionMatch = text.match(/Section\s+([A-Za-z0-9-]+)/i);
  const gardenMatch = text.match(/Garden\s+of\s+([A-Za-z0-9 -]+)/i);
  if (sectionMatch) return `Section ${sectionMatch[1].toUpperCase()}`;
  if (gardenMatch) return `Garden of ${gardenMatch[1].trim().split(',')[0]}`;
  return text.split(',')[0].trim() || 'Unspecified';
}

function countBy(items, keyGetter) {
  return items.reduce((counts, item) => {
    const key = keyGetter(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function showEmptyChart(name, isEmpty) {
  const empty = document.querySelector(`[data-empty-chart="${name}"]`);
  if (empty) empty.classList.toggle('is-visible', isEmpty);
}

function renderChart(canvasId, emptyName, config, hasData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') {
    showEmptyChart(emptyName, true);
    return;
  }

  showEmptyChart(emptyName, !hasData);
  canvas.hidden = !hasData;
  if (!hasData) return;

  new Chart(canvas, config);
}

function chartBaseOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          boxWidth: 12,
          color: '#22362f',
          font: { family: 'Jost' }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#52665d', font: { family: 'Jost' } },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: '#52665d', font: { family: 'Jost' } },
        grid: { color: 'rgba(34,54,47,0.08)' }
      }
    }
  };
}

function renderBurialsChart(records) {
  const counts = countBy(records, recordMonthKey);
  const labels = Object.keys(counts).slice(-8);
  renderChart('burials-over-time-chart', 'burials-over-time', {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Records',
        data: labels.map(label => counts[label]),
        backgroundColor: 'rgba(63,111,88,0.72)',
        borderRadius: 6
      }]
    },
    options: chartBaseOptions()
  }, labels.length > 0);
}

function renderSectionChart(records) {
  const counts = countBy(records, record => extractSection(record.location));
  const labels = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 8);
  renderChart('records-by-section-chart', 'records-by-section', {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Burials',
        data: labels.map(label => counts[label]),
        backgroundColor: 'rgba(196,166,97,0.78)',
        borderRadius: 6
      }]
    },
    options: chartBaseOptions()
  }, labels.length > 0);
}

function renderAppointmentChart() {
  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments);
  const counts = countBy(appointments, appointment => appointment.status || 'Pending');
  const labels = Object.keys(counts);
  renderChart('appointment-status-chart', 'appointment-status', {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: labels.map(label => counts[label]),
        backgroundColor: ['#c4a661', '#3f6f58', '#a35d5d', '#8ba88e'],
        borderColor: '#fff',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: chartBaseOptions().plugins
    }
  }, labels.length > 0);
}

function renderArchiveChart(records) {
  const activeCount = records.filter(record => record.status !== 'archived').length;
  const archivedCount = records.filter(record => record.status === 'archived').length;
  renderChart('archive-ratio-chart', 'archive-ratio', {
    type: 'doughnut',
    data: {
      labels: ['Active', 'Archived'],
      datasets: [{
        data: [activeCount, archivedCount],
        backgroundColor: ['#3f6f58', '#a35d5d'],
        borderColor: '#fff',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: chartBaseOptions().plugins
    }
  }, activeCount + archivedCount > 0);
}

function renderAdminActivityChart() {
  const log = getActivityLog();
  const counts = countBy(log, entry => entry.adminEmail || 'Unknown');
  const labels = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 6);
  renderChart('admin-activity-chart', 'admin-activity', {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Actions',
        data: labels.map(label => counts[label]),
        backgroundColor: 'rgba(34,54,47,0.72)',
        borderRadius: 6
      }]
    },
    options: chartBaseOptions()
  }, labels.length > 0);
}

function renderRecentActivityFeed() {
  const feed = document.getElementById('dashboard-activity-feed');
  if (!feed) return;

  const entries = getActivityLog().slice(0, 7);
  feed.innerHTML = entries.map(entry => `
    <li>
      <strong>${entry.action} - ${entry.record}</strong>
      <span>${entry.adminEmail} • ${relativeTime(entry.timestamp)}</span>
    </li>
  `).join('') || '<li><strong>No activity yet</strong><span>Successful admin actions will appear here.</span></li>';
}

function renderDashboardAlerts() {
  const alerts = document.getElementById('dashboard-alerts');
  if (!alerts) return;

  const today = new Date().toISOString().slice(0, 10);
  const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments);
  const todaysAppointments = appointments.filter(appointment => String(appointment.dateTime || '').slice(0, 10) === today).length;
  const pendingAppointments = appointments.filter(appointment => appointment.status === 'Pending' && !isAppointmentArchived(appointment)).length;

  const items = [
    { title: `${todaysAppointments} appointment${todaysAppointments === 1 ? '' : 's'} today`, detail: 'Review the appointments page for today\'s schedule.', permission: 'appointments.view' },
    { title: `${pendingAppointments} pending appointment${pendingAppointments === 1 ? '' : 's'}`, detail: 'Pending requests may need confirmation.', permission: 'appointments.view' }
  ].filter(item => hasPermission(item.permission));

  alerts.innerHTML = items.map(item => `
    <div class="alert-item">
      <strong>${item.title}</strong>
      <span>${item.detail}</span>
    </div>
  `).join('') || '<div class="alert-item"><strong>No urgent alerts</strong><span>Nothing needs attention right now.</span></div>';
}

function openDashboardSummary(title, tag, body, linkHref, linkLabel = 'Open Page') {
  const titleEl = document.getElementById('dashboard-summary-title');
  const tagEl = document.getElementById('dashboard-summary-tag');
  const bodyEl = document.getElementById('dashboard-summary-body');
  const linkEl = document.getElementById('dashboard-summary-link');

  if (!titleEl || !tagEl || !bodyEl || !linkEl) return;

  titleEl.textContent = title;
  tagEl.textContent = tag;
  bodyEl.innerHTML = body;
  linkEl.href = linkHref;
  linkEl.textContent = linkLabel;
  openModal('dashboard-summary-modal');
}

function setupDashboardCards() {
  document.querySelectorAll('[data-dashboard-card]').forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.dashboardCard;
      const records = getRecords();
      const appointments = loadAdminData(APPOINTMENTS_KEY, defaultAppointments);
      const activeRecords = records.filter(record => record.status !== 'archived').length;
      const archivedRecords = records.filter(record => record.status === 'archived').length;
      const admins = getAdmins().filter(admin => admin.status !== 'Removed');
      const mediumAdmins = admins.filter(admin => admin.role === 'mid_admin').length;
      const lowAdmins = admins.filter(admin => admin.role === 'low_admin').length;
      const activities = getActivityLog();

      if (type === 'records') {
        openDashboardSummary(
          'Total Burial Records',
          'Database Management',
          `<strong>${activeRecords}</strong> active burial record${activeRecords === 1 ? '' : 's'} are available in the system.<br><strong>${archivedRecords}</strong> archived record${archivedRecords === 1 ? '' : 's'} are preserved in storage.`,
          'admin-records.html',
          'Open Records'
        );
        return;
      }

      if (type === 'admins') {
        openDashboardSummary(
          'Total Admin Accounts',
          'Super Admin',
          `<strong>${admins.length}</strong> authorized administrator account${admins.length === 1 ? '' : 's'} are listed.<br><strong>${mediumAdmins}</strong> Medium Admin${mediumAdmins === 1 ? '' : 's'} and <strong>${lowAdmins}</strong> Low Admin${lowAdmins === 1 ? '' : 's'} are currently registered.`,
          'admin-manage.html',
          'Open Manage Admins'
        );
        return;
      }

      if (type === 'activity') {
        const latest = activities[0];
        openDashboardSummary(
          'Activity Entries',
          'Audit Trail',
          `<strong>${activities.length}</strong> activity entr${activities.length === 1 ? 'y' : 'ies'} are recorded for accountability.<br>${latest ? `Latest action: <strong>${latest.action}</strong> by ${latest.adminEmail}.` : 'No recent administrative activity has been recorded yet.'}`,
          'admin-activity.html',
          'Open Activity Logs'
        );
        return;
      }

      if (type === 'appointments') {
        const pending = appointments.filter(item => item.status === 'Pending').length;
        const confirmed = appointments.filter(item => item.status === 'Confirmed').length;
        openDashboardSummary(
          'Pending Appointments',
          'Scheduling',
          `<strong>${pending}</strong> pending appointment${pending === 1 ? '' : 's'} need review.<br><strong>${confirmed}</strong> confirmed appointment${confirmed === 1 ? '' : 's'} are currently listed.`,
          'admin-appointments.html',
          'Open Appointments'
        );
        return;
      }

    });
  });
}

function renderUnifiedDashboard() {
  const currentAdmin = getCurrentAdmin();
  const roleLabel = currentAdmin ? ROLE_LABELS[currentAdmin.role] : '';
  const welcome = document.getElementById('admin-welcome-name');
  const role = document.getElementById('admin-role-label');
  const records = getRecords();

  if (welcome) welcome.textContent = `Welcome back, ${adminDisplayName(currentAdmin)}!`;
  if (role) role.textContent = roleLabel;

  document.querySelectorAll('[data-stat="total-records"]').forEach(item => {
    item.textContent = getActiveRecords().length.toLocaleString();
  });

  document.querySelectorAll('[data-stat="pending-appointments"]').forEach(item => {
    item.textContent = countPendingAppointments().toLocaleString();
  });

  const totalAdmins = document.querySelector('[data-stat="total-admins"]');
  if (totalAdmins && hasPermission('admins.manage')) {
    totalAdmins.textContent = getAdmins().filter(admin => admin.status !== 'Removed').length.toLocaleString();
  }

  const recentActivity = document.querySelector('[data-stat="recent-activity"]');
  if (recentActivity && hasPermission('activity.view')) {
    recentActivity.textContent = getActivityLog().length.toLocaleString();
  }

  renderBurialsChart(records);
  renderSectionChart(records);
  renderAppointmentChart();
  renderArchiveChart(records);
  renderAdminActivityChart();
  renderRecentActivityFeed();
  renderDashboardAlerts();
  setupDashboardCards();
}

document.addEventListener('DOMContentLoaded', renderUnifiedDashboard);
