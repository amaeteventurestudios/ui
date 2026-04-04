/* ============================================================
   UMANAH INSTITUTE — Main JavaScript
   Shared across all pages.
   ============================================================ */

(function () {
  'use strict';

  // ── Mobile Nav Toggle ──────────────────────────────────────
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu   = document.getElementById('mobileMenu');

  if (hamburgerBtn && mobileMenu) {
    function closeMenu() {
      mobileMenu.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
      // Lock/unlock body scroll so page doesn't slide under the fixed overlay
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  // ── Active Nav Link (scroll spy) ──────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              const href = link.getAttribute('href');
              if (href === '#' + id) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  // ── Entrance Animations (Intersection Observer) ────────────
  const animTargets = document.querySelectorAll(
    '.area-card, .mission-block, .participant-card, .forum-cta-block, ' +
    '.problem-callout, .format-participation, .about-cta-block, .sector-tag, ' +
    '.function-card, .focus-card, .engage-path, .pillar, .eval-card, ' +
    '.step-content, .gov-card, .ae-inquiry-block, .ae-contact-card, ' +
    '.stat-icon-box, .status-track'
  );

  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, 60);
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animTargets.forEach(function (el) {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
  });

  // ── Applied Engineering: Animate progress bars on enter ────
  const trackFills = document.querySelectorAll('.track-fill');
  if (trackFills.length) {
    const barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.style.width = el.getAttribute('data-width') || '50%';
            barObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    trackFills.forEach(function (fill) {
      // Store target width, set to 0 initially for animation
      fill.setAttribute('data-width', fill.style.width);
      fill.style.width = '0%';
      barObserver.observe(fill);
    });
  }

  // ── Dynamic year in footer ─────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
