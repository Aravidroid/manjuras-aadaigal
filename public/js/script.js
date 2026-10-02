/**
 * Manjura's Aadaigal — Main JavaScript
 */
(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ── Mobile Menu ── */
  const mobileMenuPanel = $('#mobile-menu-panel');
  const mobileMenuBtn   = $('#mobile-menu-btn');
  const mobileMenuClose = $('#mobile-menu-close');
  const mobileBackdrop  = $('#mobile-menu-backdrop');

  function openMobileMenu() {
    mobileMenuPanel?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenuPanel?.classList.remove('active');
    document.body.style.overflow = '';
  }
  mobileMenuBtn?.addEventListener('click', openMobileMenu);
  mobileMenuClose?.addEventListener('click', closeMobileMenu);
  mobileBackdrop?.addEventListener('click', closeMobileMenu);

  /* ── Search Panel ── */
  const searchPanel    = $('#search-panel');
  const searchBtn      = $('#search-btn');
  const searchClose    = $('#search-close');
  const searchBackdrop = $('#search-backdrop');
  const searchDropdown = $('#search-dropdown');
  const searchInput    = $('#search-input');

  if (searchDropdown) {
    searchDropdown.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
    searchDropdown.style.transform  = 'translateY(-100%)';
  }

  function openSearch() {
    searchPanel?.classList.add('active');
    if (searchDropdown) searchDropdown.style.transform = 'translateY(0)';
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput?.focus(), 120);
  }
  function closeSearch() {
    searchPanel?.classList.remove('active');
    if (searchDropdown) searchDropdown.style.transform = 'translateY(-100%)';
    document.body.style.overflow = '';
  }
  searchBtn?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  searchBackdrop?.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeMobileMenu(); closeSearch(); }
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim())
      window.location.href = `/search?q=${encodeURIComponent(searchInput.value.trim())}`;
  });

  /* ── Header Scroll ── */
  const header = $('#site-header');
  let lastScroll = 0, ticking = false;

  if (header) header.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease';

  function handleScroll() {
    const s = window.scrollY;
    if (header) {
      header.classList.toggle('shadow-luxury', s > 80);
      if (s > 300) {
        header.style.transform = s > lastScroll ? 'translateY(-100%)' : 'translateY(0)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }
    lastScroll = s;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(handleScroll); ticking = true; }
  }, { passive: true });

  /* ── Fade-up IntersectionObserver ── */
  const fadeEls = $$('.fade-up');
  if ('IntersectionObserver' in window && fadeEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseFloat(el.style.animationDelay) || 0;
          setTimeout(() => el.classList.add('visible'), delay * 1000);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach((el) => io.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add('visible'));
  }

  /* ── Hero Parallax ── */
  const heroBg = $('#hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight)
        heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    }, { passive: true });
  }

})();
