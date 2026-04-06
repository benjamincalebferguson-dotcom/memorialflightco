// ── Nav scroll behavior ────────────────────────────────────
const nav = document.getElementById('nav');

if (nav && !nav.classList.contains('scrolled')) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

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

// ── Waiting list form ──────────────────────────────────────
const form = document.getElementById('waitingListForm');

if (form) {
  // Pre-select enquiry type from URL param (e.g. ?type=call or ?type=general)
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get('type');
  if (typeParam === 'call' || typeParam === 'general') {
    const select = document.getElementById('enquiryType');
    if (select) select.value = 'general';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const required = form.querySelectorAll('[required]');
    let valid = true;
    const success = document.getElementById('formSuccess');
    const error = document.getElementById('formError');

    if (success) success.style.display = 'none';
    if (error) error.style.display = 'none';

    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#c0392b';
        valid = false;
      }
    });

    if (!valid) return;

    // Update button state to provide feedback
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.style.cursor = 'not-allowed';
    }

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    })
      .then(async response => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload.success === false) {
          throw new Error(payload.message || payload?.body?.message || 'Submission failed');
        }

        form.reset();
        form.style.display = 'none';

        if (success) {
          success.textContent = 'Thank you — your enquiry has been sent and we will be in touch shortly.';
          success.style.display = 'block';
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      })
      .catch(() => {
        if (error) {
          error.style.display = 'block';
          error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      })
      .finally(() => {
        if (!form.style.display || form.style.display !== 'none') {
          if (submitBtn) {
            submitBtn.textContent = 'Submit enquiry';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
          }
        }
      });
  });
}
