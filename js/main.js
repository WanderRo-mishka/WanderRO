/* ============================================================
   WanderRo — main.js
   Animatii complete, interactiuni, efecte avansate
   ============================================================ */

'use strict';

/* ============================================================
   1. PAGE LOADER
   ============================================================ */
function initPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 800);
  });

  // Fallback: ascunde loader-ul dupa 2.5s indiferent
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 2500);
}

/* ============================================================
   2. NAVIGATION
   ============================================================ */
function initNavigation() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const navLinks    = document.querySelectorAll('.nav-menu-mobile a');
  const siteNav     = document.querySelector('nav.site-nav');

  // Toggle meniu mobil
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });
  }

  // Inchide la click pe link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // Inchide la click in afara
  document.addEventListener('click', (e) => {
    if (siteNav && !siteNav.contains(e.target)) {
      mobileMenu && mobileMenu.classList.remove('open');
      hamburger  && hamburger.classList.remove('active');
    }
  });

  // Schimba stilul nav la scroll
  const updateNav = () => {
    if (!siteNav) return;
    if (window.scrollY > 60) {
      siteNav.style.boxShadow = '0 4px 24px rgba(28,23,16,0.12)';
    } else {
      siteNav.style.boxShadow = 'none';
    }
  };

  window.addEventListener('scroll', updateNav, { passive: true });

  // Active link highlight la scroll
  const sections  = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-links-desktop a');

  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navItems.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--terra)'
        : '';
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });
}

/* ============================================================
   3. SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  const options = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger delay bazat pe pozitia in parinte
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children)
          : [entry.target];
        const i = siblings.indexOf(entry.target);
        const delay = Math.min(i * 90, 400);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale')
    .forEach(el => observer.observe(el));
}

/* ============================================================
   4. PARALLAX HERO
   ============================================================ */
function initHeroParallax() {
  const hero    = document.querySelector('.hero');
  const pattern = document.querySelector('.hero-pattern');

  if (!hero || !pattern) return;

  // Dezactivat pe mobile pentru performanta
  if (window.innerWidth < 1024) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      const heroH    = hero.offsetHeight;
      if (scrolled <= heroH) {
        const pct = scrolled / heroH;
        pattern.style.transform = `translateY(${scrolled * 0.25}px)`;

        // Fade hero content la scroll
        const content = hero.querySelector('.hero-content');
        if (content) {
          content.style.opacity  = Math.max(0, 1 - pct * 1.5);
          content.style.transform = `translateY(${scrolled * 0.12}px)`;
        }
      }
      ticking = false;
    });
  }, { passive: true });
}

/* ============================================================
   5. CURSOR GLOW (desktop)
   ============================================================ */
function initCursorGlow() {
  if (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'cursorGlow';
  Object.assign(glow.style, {
    position: 'fixed',
    width: '280px', height: '280px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(192,96,58,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: '1',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s',
    top: '-999px', left: '-999px'
  });
  document.body.appendChild(glow);

  let cx = 0, cy = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function animGlow() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animGlow);
  }
  animGlow();
}

/* ============================================================
   6. SCROLL TO TOP BUTTON
   ============================================================ */
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
}

/* ============================================================
   7. UPLOAD POZE — HERO
   ============================================================ */
function initHeroUpload() {
  const placeholder = document.getElementById('heroPlaceholder');
  const fileInput   = document.getElementById('heroFileInput');
  const preview     = document.getElementById('heroImgPreview');

  if (!placeholder || !fileInput || !preview) return;

  placeholder.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
      placeholder.style.display = 'none';

      // Animatie fade in
      preview.style.opacity = '0';
      preview.style.transform = 'scale(1.04)';
      preview.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      setTimeout(() => {
        preview.style.opacity = '1';
        preview.style.transform = 'scale(1)';
      }, 20);
    };
    reader.readAsDataURL(file);
  });
}

/* ============================================================
   8. UPLOAD POZE — GALERIE
   ============================================================ */
function initGalleryUploads() {
  // Fiecare slot de galerie
  for (let i = 1; i <= 3; i++) {
    setupGallerySlot(`gallerySlot${i}`, `galleryInput${i}`, `galleryPreview${i}`);
  }
}

function setupGallerySlot(slotId, inputId, previewId) {
  const slot    = document.getElementById(slotId);
  const input   = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (!slot || !input || !preview) return;

  slot.addEventListener('click', () => input.click());

  // Drag & drop
  slot.addEventListener('dragover', (e) => {
    e.preventDefault();
    slot.style.outline = '2px dashed rgba(255,255,255,0.6)';
    slot.style.outlineOffset = '-4px';
  });
  slot.addEventListener('dragleave', () => {
    slot.style.outline = '';
  });
  slot.addEventListener('drop', (e) => {
    e.preventDefault();
    slot.style.outline = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImageIntoSlot(file, slot, preview);
    }
  });

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) loadImageIntoSlot(file, slot, preview);
  });
}

