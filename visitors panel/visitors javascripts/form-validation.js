// Replaces native browser validation tooltips with consistent inline error messages
// for every form across the site (visitor and admin pages alike).
(function () {
  const FIELD_SELECTOR = 'input, select, textarea';
  const PH_MOBILE_PATTERN = /^(\+63|0)9\d{9}$/;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const COMMON_EMAIL_PROVIDERS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
  const BLOCKED_EMAIL_NAMES = ['test', 'sample', 'example', 'fake', 'dummy', 'none', 'na'];

  function isPhoneField(field) {
    const label = labelTextFor(field).toLowerCase();
    const name = `${field.name || ''} ${field.id || ''}`.toLowerCase();
    return field.inputMode === 'tel' || field.type === 'tel' || field.classList.contains('numbers-only') || /contact|phone|mobile/.test(`${label} ${name}`);
  }

  function isEmailField(field) {
    return field.type === 'email' || /email/i.test(`${field.name || ''} ${field.id || ''} ${labelTextFor(field)}`);
  }

  function contactValidationMessage(value) {
    const cleanValue = value.trim();
    const digits = cleanValue.replace(/\D/g, '');

    if (!cleanValue) return '';
    if (!PH_MOBILE_PATTERN.test(cleanValue)) {
      return 'Please enter a real PH mobile number in 09XXXXXXXXX or +639XXXXXXXXX format.';
    }
    if (/^(\d)\1+$/.test(digits) || /^123456789/.test(digits.slice(-9))) {
      return 'Please enter your real contact number, not a dummy or repeated number.';
    }
    return '';
  }

  function emailValidationMessage(value, options = {}) {
    const cleanValue = value.trim().toLowerCase();
    const [localPart, domain] = cleanValue.split('@');
    const normalizedLocal = (localPart || '').replace(/[^a-z0-9]/g, '');

    if (!cleanValue) return '';
    if (!EMAIL_PATTERN.test(cleanValue)) {
      return 'Please enter a real email address using the correct format.';
    }
    if (options.requireCommonProvider && !COMMON_EMAIL_PROVIDERS.includes(domain)) {
      return 'Please use a real email from Gmail, Yahoo, Outlook, Hotmail, or iCloud.';
    }
    if (
      BLOCKED_EMAIL_NAMES.includes(localPart) ||
      BLOCKED_EMAIL_NAMES.some(word => normalizedLocal.includes(word)) ||
      /^(\w)\1{4,}$/.test(normalizedLocal)
    ) {
      return 'Please enter your real email address, not a dummy or sample email.';
    }
    return '';
  }

  window.GraveFinderValidation = {
    contactValidationMessage,
    emailValidationMessage,
    commonEmailProviders: COMMON_EMAIL_PROVIDERS
  };

  // Finds the visible label text for a field so error messages can reference it by name.
  function labelTextFor(field) {
    const group = field.closest('.field-group');
    const label = group ? group.querySelector('.field-label') : null;
    return label ? label.textContent.replace(/\*/g, '').trim() : 'this field';
  }

  // Reuses an existing .field-error-text element next to the field, or creates one.
  function errorElementFor(field) {
    const group = field.closest('.field-group');
    if (!group) return null;
    let error = group.querySelector('.field-error-text');
    if (!error) {
      error = document.createElement('small');
      error.className = 'field-error-text';
      group.appendChild(error);
    }
    return error;
  }

  // Builds a plain-language message for whichever constraint the field is failing.
  function messageFor(field) {
    const validity = field.validity;
    if (validity.valid) return '';
    if (validity.customError) return field.validationMessage;

    const label = labelTextFor(field);
    const lowerLabel = label.toLowerCase();

    if (validity.valueMissing) {
      return field.tagName === 'SELECT' ? `Please select the ${lowerLabel}.` : `Please enter the ${lowerLabel}.`;
    }
    if (validity.typeMismatch) {
      return field.type === 'email' ? 'Please enter a valid email address.' : `Please enter a valid ${lowerLabel}.`;
    }
    if (validity.patternMismatch) {
      return field.title || `Please enter a valid ${lowerLabel}.`;
    }
    if (validity.tooShort) {
      return `${label} must be at least ${field.minLength} characters.`;
    }
    if (validity.tooLong) {
      return `${label} must be no more than ${field.maxLength} characters.`;
    }
    if (validity.rangeUnderflow || validity.rangeOverflow) {
      return field.title || `Please enter a ${lowerLabel} within the allowed range.`;
    }
    if (validity.badInput) {
      return `Please enter a valid ${lowerLabel}.`;
    }
    return field.validationMessage || `Please provide a valid ${lowerLabel}.`;
  }

  function showError(field) {
    const error = errorElementFor(field);
    const message = messageFor(field);
    if (error) error.textContent = message ? `⚠ ${message}` : '';
    field.classList.toggle('input-invalid', Boolean(message));
    return !message;
  }

  function clearError(field) {
    const error = errorElementFor(field);
    if (error) error.textContent = '';
    field.classList.remove('input-invalid');
  }

  function validateField(field) {
    if (isPhoneField(field)) {
      field.setCustomValidity(contactValidationMessage(field.value));
    } else if (isEmailField(field)) {
      field.setCustomValidity(emailValidationMessage(field.value));
    }

    if (field.validity.valid) {
      clearError(field);
      return true;
    }
    return showError(field);
  }

  // Re-checks a field once the visitor starts correcting a message that's already showing.
  function recheckIfFlagged(event) {
    const field = event.target;
    if (!field.matches || !field.matches(FIELD_SELECTOR)) return;
    if (field.classList.contains('input-invalid') || field.validity.customError) {
      validateField(field);
    }
  }

  document.addEventListener('input', recheckIfFlagged, true);
  document.addEventListener('change', recheckIfFlagged, true);

  // Intercepts every form submission before any other handler can run, blocking submission
  // (and native browser tooltips) whenever a field fails its HTML5 validation constraints.
  document.addEventListener('submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    const fields = Array.from(form.querySelectorAll(FIELD_SELECTOR))
      .filter(field => !field.disabled && field.type !== 'hidden');

    let firstInvalid = null;
    fields.forEach(field => {
      const valid = validateField(field);
      if (!valid && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      event.preventDefault();
      event.stopImmediatePropagation();
      firstInvalid.focus();
    }
  }, true);
})();
