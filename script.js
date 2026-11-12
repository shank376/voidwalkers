const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const toast = document.querySelector('.toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3200);
}

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// The contact CTA uses an email link for the first version. This keeps the site honest:
// no application is stored until a real membership backend is connected.
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', () => {
    showToast('Your email app will open so you can contact Voidwalkers.');
  });
});

// Reveal sections gently as they enter the viewport.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealTargets = document.querySelectorAll('.step, .category-card, .principle-list > div, .archive-placeholder');
  revealTargets.forEach(el => el.classList.add('will-reveal'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => observer.observe(el));
}
