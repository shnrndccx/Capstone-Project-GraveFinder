// Loads the hamburger menu's modals and wires up its open/close behavior.
(function () {
  loadIntoMount('appointment-modal-mount', 'hamburg menu/appointment-modal.html', initAppointmentForm);
  loadIntoMount('faq-modal-mount', 'hamburg menu/faq-modal.html');
  loadIntoMount('guidelines-modal-mount', 'hamburg menu/guidelines-modal.html');

  function loadIntoMount(mountId, url, onLoaded) {
    const mount = document.getElementById(mountId);
    if (!mount) return;

    fetch(url)
      .then(response => response.text())
      .then(html => {
        mount.outerHTML = html;
        if (onLoaded) onLoaded();
      });
  }

  // Opens and closes the homepage dropdown menu.
  window.toggleMenu = function toggleMenu() {
    const dropdown = document.getElementById('navDropdown');
    if (dropdown) dropdown.classList.toggle('active');
  };

  // Closes the dropdown when the visitor clicks outside it.
  document.addEventListener('click', event => {
    const container = document.querySelector('.nav-menu-container');
    const dropdown = document.getElementById('navDropdown');
    if (container && dropdown && !container.contains(event.target)) {
      dropdown.classList.remove('active');
    }
  });

  const PH_MOBILE_PATTERN = /^(\+63|0)9\d{9}$/;
  const ALLOWED_EMAIL_PROVIDERS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];

  // Flags a field red with an inline message, or clears it once the value is valid.
  function setFieldError(input, errorElement, message) {
    if (message) {
      input.classList.add('input-invalid');
      errorElement.innerText = message;
    } else {
      input.classList.remove('input-invalid');
      errorElement.innerText = '';
    }
  }

  // Sets up the appointment form's fields once its markup has been injected.
  function initAppointmentForm() {
    const appointmentDate = document.getElementById('appointment-date');
    const dateHelp = document.getElementById('appointment-date-help');

    if (appointmentDate && dateHelp) {
      const formatDate = date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const today = new Date();
      const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      appointmentDate.min = formatDate(tomorrow);
      appointmentDate.max = formatDate(lastDayOfMonth);
      dateHelp.textContent = `Available from ${tomorrow.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} until ${lastDayOfMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.`;
    }

    // Prevent letters and symbols (other than a leading +) in the phone number field, including pasted text.
    document.querySelectorAll('.numbers-only').forEach(input => {
      const errorElement = document.getElementById(`${input.id}-error`);

      input.addEventListener('beforeinput', event => {
        if (event.data && /[^\d+]/.test(event.data)) {
          event.preventDefault();
          if (errorElement) {
            input.classList.add('input-invalid');
            errorElement.innerText = 'Numbers only. Please enter a valid mobile number.';
          }
        }
      });

      input.addEventListener('input', () => {
        const hasLeadingPlus = input.value.startsWith('+');
        const digits = input.value.replace(/\D/g, '');
        input.value = hasLeadingPlus ? `+${digits}` : digits;

        if (errorElement) {
          const message = input.value && !PH_MOBILE_PATTERN.test(input.value)
            ? 'Numbers only. Must be a valid mobile number starting with 09 or +63.'
            : '';
          setFieldError(input, errorElement, message);
        }
      });
    });

    const emailInput = document.getElementById('appointment-email');
    const emailError = document.getElementById('appointment-email-error');

    if (emailInput && emailError) {
      emailInput.addEventListener('input', () => {
        const value = emailInput.value.trim().toLowerCase();
        const domain = value.split('@')[1];
        const message = value && !ALLOWED_EMAIL_PROVIDERS.includes(domain)
          ? 'Please use an email from a legit provider only (Gmail, Yahoo, Outlook, Hotmail, or iCloud).'
          : '';
        setFieldError(emailInput, emailError, message);
      });
    }
  }

  // Keeps appointment time input within the office schedule while the visitor types.
  window.validateAppointmentTime = function validateAppointmentTime(input) {
    const isOutsideOfficeHours = input.value && (input.value < '08:00' || input.value > '17:00');
    if (isOutsideOfficeHours) {
      input.value = '';
      input.setCustomValidity('Appointments are available only from 8:00 AM to 5:00 PM.');
      return;
    }

    input.setCustomValidity('');
  };

  // Validates appointment requests for contact details, dates, and park hours.
  window.submitAppointment = function submitAppointment(event) {
    event.preventDefault();

    const form = event.target;

    if (!form.checkValidity()) {
      document.getElementById('system-message-text').innerText = 'Please answer all required fields before submitting.';
      openModal('system-message-modal');
      return;
    }

    const contactInput = form.querySelector('[name="appointmentContact"]');
    const contactValue = contactInput.value.trim();

    if (!PH_MOBILE_PATTERN.test(contactValue)) {
      document.getElementById('system-message-text').innerText = 'Please enter a valid contact number starting with 09 or +63, followed by 9 more digits (11 digits total for 09 numbers).';
      openModal('system-message-modal');
      return;
    }

    const emailInput = form.querySelector('[name="appointmentEmail"]');
    const emailValue = emailInput.value.trim().toLowerCase();
    const emailDomain = emailValue.split('@')[1];

    if (!ALLOWED_EMAIL_PROVIDERS.includes(emailDomain)) {
      document.getElementById('system-message-text').innerText = 'Please use an email from a legit provider only, such as Gmail, Yahoo, Outlook, Hotmail, or iCloud.';
      openModal('system-message-modal');
      return;
    }

    const dateInput = form.querySelector('[name="appointmentDate"]');
    const timeInput = form.querySelector('[name="appointmentTime"]');
    const selectedDate = new Date(`${dateInput.value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const timeValue = timeInput.value;

    if (!dateInput.value || selectedDate < tomorrow || selectedDate > lastDayOfMonth) {
      document.getElementById('system-message-text').innerText = 'Please select an appointment date starting tomorrow through the end of this month.';
      openModal('system-message-modal');
      return;
    }

    if (!timeValue || timeValue < '08:00' || timeValue > '17:00') {
      document.getElementById('system-message-text').innerText = 'Please select an appointment time between 8:00 AM and 5:00 PM.';
      openModal('system-message-modal');
      return;
    }

    document.getElementById('system-message-text').innerText = 'Your appointment request has been submitted. Please wait for a staff member to contact you through your email or phone number, so please check them regularly.';
    closeModal(event, 'appointment-modal');
    openModal('system-message-modal');
    form.reset();
  };
})();
