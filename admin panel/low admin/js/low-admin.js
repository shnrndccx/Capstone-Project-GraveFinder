// Fills the Grave Records total on the Low Admin dashboard.
document.addEventListener('DOMContentLoaded', () => {
  const totalValue = document.querySelector('[data-stat="total-records"]');
  if (totalValue) totalValue.textContent = getRecords().length.toLocaleString();
});
