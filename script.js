/* ============================================
   MERIDIAN & CO. — Premium Real Estate
   script.js — Vanilla JS, no libraries
   Multi-page version
   ============================================ */

(function () {
  'use strict';

  const isHome = document.body.dataset.page === 'home';

  // --- Loading Screen (Home only) ---
  const loader = document.getElementById('loader');
  if (isHome && loader) {
    document.body.style.overflow = 'hidden';
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initHeroAnimations();
      }, 1600);
    });
  } else if (loader) {
    loader.classList.add('hidden');
  }

  // --- Custom Cursor ---
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  if (window.matchMedia('(pointer: fine)').matches && cursor && follower) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = 'a, button, .property-card, .service-card, .area-card, .team-card, .why-us__card, .testimonial, .news-card, input, select, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) follower.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) follower.classList.remove('hover');
    });
  }

  // --- Sticky Navigation ---
  const nav = document.getElementById('nav');

  function handleNav() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNav, { passive: true });
  handleNav();

  // --- Mobile Menu ---
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const active = navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      mobileMenu.setAttribute('aria-hidden', !active);
      navToggle.setAttribute('aria-expanded', active);
      document.body.style.overflow = active ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Hero Animations (Home only) ---
  function initHeroAnimations() {
    document.querySelectorAll('.reveal-line').forEach((line, i) => {
      setTimeout(() => line.classList.add('visible'), 200 + i * 200);
    });
    document.querySelectorAll('.reveal-text').forEach((el) => {
      setTimeout(() => el.classList.add('visible'), 400);
    });
  }

  // If not home, trigger hero animations immediately (in case any exist)
  if (!isHome) {
    document.querySelectorAll('.reveal-line').forEach(l => l.classList.add('visible'));
    document.querySelectorAll('.reveal-text').forEach(l => l.classList.add('visible'));
  }

  // --- Intersection Observer: Scroll Reveals ---
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0, 10);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay * 120);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // --- Counter Animation ---
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.stats');
  if (statsSection) counterObserver.observe(statsSection);

  function animateCounters(container) {
    container.querySelectorAll('.stat__number').forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // --- Smooth Scroll for same-page anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Form handling ---
  const contactForm = document.querySelector('.contact__form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sent! We\'ll be in touch.';
      btn.disabled = true;
      btn.style.background = '#2ecc71';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // Newsletter forms
  document.querySelectorAll('.footer__newsletter').forEach((newsletter) => {
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletter.querySelector('input');
      input.value = 'Subscribed! ✓';
      input.disabled = true;
      setTimeout(() => {
        input.value = '';
        input.disabled = false;
      }, 2500);
    });
  });

  // --- Parallax hero on scroll (Home only) ---
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + y * 0.3 + 'px) scale(' + (1 + y * 0.0002) + ')';
      }
    }, { passive: true });
  }

  
  // --- Carousel logic ---
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('.carousel__track');
    const slides = Array.from(track.children);
    const prevBtn = document.querySelector('[data-carousel-prev]');
    const nextBtn = document.querySelector('[data-carousel-next]');
    let index = 0;

    function updateCarousel() {
      const slideWidth = slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 24);
      track.style.transform = `translateX(${-index * slideWidth}px)`;
    }

    function next() {
      index = (index + 1) % slides.length;
      updateCarousel();
    }
    function prev() {
      index = (index - 1 + slides.length) % slides.length;
      updateCarousel();
    }

    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);
    window.addEventListener('resize', updateCarousel);
  }

  // --- Property card 3D tilt ---
  document.querySelectorAll('.property-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
