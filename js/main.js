(() => {
  'use strict';

  /* ── Loader ─────────────────────────────────────── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('is-hidden'), 350);
  });

  /* ── Navbar scroll state ────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile menu ────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mob-menu');
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    mobMenu.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    mobMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  /* ── Scroll reveal ──────────────────────────────── */
  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealItems.forEach(el => revealObserver.observe(el));

  /* ── Animated counters ──────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterObserver.observe(el));

  /* ── Marquee content ────────────────────────────── */
  const marquee = document.getElementById('marquee');
  if (marquee) {
    const items = [
      { icon: 'fa-solid fa-spray-can-sparkles', text: 'Fumigación Ecológica' },
      { icon: 'fa-solid fa-droplet', text: 'Desinfección y Sanitización' },
      { icon: 'fa-solid fa-shield-cat', text: 'Control de Fauna Nociva' },
      { icon: 'fa-solid fa-leaf', text: 'Productos Biodegradables' },
      { icon: 'fa-solid fa-house-chimney', text: 'Servicio Residencial' },
      { icon: 'fa-solid fa-shop', text: 'Servicio Comercial' },
      { icon: 'fa-solid fa-magnifying-glass', text: 'Inspección Certificada' },
      { icon: 'fa-solid fa-recycle', text: 'Enfoque 100% Sostenible' },
    ];
    const buildSet = () => items.map(i =>
      `<span class="marquee-item"><i class="${i.icon}"></i>${i.text}</span>`
    ).join('');
    marquee.innerHTML = buildSet() + buildSet();
  }

  /* ── Hero particle canvas ───────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h, dpr;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      const count = Math.min(48, Math.floor((w * h) / 26000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.08 - Math.random() * 0.18,
        a: 0.15 + Math.random() * 0.35,
        hue: Math.random() > 0.5 ? '126,217,87' : '46,196,182',
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${p.a})`;
        ctx.shadowColor = `rgba(${p.hue},${p.a})`;
        ctx.shadowBlur = 6;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();
    initParticles();
    if (!prefersReducedMotion) requestAnimationFrame(tick);
    window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });
  }

  /* ── Footer year ────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Contact form → WhatsApp handoff ────────────── */
  const waForm = document.getElementById('wa-form');
  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('f-name').value.trim();
      const interest = document.getElementById('f-interest').value;
      const msg = document.getElementById('f-msg').value.trim();

      const text =
        `Hola, soy ${name}. Me interesa: ${interest}.\n\n${msg}`;

      /* TODO: reemplazar con el número real de WhatsApp del negocio */
      const phone = '52XXXXXXXXXX';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
})();
