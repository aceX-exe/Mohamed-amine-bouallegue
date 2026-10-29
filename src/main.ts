/**
 * Mohamed Amine Bouallegue - Personal Portfolio
 * Pure TypeScript (No Frameworks, No External Libraries)
 * Interactive Controller for Editorial Dark Luxury Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }

  // 2. Navbar Scroll Blur & Styling
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking any link
    const links = navLinks.querySelectorAll<HTMLAnchorElement>('.nav-item-link, .nav-link, .nav-contact-btn');
    links.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as Node;
      if (!navLinks.contains(target) && !menuToggle.contains(target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // 4. Active Section Highlighting in Navbar
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const navItems = document.querySelectorAll<HTMLAnchorElement>('.nav-item-link, .nav-link');

  const updateActiveSection = () => {
    const scrollPos = window.scrollY + 160;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  // 5. Interactive Prismatic Glass Lens
  initPrismaticGlassLens();

  // 6. Projects Filter Tabs
  const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filter-pill, .filter-btn');
  const projectCards = document.querySelectorAll<HTMLElement>('.project-card, .project-dribbble-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      if (!filter) return;

      // Update active button state
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter project cards with smooth fade
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // 7. Copy Email to Clipboard with Feedback Alert
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const copyFeedback = document.getElementById('copyFeedback');
  const emailToCopy = 'Boualleguemohamedamin@gmail.com';

  if (copyEmailBtn && copyBtnText && copyFeedback) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = emailToCopy;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        copyBtnText.textContent = 'Copied!';
        copyFeedback.classList.add('active');

        setTimeout(() => {
          copyBtnText.textContent = 'Copy Address';
          copyFeedback.classList.remove('active');
        }, 2500);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }

  // 8. Scroll Reveal: Fade-In Animation for Sections
  initSectionScrollFadeAnimation();
});

/**
 * Initializes the interactive glass magnifying lens from the reference image.
 * Responds smoothly to cursor movement and dragging across the hero headline.
 */
function initPrismaticGlassLens(): void {
  const lens = document.getElementById('glassLens');
  const container = document.querySelector<HTMLElement>('.editorial-title-container');

  if (!lens || !container) return;

  let isHovered = false;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrameId: number;

  const updatePosition = () => {
    // Smooth lerp (linear interpolation)
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    if (isHovered) {
      lens.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }

    animationFrameId = requestAnimationFrame(updatePosition);
  };

  container.addEventListener('mouseenter', () => {
    isHovered = true;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(updatePosition);
  });

  container.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    const lensRect = lens.getBoundingClientRect();

    // Calculate offset relative to lens center
    const relX = e.clientX - rect.left - (lensRect.width / 2);
    const relY = e.clientY - rect.top - (lensRect.height / 2);

    targetX = relX - lens.offsetLeft;
    targetY = relY - lens.offsetTop;
  });

  container.addEventListener('mouseleave', () => {
    isHovered = false;
    targetX = 0;
    targetY = 0;
    lens.style.transform = 'translate(0px, 0px)';
  });

  // Touch support for mobile devices
  container.addEventListener('touchmove', (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const lensRect = lens.getBoundingClientRect();

      const relX = touch.clientX - rect.left - (lensRect.width / 2);
      const relY = touch.clientY - rect.top - (lensRect.height / 2);

      lens.style.transform = `translate(${relX - lens.offsetLeft}px, ${relY - lens.offsetTop}px)`;
    }
  }, { passive: true });
}

/**
 * Observes section elements as they scroll into view and adds an 'active'
 * class to trigger a subtle fade-in animation.
 */
function initSectionScrollFadeAnimation(): void {
  const sections = document.querySelectorAll<HTMLElement>('section');
  if (!sections.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.12,
      }
    );

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        section.classList.add('active');
      } else {
        observer.observe(section);
      }
    });
  } else {
    sections.forEach((section) => section.classList.add('active'));
  }
}
