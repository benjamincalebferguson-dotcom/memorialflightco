const LOVED_ONE_STORAGE_KEY = 'mf_loved_one_name'

const getStoredLovedOneName = () => {
  try {
    const saved = localStorage.getItem(LOVED_ONE_STORAGE_KEY)
    return saved ? saved.trim() : ''
  } catch (error) {
    return ''
  }
}

const setStoredLovedOneName = name => {
  try {
    if (name) {
      localStorage.setItem(LOVED_ONE_STORAGE_KEY, name)
    } else {
      localStorage.removeItem(LOVED_ONE_STORAGE_KEY)
    }
  } catch (error) {
    // Ignore storage access issues and keep the UI responsive
  }
}

const logoState = {
  name: getStoredLovedOneName()
}

const escapeHtml = value =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const getNameFontSize = (name, variant) => {
  const length = name.length

  if (variant === 'hero') {
    if (length >= 14) return 26
    if (length >= 10) return 34
    return 44
  }

  if (length >= 14) return 18
  if (length >= 10) return 22
  return 28
}

const getLogoConfig = variant => {
  if (variant === 'hero') {
    return {
      width: 560,
      height: 156,
      outerInset: 2,
      outerRadius: 16,
      innerInset: 10,
      innerRadius: 12,
      cornerLength: 16,
      topY: 58,
      ruleY: 74,
      brandTopSize: 12,
      brandTopSpacing: 9,
      brandBottomSize: 34,
      brandBottomSpacing: 6,
      personalTopSize: 16,
      personalBottomY: 115
    }
  }

  return {
    width: 320,
    height: 64,
    outerInset: 1.5,
    outerRadius: 10,
    innerInset: 8,
    innerRadius: 6,
    cornerLength: 14,
    topY: 24,
    ruleY: 30,
    brandTopSize: 9,
    brandTopSpacing: 7,
    brandBottomSize: 22,
    brandBottomSpacing: 4,
    personalTopSize: 10,
    personalBottomY: 46
  }
}

const createLogoMarkup = (variant, name = '', animate = false) => {
  const config = getLogoConfig(variant)
  const hasName = Boolean(name)
  const displayName = escapeHtml(name || 'Arthur')
  const nameFontSize = getNameFontSize(name || 'Arthur', variant)
  const centerX = config.width / 2
  const state = hasName ? 'personalised' : 'brand'
  const ariaLabel = hasName
    ? `Memorial Flight - in memory of ${name}`
    : 'Memorial Flight logo'

  return `
    <div class="mf-logo" data-state="${state}" ${animate ? 'data-animate="true"' : ''}>
      <svg
        viewBox="0 0 ${config.width} ${config.height}"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="${escapeHtml(ariaLabel)}"
      >
        <rect
          x="${config.outerInset}"
          y="${config.outerInset}"
          width="${config.width - (config.outerInset * 2)}"
          height="${config.height - (config.outerInset * 2)}"
          rx="${config.outerRadius}"
          fill="none"
          stroke="#1d6a5a"
          stroke-width="1.5"
        />
        <rect
          x="${config.innerInset}"
          y="${config.innerInset}"
          width="${config.width - (config.innerInset * 2)}"
          height="${config.height - (config.innerInset * 2)}"
          rx="${config.innerRadius}"
          fill="none"
          stroke="#2d9a80"
          stroke-width="0.5"
          opacity="0.3"
        />
        <line x1="${config.outerInset}" y1="${config.outerInset}" x2="${config.outerInset + config.cornerLength}" y2="${config.outerInset + config.cornerLength}" stroke="#2d9a80" stroke-width="0.8" opacity="0.35" />
        <line x1="${config.width - config.outerInset}" y1="${config.outerInset}" x2="${config.width - config.outerInset - config.cornerLength}" y2="${config.outerInset + config.cornerLength}" stroke="#2d9a80" stroke-width="0.8" opacity="0.35" />
        <line x1="${config.outerInset}" y1="${config.height - config.outerInset}" x2="${config.outerInset + config.cornerLength}" y2="${config.height - config.outerInset - config.cornerLength}" stroke="#2d9a80" stroke-width="0.8" opacity="0.35" />
        <line x1="${config.width - config.outerInset}" y1="${config.height - config.outerInset}" x2="${config.width - config.outerInset - config.cornerLength}" y2="${config.height - config.outerInset - config.cornerLength}" stroke="#2d9a80" stroke-width="0.8" opacity="0.35" />

        <g class="mf-logo__text-group mf-logo__brand">
          <text x="${centerX}" y="${config.topY}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${config.brandTopSize}" letter-spacing="${config.brandTopSpacing}" fill="#2d9a80">MEMORIAL</text>
          <rect x="${variant === 'hero' ? 70 : 40}" y="${config.ruleY}" width="${variant === 'hero' ? 420 : 240}" height="0.8" rx="0.4" fill="#1d6a5a" />
          <text x="${centerX}" y="${variant === 'hero' ? 118 : 48}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${config.brandBottomSize}" letter-spacing="${config.brandBottomSpacing}" fill="#e8f4f0">FLIGHT</text>
        </g>

        <g class="mf-logo__text-group mf-logo__name">
          <text x="${centerX}" y="${variant === 'hero' ? 56 : 23}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${config.personalTopSize}" fill="#2d9a80" font-style="italic">in memory of</text>
          <text x="${centerX}" y="${config.personalBottomY}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${nameFontSize}" fill="#e8f4f0" font-style="italic">${displayName}</text>
        </g>
      </svg>
    </div>
  `
}

