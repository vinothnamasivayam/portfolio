/**
 * ==========================================================================
 * MODERN PERSONAL PORTFOLIO INTERACTIVITY (script.js)
 * Clean ES6 Vanilla JavaScript - Zero External Dependencies
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. THEME MODULE (Dark / Light Mode Toggle with localStorage)
     ========================================================================== */
  const ThemeModule = (() => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check saved local theme preference or default to system preferred theme
    const getPreferredTheme = () => {
      const savedTheme = localStorage.getItem('portfolio_theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const setTheme = (theme) => {
      htmlElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio_theme', theme);
    };

    const init = () => {
      setTheme(getPreferredTheme());

      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
          const currentTheme = htmlElement.getAttribute('data-theme');
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          setTheme(newTheme);
        });
      }
    };

    return { init };
  })();

  /* ==========================================================================
     2. NAVIGATION & SCROLLSPY MODULE
     ========================================================================== */
  const NavigationModule = (() => {
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');

    // Handle Header Blur & Scroll Progress Bar
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Update Scroll Progress Width (%)
      if (scrollProgress && totalHeight > 0) {
        const progressPercentage = (currentScrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progressPercentage}%`;
      }

      // Add Glass Navbar Background Shadow on Scroll
      if (header) {
        if (currentScrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Show / Hide Back to Top Floating Button
      if (backToTopBtn) {
        if (currentScrollY > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    };

    // Mobile Hamburger Menu Toggle
    const toggleMobileMenu = () => {
      if (!navMenu || !mobileToggle) return;
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    };

    const closeMobileMenu = () => {
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileToggle) {
          mobileToggle.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      }
    };

    // Scrollspy Highlight Active Navigation Link
    const initScrollspy = () => {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              }
            });
          }
        });
      }, observerOptions);

      sections.forEach(section => observer.observe(section));
    };

    const init = () => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
      }

      // Close menu when clicking nav links
      navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });

      // Back to top scroll listener
      if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      initScrollspy();
    };

    return { init };
  })();

  /* ==========================================================================
     3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ========================================================================== */
  const ScrollRevealModule = (() => {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const init = () => {
      if (revealElements.length === 0) return;

      const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      };

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Unobserve once animated
          }
        });
      }, observerOptions);

      revealElements.forEach(el => revealObserver.observe(el));
    };

    return { init };
  })();

  /* ==========================================================================
     4. ANIMATED STATS COUNTER MODULE
     ========================================================================== */
  const StatsCounterModule = (() => {
    const statCards = document.querySelectorAll('.stat-card');

    const animateCounter = (el) => {
      const targetAttr = el.getAttribute('data-target');
      // Extract numeric value from target string
      const target = parseInt(targetAttr.replace(/\D/g, ''), 10);
      if (isNaN(target)) return;

      const duration = 2000; // milliseconds
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.ceil(current);
        }
      }, stepTime);
    };

    const init = () => {
      if (statCards.length === 0) return;

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const numEl = entry.target.querySelector('.stat-number');
            if (numEl) animateCounter(numEl);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      statCards.forEach(card => observer.observe(card));
    };

    return { init };
  })();

  /* ==========================================================================
     5. SKILLS GRID CATEGORY FILTER MODULE
     ========================================================================== */
  const SkillsFilterModule = (() => {
    const tabBtns = document.querySelectorAll('.skills-category-tabs .tab-btn');
    const skillCards = document.querySelectorAll('.skills-grid .skill-card');

    const filterSkills = (category) => {
      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    };

    const init = () => {
      if (tabBtns.length === 0) return;

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const category = btn.getAttribute('data-category');
          filterSkills(category);
        });
      });
    };

    return { init };
  })();

  /* ==========================================================================
     6. PROJECT DETAIL MODAL MODULE
     ========================================================================== */
  const ProjectModalModule = (() => {
    const previewBtns = document.querySelectorAll('.btn-preview');
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    const closeBtns = document.querySelectorAll('.modal-close');

    const openModal = (modalId) => {
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        targetModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
      }
    };

    const closeModal = (modal) => {
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    };

    const init = () => {
      previewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const modalId = btn.getAttribute('data-modal');
          openModal(modalId);
        });
      });

      closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const modal = btn.closest('.modal-backdrop');
          closeModal(modal);
        });
      });

      // Close modal on backdrop overlay click
      modalBackdrops.forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal(modal);
        });
      });

      // ESC key listener
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          modalBackdrops.forEach(modal => closeModal(modal));
        }
      });
    };

    return { init };
  })();

  /* ==========================================================================
     7. CONTACT FORM VALIDATION & ENDPOINT SUBMISSION MODULE
     ========================================================================== */
  const ContactFormModule = (() => {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const formStatus = document.getElementById('form-status');

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validateField = (input, errorId, condition) => {
      const group = input.closest('.form-group');
      if (!condition) {
        group.classList.add('has-error');
        return false;
      } else {
        group.classList.remove('has-error');
        return true;
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const isNameValid = validateField(nameInput, 'name-error', nameInput.value.trim().length > 0);
      const isEmailValid = validateField(emailInput, 'email-error', isValidEmail(emailInput.value.trim()));
      const isMessageValid = validateField(messageInput, 'message-error', messageInput.value.trim().length > 0);

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        return;
      }

      // UI Loading state
      if (submitBtn && btnText && btnIcon) {
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        btnIcon.className = 'fa-solid fa-circle-notch fa-spin';
      }

      /**
       * ===================================================================
       * FREE FORM ENDPOINT INTEGRATION INSTRUCTIONS:
       * ===================================================================
       * OPTION A: FORMSPREE
       * Update form HTML <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
       *
       * OPTION B: EMAILJS (JS SDK)
       * Include EmailJS CDN script in index.html <head>:
       * <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
       * emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form, 'YOUR_PUBLIC_KEY')
       */

      // Simulated Async API Request for demonstration
      try {
        await new Promise(resolve => setTimeout(resolve, 1200));

        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Thank you! Your message has been sent successfully. I will get back to you soon.';
        }

        form.reset();
      } catch (err) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Oops! An error occurred while sending your message. Please try again later.';
        }
      } finally {
        if (submitBtn && btnText && btnIcon) {
          submitBtn.disabled = false;
          btnText.textContent = 'Send Message';
          btnIcon.className = 'fa-solid fa-paper-plane';
        }
      }
    };

    const init = () => {
      if (!form) return;

      form.addEventListener('submit', handleSubmit);

      // Clear errors on input focus
      form.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', () => {
          const group = input.closest('.form-group');
          if (group) group.classList.remove('has-error');
        });
      });
    };

    return { init };
  })();

  /* ==========================================================================
     8. FOOTER DYNAMIC YEAR INITIALIZATION
     ========================================================================== */
  const initFooterYear = () => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  };

  /* ==========================================================================
     INITIALIZE ALL MODULES
     ========================================================================== */
  ThemeModule.init();
  NavigationModule.init();
  ScrollRevealModule.init();
  StatsCounterModule.init();
  SkillsFilterModule.init();
  ProjectModalModule.init();
  ContactFormModule.init();
  initFooterYear();

});