function loadImageIntoSlot(file, slot, preview) {
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;

    // Animatie in
    preview.style.opacity = '0';
    preview.style.display = 'block';
    preview.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    preview.style.transform = 'scale(1.06)';

    setTimeout(() => {
      preview.style.opacity  = '1';
      preview.style.transform = 'scale(1)';
    }, 20);

    // Ascunde placeholder
    slot.querySelectorAll('.gallery-photo-icon, .gallery-photo-label, .add-photo-btn')
      .forEach(el => {
        el.style.transition = 'opacity 0.3s';
        el.style.opacity = '0';
        setTimeout(() => el.style.display = 'none', 300);
      });
  };
  reader.readAsDataURL(file);
}

/* ============================================================
   9. AVATAR AUTO-INITIALE
   ============================================================ */
function initAvatarUpdate() {
  const nameEl  = document.getElementById('studentName');
  const avatarEl = document.getElementById('avatarInitials');
  if (!nameEl || !avatarEl) return;

  function updateAvatar() {
    const txt   = nameEl.textContent.trim();
    const parts = txt.split(/\s+/).filter(Boolean);
    const initials = parts.slice(0, 2).map(p => p[0].toUpperCase()).join('');
    avatarEl.textContent = initials || '??';

    // Animatie
    avatarEl.style.transform = 'scale(1.2)';
    avatarEl.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => { avatarEl.style.transform = 'scale(1)'; }, 300);
  }

  nameEl.addEventListener('blur',  updateAvatar);
  nameEl.addEventListener('input', updateAvatar);
}

/* ============================================================
   10. COUNTER ANIMATIE (sectiunea statistici, daca exista)
   ============================================================ */
function animateCounter(el, target, duration = 1200) {
  const start     = performance.now();
  const startVal  = 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.counter), 1400);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

/* ============================================================
   11. SMOOTH ANCHOR SCROLL (cu offset pentru nav fix)
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navH   = document.querySelector('nav.site-nav')?.offsetHeight || 68;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   12. CARD TILT EFFECT (desktop)
   ============================================================ */
function initCardTilt() {
  if (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.dest-card, .gallery-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX   = -y * 6;
      const rotY   =  x * 6;

      card.style.transform    = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transition   = 'transform 0.1s ease';
      card.style.willChange   = 'transform';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.45s var(--ease-spring)';
    });
  });
}

/* ============================================================
   13. READING PROGRESS BAR
   ============================================================ */
function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'readingBar';
  Object.assign(bar.style, {
    position: 'fixed',
    top: '0', left: '0',
    height: '3px',
    background: 'var(--terra)',
    width: '0%',
    zIndex: '999',
    transition: 'width 0.1s linear',
    pointerEvents: 'none'
  });
  document.body.insertAdjacentElement('afterbegin', bar);

  window.addEventListener('scroll', () => {
    const docH   = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = pct.toFixed(1) + '%';
  }, { passive: true });
}

/* ============================================================
   14. TYPED TEXT EFFECT IN HERO SUBTITLE
   ============================================================ */
function initTypedText() {
  const el = document.getElementById('heroTyped');
  if (!el) return;

  const phrases = [
    'locuri unice din România.',
    'peisaje de neuitat.',
    'culturi fascinante.',
    'aventuri extraordinare.'
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function type() {
    if (paused) return;

    const current = phrases[phraseIdx];

    if (deleting) {
      el.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 50);
    } else {
      el.textContent = current.substring(0, charIdx++);
      if (charIdx > current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; type(); }, 2200);
        return;
      }
      setTimeout(type, 70);
    }
  }

  // Incepe dupa incarcare
  setTimeout(type, 1800);
}

/* ============================================================
   INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden'; // blocat cat timp e loader

  initPageLoader();
  initNavigation();
  initScrollReveal();
  initHeroParallax();
  initCursorGlow();
  initScrollTop();
  initHeroUpload();
  initGalleryUploads();
  initAvatarUpdate();
  initCounters();
  initSmoothScroll();
  initCardTilt();
  initProgressBar();
  initTypedText();

  console.log('%cWanderRo 🌍 Site incarcat cu succes!', 'color:#C0603A;font-size:14px;font-weight:bold;');
});
