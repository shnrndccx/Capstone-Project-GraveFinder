const introScreen = document.getElementById('introScreen');

if (introScreen) {
  const hideIntro = () => {
    introScreen.classList.add('hidden');
  };

  window.addEventListener('load', () => {
    setTimeout(() => {
      hideIntro();
    }, 3000);
  });

  introScreen.addEventListener('click', hideIntro);
  introScreen.addEventListener('touchstart', hideIntro, { passive: true });
}

// Floating particles
const container = document.getElementById('particles');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 700px)').matches;

if (container && !prefersReducedMotion) {
  const particleCount = isSmallScreen ? 6 : 18;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      animation-duration:${Math.random()*15+10}s;
      animation-delay:${Math.random()*10}s;
      opacity:${Math.random()*0.4+0.1};
    `;
    container.appendChild(p);
  }
}

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('visible'));
}

// Toggle "Other" relationship input field
const relationshipSelect = document.getElementById('relationship-select');
const otherRelationshipGroup = document.getElementById('other-relationship-group');
const otherRelationshipInput = document.getElementById('otherRelationshipInput');

if (relationshipSelect && otherRelationshipGroup && otherRelationshipInput) {
  relationshipSelect.addEventListener('change', (e) => {
    if (e.target.value === 'Other') {
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

// ─── MODAL LOGIC ───
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal(event, modalId) {
  if (event) {
    event.stopPropagation(); // Prevent clicks inside the modal from closing it
  }
  document.getElementById(modalId).classList.remove('active');
  document.body.style.overflow = 'auto'; // Restore scrolling
}
