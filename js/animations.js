/* js/animations.js - GSAP & Interactive Micro-Animations */

function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  // 1. Hero Content Entrance Animation
  gsap.from('.hero-badge', {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.2
  });

  gsap.from('.hero-title', {
    duration: 1.2,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.4
  });

  gsap.from('.hero-desc', {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.6
  });

  gsap.from('.hero-ctas', {
    duration: 1,
    y: 20,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.8
  });

  // 2. Navbar entrance
  gsap.from('.navbar', {
    duration: 1,
    y: -80,
    opacity: 0,
    ease: 'power3.out'
  });
}

// 3D Card Tilt Effect on mousemove
function apply3DTiltToCards() {
  const cards = document.querySelectorAll('.product-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// Toast notification trigger
function showToast(message, type = 'gold') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">✨</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}
