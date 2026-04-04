/* ============================================================
   UMANAH INSTITUTE — Form Handling
   Formspree endpoint: https://formspree.io/f/xjgezlop
   ============================================================ */

(function () {
  'use strict';

  var FORMSPREE = 'https://formspree.io/f/xjgezlop';

  // ============================================================
  // UTILITY: Validate a single field
  // ============================================================
  function validateField(field) {
    const errorEl = document.getElementById(field.id + 'Error');
    let message   = '';

    if (!errorEl) return true;

    if (field.required && !field.value.trim()) {
      message = 'This field is required.';
    } else if (field.type === 'email' && field.value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(field.value.trim())) {
        message = 'Please enter a valid email address.';
      }
    } else if (field.tagName === 'SELECT' && field.required && !field.value) {
      message = 'Please select an option.';
    } else if (field.tagName === 'TEXTAREA' && field.required && field.value.trim().length < 10) {
      message = 'Please provide a more detailed response (at least 10 characters).';
    }

    if (message) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      field.style.borderColor = 'var(--error)';
      return false;
    } else {
      errorEl.style.display = 'none';
      field.style.borderColor = '';
      return true;
    }
  }

  // ============================================================
  // UTILITY: Set submit button loading state
  // ============================================================
  function setLoading(btn, loading) {
    const textEl    = document.getElementById('submitText');
    const spinnerEl = document.getElementById('submitSpinner');
    if (!textEl || !spinnerEl) return;

    btn.disabled = loading;
    textEl.style.opacity    = loading ? '0.6' : '1';
    spinnerEl.style.display = loading ? 'inline-flex' : 'none';
  }

  // ============================================================
  // UTILITY: Send data to Formspree + internal table API
  // ============================================================
  async function submitToFormspree(data) {
    const res = await fetch(FORMSPREE, {
      method:  'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Formspree submission failed');
    }
  }

  async function persistRecord(tableName, data) {
    try {
      const res = await fetch('tables/' + tableName, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      if (!res.ok) console.warn('Table API non-OK:', res.status);
    } catch (err) {
      console.warn('Could not persist record:', err);
    }
  }

  // ============================================================
  // SHOW SUCCESS STATE
  // ============================================================
  function showSuccess(formEl, successEl) {
    formEl.style.display    = 'none';
    successEl.style.display = 'flex';
    successEl.classList.add('visible');
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ============================================================
  // REQUEST PARTICIPATION FORM
  // ============================================================
  const participationForm = document.getElementById('participationForm');

  if (participationForm) {
    const fields = ['fullName', 'organization', 'email', 'role', 'sector', 'responsibility', 'motivation'];

    fields.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('blur',  function () { validateField(el); });
        el.addEventListener('input', function () {
          const errEl = document.getElementById(id + 'Error');
          if (errEl && errEl.style.display === 'block') validateField(el);
        });
      }
    });

    participationForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      let isValid = true;
      fields.forEach(function (id) {
        const el = document.getElementById(id);
        if (el && !validateField(el)) isValid = false;
      });
      if (!isValid) return;

      const submitBtn = document.getElementById('submitBtn');
      setLoading(submitBtn, true);

      const data = {
        _subject:          'New Participation Request — Umanah Institute',
        form_type:         'Participation Request',
        full_name:         document.getElementById('fullName').value.trim(),
        organization:      document.getElementById('organization').value.trim(),
        email:             document.getElementById('email').value.trim(),
        role:              document.getElementById('role').value.trim(),
        phone:             document.getElementById('phone')             ? document.getElementById('phone').value.trim()            : '',
        website_linkedin:  document.getElementById('websiteLinkedin')  ? document.getElementById('websiteLinkedin').value.trim()   : '',
        preferred_contact: document.getElementById('preferredContact') ? document.getElementById('preferredContact').value         : '',
        sector:            document.getElementById('sector').value,
        responsibility:    document.getElementById('responsibility').value,
        motivation:        document.getElementById('motivation').value.trim(),
      };

      try {
        await submitToFormspree(data);
        await persistRecord('participation_requests', data);
      } catch (err) {
        console.warn('Submission error:', err);
      }

      setLoading(submitBtn, false);
      // Redirect to dedicated thank-you page
      window.location.href = 'thank-you.html?type=participation';
    });
  }

  // ============================================================
  // INSTITUTIONAL INQUIRY FORM
  // ============================================================
  const inquiryForm = document.getElementById('inquiryForm');

  if (inquiryForm) {
    const fields = ['fullName', 'organization', 'email', 'inquiryType', 'message'];

    fields.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('blur',  function () { validateField(el); });
        el.addEventListener('input', function () {
          const errEl = document.getElementById(id + 'Error');
          if (errEl && errEl.style.display === 'block') validateField(el);
        });
      }
    });

    inquiryForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      let isValid = true;
      fields.forEach(function (id) {
        const el = document.getElementById(id);
        if (el && !validateField(el)) isValid = false;
      });
      if (!isValid) return;

      const submitBtn = document.getElementById('submitBtn');
      setLoading(submitBtn, true);

      const data = {
        _subject:          'New Institutional Inquiry — Umanah Institute',
        form_type:         'Institutional Inquiry',
        full_name:         document.getElementById('fullName').value.trim(),
        organization:      document.getElementById('organization').value.trim(),
        email:             document.getElementById('email').value.trim(),
        phone:             document.getElementById('phone')            ? document.getElementById('phone').value.trim()            : '',
        website_linkedin:  document.getElementById('websiteLinkedin') ? document.getElementById('websiteLinkedin').value.trim()  : '',
        role_title:        document.getElementById('roleTitle')        ? document.getElementById('roleTitle').value.trim()        : '',
        sector:            document.getElementById('sector')           ? document.getElementById('sector').value                  : '',
        preferred_contact: document.getElementById('preferredContact') ? document.getElementById('preferredContact').value        : '',
        inquiry_type:      document.getElementById('inquiryType').value,
        message:           document.getElementById('message').value.trim(),
      };

      try {
        await submitToFormspree(data);
        await persistRecord('institutional_inquiries', data);
      } catch (err) {
        console.warn('Submission error:', err);
      }

      setLoading(submitBtn, false);
      // Redirect to dedicated thank-you page
      window.location.href = 'thank-you.html?type=inquiry';
    });
  }

})();
