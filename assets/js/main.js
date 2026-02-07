/* =====================================================
   SANGGAR ANANDA — Main JavaScript
   Features:
   1. Navbar scroll effect (transparent → solid/glass)
   2. Mobile hamburger menu
   3. Smooth scroll on nav link click
   4. Scroll reveal animations (Intersection Observer)
   5. Active nav link highlight on scroll
   6. Counter animation for stats
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ── DOM REFERENCES ────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.navbar__link');
  const contactForm = document.getElementById('contactForm');
  const sections = document.querySelectorAll('section[id]');
  const statNumbers = document.querySelectorAll('.stats__number');

  /* ── 1. NAVBAR SCROLL EFFECT ───────────────────── */
  const SCROLL_THRESHOLD = 80;

  function handleNavbarScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  // Run once on load
  handleNavbarScroll();

  /* ── 2. MOBILE HAMBURGER MENU ──────────────────── */
  function toggleMenu() {
    hamburgerBtn.classList.toggle('navbar__hamburger--active');
    navMenu.classList.toggle('navbar__menu--open');
    document.body.style.overflow = navMenu.classList.contains('navbar__menu--open')
      ? 'hidden'
      : '';
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('navbar__hamburger--active');
    navMenu.classList.remove('navbar__menu--open');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', toggleMenu);

  // Close menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── 3. SMOOTH SCROLL ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      closeMenu();

      const navbarHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  /* ── 4. SCROLL REVEAL (Intersection Observer) ──── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* ── 5. ACTIVE NAV LINK HIGHLIGHT ──────────────── */
  function updateActiveLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('navbar__link--active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('navbar__link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── 6. COUNTER ANIMATION (Stats) ──────────────── */
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000; // ms
      const steps = 60;
      const stepTime = duration / steps;
      let current = 0;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString('id-ID');
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString('id-ID');
        }
      }, stepTime);
    });
  }

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(statsSection);
  }

  /* ── 7. CONTACT FORM (Basic UX) ────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Mengirim...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Simulate submission (replace with real API call)
      setTimeout(() => {
        submitBtn.textContent = '✓ Pesan Terkirim!';
        submitBtn.style.background = '#27ae60';
        submitBtn.style.borderColor = '#27ae60';
        submitBtn.style.opacity = '1';

        // Reset after 3 seconds
        setTimeout(() => {
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  /* ── 8. PARALLAX SUBTLE on Hero (Desktop only) ─── */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.35}px) scale(1.1)`;
      }
    }, { passive: true });
  }
});