const logoHosts = [
  ...document.querySelectorAll('.nav__logo'),
  ...document.querySelectorAll('.footer__logo'),
  ...document.querySelectorAll('[data-mfc-logo]')
]

const renderLogos = ({ animate = false } = {}) => {
  logoHosts.forEach(host => {
    const variant = host.dataset.logoVariant || (host.classList.contains('footer__logo') ? 'footer' : 'nav')
    const normalizedVariant = variant === 'hero' ? 'hero' : 'nav'
    const existingLogo = host.querySelector('.mf-logo')

    if (!existingLogo) {
      // First render — inject full markup
      host.classList.add('mf-logo-host')
      host.innerHTML = createLogoMarkup(normalizedVariant, logoState.name, false)
      return
    }

    // Subsequent renders — update in place so CSS transitions fire
    const hasName = Boolean(logoState.name)
    const nameFontSize = getNameFontSize(logoState.name || 'Arthur', normalizedVariant)

    if (animate) existingLogo.dataset.animate = 'true'
    existingLogo.dataset.state = hasName ? 'personalised' : 'brand'

    const nameText = existingLogo.querySelector('.mf-logo__name text:last-child')
    if (nameText) {
      nameText.textContent = hasName ? logoState.name : 'Arthur'
      nameText.setAttribute('font-size', String(nameFontSize))
    }

    const svg = existingLogo.querySelector('svg')
    if (svg) {
      svg.setAttribute('aria-label', hasName
        ? `Memorial Flight - in memory of ${logoState.name}`
        : 'Memorial Flight logo')
    }
  })
}

const lovedOneInput = document.querySelector('[data-memorial-name-form] input[name="lovedOneName"]')
const clearLovedOneButton = document.querySelector('[data-clear-loved-one-name]')

const syncLovedOneForm = () => {
  if (lovedOneInput) {
    lovedOneInput.value = logoState.name
  }

  if (clearLovedOneButton) {
    clearLovedOneButton.classList.toggle('is-visible', Boolean(logoState.name))
  }
}

const updateLovedOneName = (nextName, { animate = true } = {}) => {
  logoState.name = nextName.trim()
  setStoredLovedOneName(logoState.name)
  renderLogos({ animate })
  syncLovedOneForm()
}

renderLogos()
syncLovedOneForm()

if (lovedOneInput) {
  lovedOneInput.addEventListener('input', event => {
    updateLovedOneName(event.target.value, { animate: true })
  })
}

if (clearLovedOneButton) {
  clearLovedOneButton.addEventListener('click', () => {
    updateLovedOneName('', { animate: true })
    if (lovedOneInput) {
      lovedOneInput.focus()
    }
  })
}

// ── Nav scroll behavior ────────────────────────────────────
const nav = document.getElementById('nav')

if (nav) {
  // Inner pages hardcode class="scrolled" — keep it locked regardless of scroll
  const isInnerPage = nav.classList.contains('scrolled')

  if (!isInnerPage) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40)
    }, { passive: true })
  }
}

// ── Mobile nav ─────────────────────────────────────────────
const NAV_LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'memorial-ceremonies.html', label: 'Memorial Ceremonies' },
  { href: 'how-it-works.html', label: 'How It Works' },
  { href: 'pricing.html', label: 'Pricing' },
  { href: 'funeral-directors.html', label: 'Funeral Directors' },
  { href: 'faq.html', label: 'FAQ' },
  { href: 'contact.html', label: 'Contact' },
]

