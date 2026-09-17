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
// Delegated on document since some name fields are loaded dynamically after this script runs.
document.addEventListener('beforeinput', event => {
  if (event.target.matches('.letters-only') && event.data && /[^\p{L}' -]/u.test(event.data)) {
    event.preventDefault();
  }
});

document.addEventListener('input', event => {
  if (event.target.matches('.letters-only')) {
    event.target.value = event.target.value.replace(/[^\p{L}' -]/gu, '');
  }
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

// Validates required search fields before sending visitors to results.
function validateSearchForm(event) {
  const firstName = document.querySelector('input[name="firstName"]').value.trim();
  const lastName = document.querySelector('input[name="lastName"]').value.trim();
  const relationship = document.querySelector('[name="relationship"]').value;
  const nameFields = document.querySelectorAll('.letters-only');
  const deathYearInput = document.querySelector('[name="deathYear"]');
  const deathYear = Number(deathYearInput.value);
  const currentYear = new Date().getFullYear();

  if (firstName === '' || lastName === '') {
    event.preventDefault();
    document.getElementById('system-message-text').innerText = 'Please fill in both First Name and Last Name to search. Middle name and year of passing are optional.';
    openModal('system-message-modal');
    return;
  }

  if (relationship === '') {
    event.preventDefault();
    document.getElementById('system-message-text').innerText = 'Please select a relationship to continue.';
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
