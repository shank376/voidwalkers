(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const toast = document.querySelector('.toast');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A slim reading-progress indicator makes long pages feel more responsive.
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span></span>';
  document.body.appendChild(progress);

  let ticking = false;
  const updateScrollUI = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    document.documentElement.style.setProperty('--scroll-progress', progressValue);
    header.classList.toggle('scrolled', window.scrollY > 30);

    if (!reducedMotion && window.innerWidth > 680) {
      const heroImage = document.querySelector('.hero-image');
      if (heroImage && window.scrollY < window.innerHeight) {
        heroImage.style.transform = 'translate3d(0,' + (window.scrollY * 0.16) + 'px,0) scale(1.04)';
      }
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();

  function closeMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(opening));
      menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('open', opening);
      document.body.classList.toggle('menu-open', opening);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3200);
  }
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => showToast('Your email app will open so you can contact Voidwalkers.'));
  });

  // Reveal complete content groups as they enter the viewport, with a subtle stagger.
  const revealGroups = [
    ['.intro-grid', 'reveal-up'],
    ['.intro-image-row', 'reveal-up'],
    ['.section-heading-row', 'reveal-up'],
    ['.category-card', 'reveal-up'],
    ['.step', 'reveal-up'],
    ['.manifesto-content', 'reveal-left'],
    ['.archive-head', 'reveal-up'],
    ['.archive-placeholder', 'reveal-scale'],
    ['.principles-grid', 'reveal-up'],
    ['.principle-list > div', 'reveal-right'],
    ['.join-image', 'reveal-left'],
    ['.join-content', 'reveal-right'],
    ['.footer-top', 'reveal-up']
  ];

  const revealTargets = [];
  revealGroups.forEach(([selector, className]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add(className);
      if (['.category-card', '.step', '.principle-list > div'].includes(selector)) {
        element.style.setProperty('--reveal-delay', Math.min(index % 5, 4) * 85 + 'ms');
      }
      revealTargets.push(element);
    });
  });

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach(element => observer.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add('is-visible'));
  }

  // Highlight the section currently being explored in the desktop navigation.
  if ('IntersectionObserver' in window) {
    const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
    const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active-section', active);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => activeObserver.observe(section));
  }
})();