const injectMobileNav = () => {
  if (!nav) return

  // Hamburger toggle button
  const toggle = document.createElement('button')
  toggle.className = 'nav__mobile-toggle'
  toggle.setAttribute('aria-label', 'Open menu')
  toggle.setAttribute('aria-expanded', 'false')
  toggle.innerHTML = '<span></span><span></span><span></span>'
  nav.appendChild(toggle)

  // Full-screen panel
  const panel = document.createElement('div')
  panel.className = 'nav__mobile-panel'
  panel.setAttribute('aria-hidden', 'true')
  panel.setAttribute('role', 'dialog')
  panel.setAttribute('aria-label', 'Navigation menu')
  panel.innerHTML = `
    <button class="nav__mobile-close" aria-label="Close menu">&times;</button>
    <ul class="nav__mobile-links">
      ${NAV_LINKS.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
    </ul>
    <div class="nav__mobile-actions">
      <a href="tel:+61478003959" class="nav__contact">+61 478 003 959</a>
      <a href="funeral-directors.html" class="btn btn--nav-secondary">For Funeral Directors</a>
      <a href="contact.html?type=call" class="btn btn--nav-primary">Request a Call</a>
    </div>
  `
  document.body.appendChild(panel)

  const closeBtn = panel.querySelector('.nav__mobile-close')

  const openMenu = () => {
    toggle.setAttribute('aria-expanded', 'true')
    toggle.classList.add('is-open')
    panel.classList.add('is-open')
    panel.setAttribute('aria-hidden', 'false')
    document.body.classList.add('nav-open')
    closeBtn.focus()
  }

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false')
    toggle.classList.remove('is-open')
    panel.classList.remove('is-open')
    panel.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('nav-open')
    toggle.focus()
  }

  toggle.addEventListener('click', openMenu)
  closeBtn.addEventListener('click', closeMenu)

  // Close on outside click (desktop safety) or Escape key
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu() })
  panel.addEventListener('click', e => { if (e.target === panel) closeMenu() })
}

injectMobileNav()

// ── Section reveal animation ──────────────────────────────
const revealItems = document.querySelectorAll('[data-reveal]');

if (revealItems.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -40px 0px'
  });

  revealItems.forEach(item => revealObserver.observe(item));
}

// ── FAQ accordion ──────────────────────────────────────────
document.querySelectorAll('.faq-item h3').forEach(header => {
  const toggleFAQ = () => {
    const item = header.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    const toggleBtn = header.querySelector('.faq-toggle');

    // Close all open items and reset aria-expanded
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      const btn = i.querySelector('.faq-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });

    // Open the clicked item if it was closed
    if (!isOpen) {
      item.classList.add('open');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    }
  };

  header.addEventListener('click', toggleFAQ);

  // Keyboard support for accessibility
  const toggleBtn = header.querySelector('.faq-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ();
      }
    });
  }
});

// ── Stripe checkout ────────────────────────────────────────
document.querySelectorAll('[data-checkout-form]').forEach(formEl => {
  formEl.addEventListener('submit', async event => {
    event.preventDefault();

    const button = formEl.querySelector('button[type="submit"]');
    const formData = new FormData(formEl);
    const packageType = formData.get('packageType');
    const addTributeFilm = formData.get('addTributeFilm') === 'yes';

    if (button) {
      button.disabled = true;
      button.textContent = 'Redirecting...';
      button.style.opacity = '0.7';
      button.style.cursor = 'not-allowed';
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          packageType,
          addTributeFilm
        })
      });

      const payload = await response.json();

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || 'Unable to start checkout');
      }

      window.location.href = payload.url;
    } catch (error) {
      window.location.href = `contact.html?type=purchase&package=${encodeURIComponent(packageType)}`;
    }
  });
});

// ── Waiting list form ──────────────────────────────────────
const form = document.getElementById('waitingListForm');

if (form) {
  // Pre-select enquiry type from URL param (e.g. ?type=call or ?type=general)
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get('type');
  const select = document.getElementById('enquiryType');
  const serviceSelect = document.getElementById('serviceOption');
  const packageParam = params.get('package');
  if (select) {
    if (typeParam === 'call') select.value = 'private-call';
    if (typeParam === 'general') select.value = 'general';
    if (typeParam === 'director') select.value = 'funeral-director';
    if (typeParam === 'purchase') select.value = 'memorial-ceremony';
  }

  if (serviceSelect) {
    if (packageParam === 'signature') serviceSelect.value = 'signature-scattering';
    if (packageParam === 'sorrento') serviceSelect.value = 'sorrento-sanctuary';
    if (packageParam === 'tribute') serviceSelect.value = 'tribute-film';
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      // Clear previous error states
      field.classList.remove('is-invalid');
      const errorMessageElement = field.nextElementSibling; // Assuming error message is a sibling span/div
      if (errorMessageElement && errorMessageElement.classList.contains('error-message')) {
        errorMessageElement.textContent = '';
      }

      if (!field.value.trim()) {
        field.classList.add('is-invalid'); // Add class for CSS styling
        valid = false;
        if (errorMessageElement && errorMessageElement.classList.contains('error-message')) {
          errorMessageElement.textContent = 'This field is required.';
        }
      }
    });

    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const success = document.getElementById('formSuccess');
    const error = document.getElementById('formError');

    if (success) success.style.display = 'none';
    if (error) error.style.display = 'none';

    if (submitBtn) {
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.style.cursor = 'not-allowed';
    }

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      form.reset();
      if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (submitBtn) {
        submitBtn.textContent = 'Submit enquiry';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
      }
    } catch (err) {
      if (error) {
        error.style.display = 'block';
      }

      if (submitBtn) {
        submitBtn.textContent = 'Submit enquiry';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
      }
    }
  });
}
