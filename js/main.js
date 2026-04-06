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
  const select = document.getElementById('enquiryType');
  if (select) {
    if (typeParam === 'call') select.value = 'private-call';
    if (typeParam === 'general') select.value = 'general';
    if (typeParam === 'director') select.value = 'funeral-director';
  }

  form.addEventListener('submit', e => {
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

    // Update button state to provide feedback
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.style.cursor = 'not-allowed';
    }

    // Simulate an async submission delay (e.g. fetch to Netlify Forms or Formspree)
    setTimeout(() => {
      form.style.display = 'none'; // Hide the form fields
      const success = document.getElementById('formSuccess');
      if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 1200);
  });
}
