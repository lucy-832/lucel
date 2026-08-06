/* =========================================================
   LUCELLE DIGITAL — SHARED SITE SCRIPT
   Same behaviors as the main site (nav, theme, reveal-on-
   scroll, back-to-top, toast) so every page feels identical.
   Uses the SAME localStorage key ('lucelle-theme') as
   lucel.html so the dark/light choice stays in sync site-wide.
   ========================================================= */
window.LucelleSite = (() => {
  'use strict';

  const init = () => {
    /* ---------- YEAR ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- STICKY NAV ---------- */
    const navWrap = document.getElementById('navWrap');
    if (navWrap) {
      const onScroll = () => navWrap.classList.toggle('is-scrolled', window.scrollY > 40);
      document.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ---------- MOBILE MENU ---------- */
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');
    if (burger && navLinks) {
      burger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
      });
      navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }));
    }

    /* ---------- DARK MODE ---------- */
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const root = document.documentElement;
      const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
        themeToggle.innerHTML = theme === 'dark'
          ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
          : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
        localStorage.setItem('lucelle-theme', theme);
      };
      const savedTheme = localStorage.getItem('lucelle-theme')
        || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      applyTheme(savedTheme);
      themeToggle.addEventListener('click', () => {
        applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      });
    }

    /* ---------- SCROLL REVEAL (works for elements added later too) ---------- */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
    window.LucelleSite.observeReveal = (el) => revealObserver.observe(el);

    /* ---------- BUTTON RIPPLE (works for buttons added later too) ---------- */
    const wireRipple = (btn) => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty('--rx', `${e.clientX - rect.left}px`);
        btn.style.setProperty('--ry', `${e.clientY - rect.top}px`);
        btn.classList.remove('is-rippling');
        void btn.offsetWidth;
        btn.classList.add('is-rippling');
      });
    };
    document.querySelectorAll('.btn--ripple').forEach(wireRipple);
    window.LucelleSite.wireRipple = wireRipple;

    /* ---------- BACK TO TOP ---------- */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      document.addEventListener('scroll', () => backToTop.classList.toggle('is-visible', window.scrollY > 600), { passive: true });
      backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  };

  /* ---------- TOAST (shared) ---------- */
  let toastTimer;
  const showToast = (message, icon = 'fa-circle-check') => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3800);
  };

  document.addEventListener('DOMContentLoaded', init);

  return { showToast };
})();
