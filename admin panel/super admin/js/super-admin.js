// Fills the roster summary stat cards on the Super Admin dashboard.
function renderAdminRosterStats() {
  const admins = getAdmins();

  const totalValue = document.querySelector('[data-stat="total-admins"]');
  const activeValue = document.querySelector('[data-stat="active-admins"]');
  const midValue = document.querySelector('[data-stat="mid-admins"]');
  const lowValue = document.querySelector('[data-stat="low-admins"]');

  if (totalValue) totalValue.textContent = admins.length;
  if (activeValue) activeValue.textContent = admins.filter(admin => admin.status === 'Active').length;
  if (midValue) midValue.textContent = admins.filter(admin => admin.role === 'mid_admin').length;
  if (lowValue) lowValue.textContent = admins.filter(admin => admin.role === 'low_admin').length;
}

document.addEventListener('DOMContentLoaded', renderAdminRosterStats);
