// ==========================================================================
// Config
// ==========================================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const bootSequence = [
  { text: 'public class Diego {' },
  { text: '    public static void main(String[] args) {' },
  { text: '        System.out.println("Desenvolvedor Full Stack em formação");' },
  { text: '    }' },
  { text: '}' },
];

// ==========================================================================
// Boot sequence typing animation
// ==========================================================================
function runBootSequence() {
  const el = document.getElementById('bootLines');
  const nameEl = document.getElementById('heroName');

  if (!el) return;

  if (prefersReducedMotion) {
    el.textContent = bootSequence.map(l => l.text).join('\n');
    nameEl.classList.add('is-visible');
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let currentText = '';

  function typeChar() {
    if (lineIndex >= bootSequence.length) {
      nameEl.classList.add('is-visible');
      return;
    }

    const line = bootSequence[lineIndex];

    if (charIndex < line.text.length) {
      currentText += line.text[charIndex];
      el.textContent = getDisplayText();
      charIndex++;
      setTimeout(typeChar, 14 + Math.random() * 18);
    } else {
      lineIndex++;
      charIndex = 0;
      currentText += '\n';
      setTimeout(typeChar, 90);
    }
  }

  function getDisplayText() {
    const done = bootSequence.slice(0, lineIndex).map(l => l.text).join('\n');
    return done + (done ? '\n' : '') + currentText.split('\n').pop();
  }

  typeChar();
}

// ==========================================================================
// Mobile nav toggle
// ==========================================================================
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ==========================================================================
// Scroll reveal for sections
// ==========================================================================
function initScrollReveal() {
  const targets = document.querySelectorAll('.section, .project-card, .stack-card, .timeline__item');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    return;
  }

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

// ==========================================================================
// Footer year
// ==========================================================================
function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ==========================================================================
// Lightbox for project screenshots
// ==========================================================================
function openLightbox(src) {
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!box || !img) return;
  img.src = src;
  box.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const box = document.getElementById('lightbox');
  if (!box) return;
  box.classList.remove('is-open');
  document.body.style.overflow = '';
}

// ==========================================================================
// Init
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  runBootSequence();
  initMobileNav();
  initScrollReveal();
  setFooterYear();
});
