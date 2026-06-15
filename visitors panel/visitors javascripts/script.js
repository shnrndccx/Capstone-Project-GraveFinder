// Floating particles
const container = document.getElementById('particles');
if (container) {
  for (let i = 0; i < 18; i++) {
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
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Toggle "Other" relationship input field
const relationshipSelect = document.getElementById('relationship-select');
const otherRelationshipGroup = document.getElementById('other-relationship-group');

if (relationshipSelect && otherRelationshipGroup) {
  relationshipSelect.addEventListener('change', (e) => {
    if (e.target.value === 'Other') {
      otherRelationshipGroup.style.display = 'flex';
    } else {
      otherRelationshipGroup.style.display = 'none';
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