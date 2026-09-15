const introScreen = document.getElementById('introScreen');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (introScreen) {
  const introSeenKey = 'graveFinderIntroSeen';

  // Hides the opening screen and remembers it for this browser tab.
  const hideIntro = () => {
    introScreen.classList.add('hidden');
    sessionStorage.setItem(introSeenKey, 'true');
  };

  if (sessionStorage.getItem(introSeenKey) === 'true') {
    introScreen.classList.add('hidden');
  } else {
    window.addEventListener('load', () => {
      setTimeout(hideIntro, 3000);
    });

    introScreen.addEventListener('click', hideIntro);
    introScreen.addEventListener('touchstart', hideIntro, { passive: true });
  }
}

// Reveals section content when it enters the viewport.
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
}

// Shows the custom relationship field only when "Other" is selected.
const relationshipSelect = document.getElementById('relationship-select');
const otherRelationshipGroup = document.getElementById('other-relationship-group');
const otherRelationshipInput = document.getElementById('otherRelationshipInput');

// Prevent numbers and other non-letter characters in name-like fields, including pasted text.
document.querySelectorAll('.letters-only').forEach(input => {
  input.addEventListener('beforeinput', event => {
    if (event.data && /[^\p{L}' -]/u.test(event.data)) {
      event.preventDefault();
    }
  });

  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^\p{L}' -]/gu, '');
  });
});

if (relationshipSelect && otherRelationshipGroup && otherRelationshipInput) {
  relationshipSelect.addEventListener('change', event => {
    if (event.target.value === 'Other') {
      otherRelationshipGroup.style.display = 'flex';
      otherRelationshipInput.required = true;
      otherRelationshipInput.focus();
    } else {
      otherRelationshipGroup.style.display = 'none';
      otherRelationshipInput.required = false;
      otherRelationshipInput.value = '';
    }
  });
}

// Opens reusable modal dialogs across visitor and admin pages.
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Closes reusable modal dialogs and restores page scrolling.
function closeModal(event, modalId) {
  if (event) {
    event.stopPropagation();
  }

  document.getElementById(modalId).classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Opens and closes the homepage dropdown menu.
function toggleMenu() {
  const dropdown = document.getElementById('navDropdown');
  if (dropdown) dropdown.classList.toggle('active');
}

// Closes the dropdown when the visitor clicks outside it.
window.addEventListener('click', event => {
  const container = document.querySelector('.nav-menu-container');
  const dropdown = document.getElementById('navDropdown');
  if (container && dropdown && !container.contains(event.target)) {
    dropdown.classList.remove('active');
  }
});

// Validates required search fields before sending visitors to results.
function validateSearchForm(event) {
  const firstName = document.querySelector('input[name="firstName"]').value.trim();
  const lastName = document.querySelector('input[name="lastName"]').value.trim();
  const nameFields = document.querySelectorAll('.letters-only');
  const deathYearInput = document.querySelector('[name="deathYear"]');
  const deathYear = Number(deathYearInput.value);
  const currentYear = new Date().getFullYear();

  if (firstName === '' || lastName === '') {
    event.preventDefault();
    document.getElementById('system-message-text').innerText = 'Please fill in both First Name and Last Name to search. Middle name, year of passing, and relationship are optional.';
    openModal('system-message-modal');
    return;
  }

  if ([...nameFields].some(field => !/^[\p{L}' -]*$/u.test(field.value))) {
    event.preventDefault();
    document.getElementById('system-message-text').innerText = 'Names and relationship details may contain letters only.';
    openModal('system-message-modal');
    return;
  }

  if (deathYearInput.value && (deathYear < 1978 || deathYear > currentYear)) {
    event.preventDefault();
    document.getElementById('system-message-text').innerText = `Death year must be from 1978 up to ${currentYear} only.`;
    openModal('system-message-modal');
  }
}

// Validates appointment requests for dates in the current month and park hours.
function submitAppointment(event) {
  event.preventDefault();

  const form = event.target;
  const dateInput = form.querySelector('[name="appointmentDate"]');
  const timeInput = form.querySelector('[name="appointmentTime"]');
  const selectedDate = new Date(`${dateInput.value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const timeValue = timeInput.value;

  if (!dateInput.value || selectedDate < today || selectedDate > lastDayOfMonth) {
    document.getElementById('system-message-text').innerText = 'Please select an appointment date from today through the end of this month.';
    openModal('system-message-modal');
    return;
  }

  if (!timeValue || timeValue < '08:00' || timeValue > '17:00') {
    document.getElementById('system-message-text').innerText = 'Please select an appointment time between 8:00 AM and 5:00 PM.';
    openModal('system-message-modal');
    return;
  }

  document.getElementById('system-message-text').innerText = 'Your appointment details are valid. Please contact a staff member using the contact details to confirm the schedule.';
  closeModal(event, 'appointment-modal');
  openModal('system-message-modal');
  form.reset();
}

// Keeps appointment time input within the office schedule while the visitor types.
function validateAppointmentTime(input) {
  const isOutsideOfficeHours = input.value && (input.value < '08:00' || input.value > '17:00');
  if (isOutsideOfficeHours) {
    input.value = '';
    input.setCustomValidity('Appointments are available only from 8:00 AM to 5:00 PM.');
    return;
  }

  input.setCustomValidity('');
}

// Builds the year dropdown from the current year down to the park's founding year.
document.addEventListener('DOMContentLoaded', () => {
  const deathYearSelect = document.getElementById('death-year-select');
  if (!deathYearSelect) return;

  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1978; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    deathYearSelect.appendChild(option);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const appointmentDate = document.getElementById('appointment-date');
  const dateHelp = document.getElementById('appointment-date-help');
  if (!appointmentDate) return;

  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  appointmentDate.min = formatDate(today);
  appointmentDate.max = formatDate(lastDayOfMonth);
  dateHelp.textContent = `Available until ${lastDayOfMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.`;
});
