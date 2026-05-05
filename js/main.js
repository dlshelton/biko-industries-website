/* =============================================
   BIKO INDUSTRIES — Main JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile nav toggle --- */
  const toggle    = document.querySelector('.nav-toggle');
  const headerNav = document.querySelector('.header-nav');
  if (toggle && headerNav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      headerNav.classList.toggle('open');
    });
  }

  /* --- Mobile dropdown toggles --- */
  document.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('.nav-link[data-dropdown]');
    if (!link) return;
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });

  /* --- Close menu on outside click --- */
  document.addEventListener('click', (e) => {
    if (headerNav && toggle && !headerNav.contains(e.target) && !toggle.contains(e.target)) {
      headerNav.classList.remove('open');
      toggle.classList.remove('open');
    }
  });

  /* --- Hero slider --- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let current  = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  if (slides.length > 0) {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startTimer(); });
    });
    startTimer();
  }

  /* --- Warehouse carousel --- */
  const track    = document.querySelector('.warehouse-track');
  const wSlides  = document.querySelectorAll('.warehouse-slide');
  const prevBtn  = document.querySelector('.carousel-btn-prev');
  const nextBtn  = document.querySelector('.carousel-btn-next');
  let wCurrent   = 0;

  function updateCarousel() {
    if (track) track.style.transform = `translateX(-${wCurrent * 100}%)`;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => {
    wCurrent = (wCurrent - 1 + wSlides.length) % wSlides.length;
    updateCarousel();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    wCurrent = (wCurrent + 1) % wSlides.length;
    updateCarousel();
  });

  /* --- Animated counters --- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let count = 0;
    const update = () => {
      count = Math.min(count + step, target);
      el.textContent = Math.floor(count).toLocaleString();
      if (count < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  /* --- Scroll reveal --- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => revealObserver.observe(el));
  }

  /* --- Sticky header shadow --- */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });


  /* =============================================
     CONTENT PROTECTION
     ============================================= */

  /* Disable right-click context menu */
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  /* Block copy / cut */
  document.addEventListener('copy', (e) => {
    const active = document.activeElement;
    const inForm = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT');
    if (!inForm) {
      e.preventDefault();
      return false;
    }
  });
  document.addEventListener('cut', (e) => {
    const active = document.activeElement;
    const inForm = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
    if (!inForm) {
      e.preventDefault();
      return false;
    }
  });

  /* Block keyboard shortcuts: view-source, save, select-all, dev-tools */
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const inForm = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT');
    if (inForm) return;

    const ctrl = e.ctrlKey || e.metaKey;
    const key  = e.key.toLowerCase();

    if (
      (ctrl && (key === 'u' || key === 's' || key === 'a' || key === 'p')) ||
      e.key === 'F12' ||
      (ctrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c' || key === 'k'))
    ) {
      e.preventDefault();
      return false;
    }
  });

  /* Disable image drag */
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });

});
