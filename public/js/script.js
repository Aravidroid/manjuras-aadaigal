/**
 * Manjura's Aadaigal — Main JavaScript
 * Handles Navigation, Search, Cart Drawer, AJAX Cart Management & WhatsApp
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

  /* ── Cart Slide-out Drawer ── */
  const cartDrawerPanel    = $('#cart-drawer-panel');
  const cartDrawerClose    = $('#cart-drawer-close');
  const cartDrawerBackdrop = $('#cart-drawer-backdrop');
  const headerCartBtn      = $('#header-cart-btn');
  const headerCartBadge    = $('#header-cart-badge');
  const drawerItemsList    = $('#drawer-items-list');
  const drawerEmptyMsg     = $('#drawer-empty-msg');
  const drawerSubtotal     = $('#drawer-subtotal');
  const drawerItemCount    = $('#drawer-item-count');

  function openCartDrawer() {
    refreshCartDrawer();
    cartDrawerPanel?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    cartDrawerPanel?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Intercept header cart icon to open drawer smoothly if not on /cart page
  if (headerCartBtn && !window.location.pathname.startsWith('/cart')) {
    headerCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  cartDrawerClose?.addEventListener('click', closeCartDrawer);
  cartDrawerBackdrop?.addEventListener('click', closeCartDrawer);

  /* ── Global Keydown Listener ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeSearch();
      closeCartDrawer();
    }
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim())
      window.location.href = `/search?q=${encodeURIComponent(searchInput.value.trim())}`;
  });

  /* ── Header Scroll & Scroll Progress Indicator ── */
  const header = $('#site-header');
  const scrollProgressBar = $('#scroll-progress-bar');
  let lastScroll = 0, ticking = false;

  if (header) header.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease';

  function handleScroll() {
    const s = window.scrollY;
    
    // Update Scroll Progress bar
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (s / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

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
          const delay = parseFloat(el.dataset.delay || el.style.animationDelay) || 0;
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

  /* ── AJAX Cart Functions ── */
  async function refreshCartDrawer() {
    try {
      const res = await fetch('/api/cart', {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) return;
      const data = await res.json();
      renderDrawerData(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }

  function updateBadgeCount(count) {
    if (headerCartBadge) {
      headerCartBadge.textContent = count;
      if (count > 0) {
        headerCartBadge.classList.remove('hidden');
      } else {
        headerCartBadge.classList.add('hidden');
      }
    }
    if (drawerItemCount) {
      drawerItemCount.textContent = count;
    }
  }

  function renderDrawerData(data) {
    const { cart, totals } = data;
    updateBadgeCount(totals.totalItems);

    if (drawerSubtotal) {
      drawerSubtotal.textContent = `₹${totals.subtotal.toLocaleString('en-IN')}`;
    }

    if (!drawerItemsList) return;

    if (!cart.items || cart.items.length === 0) {
      drawerItemsList.innerHTML = '';
      if (drawerEmptyMsg) {
        drawerEmptyMsg.classList.remove('hidden');
        drawerItemsList.appendChild(drawerEmptyMsg);
      }
      return;
    }

    if (drawerEmptyMsg) drawerEmptyMsg.classList.add('hidden');

    // Build items HTML
    let html = '';
    cart.items.forEach(item => {
      const unitPrice = item.price + (item.optionPrice || 0);
      html += `
        <div class="flex gap-3 py-3 border-b border-[var(--color-cream-deeper)] items-center">
          <a href="/product/${item.slug}" class="w-16 h-20 flex-shrink-0 bg-[var(--color-cream-dark)] overflow-hidden">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover"/>
          </a>
          <div class="flex-1 min-w-0">
            <a href="/product/${item.slug}" class="font-display text-base text-[var(--color-text-primary)] hover:text-[var(--color-maroon)] truncate block">
              ${item.name}
            </a>
            <div class="text-[0.7rem] text-[var(--color-text-muted)] mt-0.5">
              ${item.size ? `<span>Size: ${item.size}</span>` : ''}
              ${item.optionName ? `<span class="block truncate">${item.optionName}</span>` : ''}
            </div>
            <div class="font-body font-semibold text-xs text-[var(--color-maroon)] mt-1">
              ₹${unitPrice.toLocaleString('en-IN')}
            </div>

            <!-- Qty row -->
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center border border-[var(--color-cream-deeper)] bg-white text-xs">
                <button type="button" class="w-6 h-6 flex items-center justify-center hover:bg-[var(--color-cream-dark)]" onclick="window.updateCartItemQty('${item.key}', -1)">−</button>
                <span class="w-7 text-center font-semibold">${item.quantity}</span>
                <button type="button" class="w-6 h-6 flex items-center justify-center hover:bg-[var(--color-cream-dark)]" onclick="window.updateCartItemQty('${item.key}', 1)">+</button>
              </div>

              <button type="button" class="text-[0.68rem] text-red-600 hover:text-red-800 uppercase tracking-wider" onclick="window.removeCartItem('${item.key}')">
                Remove
              </button>
            </div>
          </div>
        </div>
      `;
    });

    drawerItemsList.innerHTML = html;
  }

  // Global window methods for inline onclick
  window.updateCartItemQty = async function(key, delta) {
    try {
      const res = await fetch('/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ key, delta })
      });
      const data = await res.json();
      if (data.success) {
        renderDrawerData(data);
        // If user is on full /cart page, reload to reflect server page state
        if (window.location.pathname.startsWith('/cart')) {
          window.location.reload();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  window.removeCartItem = async function(key) {
    try {
      const res = await fetch('/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ key })
      });
      const data = await res.json();
      if (data.success) {
        renderDrawerData(data);
        if (window.location.pathname.startsWith('/cart')) {
          window.location.reload();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };


  /* ── Option 3: Zari Thread Sparkle & Starlight Trail ── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'zari-sparkle-cursor';
    cursor.innerHTML = '✦';
    document.body.appendChild(cursor);

    let mouseX = -100, mouseY = -100, curX = -100, curY = -100;
    let lastParticleTime = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Spawn subtle gold trail particle (throttled every 45ms)
      const now = performance.now();
      if (now - lastParticleTime > 45) {
        lastParticleTime = now;
        const particle = document.createElement('span');
        particle.className = 'zari-trail-particle';
        particle.style.left = `${e.clientX + (Math.random() * 8 - 4)}px`;
        particle.style.top = `${e.clientY + (Math.random() * 8 - 4)}px`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 550);
      }
    }, { passive: true });

    function renderCursor() {
      curX += (mouseX - curX) * 0.22;
      curY += (mouseY - curY) * 0.22;
      cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Uruli Water Ripple on Click
    window.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      ripple.className = 'zari-click-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    }, { passive: true });

    // Enlarge & glow on interactive elements
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, input, .product-card, .category-card')) {
        cursor.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, input, .product-card, .category-card')) {
        cursor.classList.remove('cursor-hover');
      }
    });
  }

  /* ── Fly-to-Cart Animation ── */
  function flyToCartAnimation(sourceElement) {
    const targetCart = $('#header-cart-btn') || $('#header-cart-badge');
    if (!sourceElement || !targetCart) return;

    const srcRect = sourceElement.getBoundingClientRect();
    const targetRect = targetCart.getBoundingClientRect();

    const clone = document.createElement('div');
    clone.className = 'flying-cart-clone';
    clone.style.width = `${Math.min(srcRect.width, 100)}px`;
    clone.style.height = `${Math.min(srcRect.height, 120)}px`;
    clone.style.top = `${srcRect.top}px`;
    clone.style.left = `${srcRect.left}px`;

    // Try finding img inside source element
    const img = sourceElement.querySelector('img') || (sourceElement.tagName === 'IMG' ? sourceElement : null);
    if (img) {
      clone.style.backgroundImage = `url(${img.src})`;
      clone.style.backgroundSize = 'cover';
      clone.style.backgroundPosition = 'center';
    } else {
      clone.style.backgroundColor = 'var(--color-maroon)';
    }

    document.body.appendChild(clone);

    // Trigger trajectory
    requestAnimationFrame(() => {
      clone.style.top = `${targetRect.top + targetRect.height / 2 - 12}px`;
      clone.style.left = `${targetRect.left + targetRect.width / 2 - 12}px`;
      clone.style.width = '24px';
      clone.style.height = '24px';
      clone.style.opacity = '0.2';
      clone.style.transform = 'scale(0.3) rotate(45deg)';
    });

    setTimeout(() => {
      clone.remove();
      targetCart.classList.add('animate-cart-bounce');
      setTimeout(() => targetCart.classList.remove('animate-cart-bounce'), 450);
    }, 750);
  }

  window.quickAddToCart = async function(productId, btnElement) {
    try {
      const source = btnElement ? btnElement.closest('.product-card') : null;
      if (source) flyToCartAnimation(source);

      const res = await fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      const data = await res.json();
      if (data.success) {
        setTimeout(() => openCartDrawer(), 650);
      }
    } catch (err) {
      console.error(err);
      window.location.href = `/product/${productId}`;
    }
  };

  // Intercept PDP Form submit with fly animation and smooth drawer
  const pdpForm = $('#pdp-add-cart-form');
  if (pdpForm) {
    pdpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mainImg = $('#pdp-main-image');
      if (mainImg) flyToCartAnimation(mainImg);

      const formData = new FormData(pdpForm);
      const payload = {
        productId: formData.get('productId'),
        quantity: formData.get('quantity') || 1,
        size: formData.get('size') || '',
        blouseOption: formData.get('blouseOption') || '',
        customNote: formData.get('customNote') || ''
      };

      try {
        const btn = $('#pdp-add-cart-btn');
        if (btn) btn.innerHTML = '<span>Adding to Bag...</span>';

        const res = await fetch('/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (btn) btn.innerHTML = '<span>Add to Shopping Bag</span>';

        if (data.success) {
          setTimeout(() => openCartDrawer(), 650);
        }
      } catch (err) {
        console.error(err);
        pdpForm.submit();
      }
    });
  }

  window.openCartDrawer = openCartDrawer;
  window.closeCartDrawer = closeCartDrawer;

})();
