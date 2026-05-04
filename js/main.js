/* =============================================
   BIKO INDUSTRIES — Main JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile nav toggle --- */
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
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
    if (menu && toggle && !menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('open');
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
    let current = 0;
    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current < target) requestAnimationFrame(update);
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

  /* --- Contact form (Formspree) --- */
  const form = document.querySelector('.js-contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.innerHTML = '<p style="text-align:center;padding:32px;font-size:1.1rem;color:var(--green-deep);font-weight:600;">✓ Message sent! We\'ll be in touch shortly.</p>';
        } else {
          btn.textContent = orig;
          btn.disabled = false;
          alert('Something went wrong. Please email us directly at info@bikoindustries.com');
        }
      } catch {
        btn.textContent = orig;
        btn.disabled = false;
        alert('Something went wrong. Please email us directly at info@bikoindustries.com');
      }
    });
  }
});
