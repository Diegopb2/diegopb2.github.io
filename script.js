// ==========================================================================
// Config
// ==========================================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================================================
// Generic typing engine (supports colored tokens, preserved across chars)
// tokens: [{ text: 'algo', cls: 'fc-kw' }, { text: '\n' }, ...]
// cls omitted/undefined = default color (inherits from container)
// '\n' inside text renders as a line break
// ==========================================================================
function buildTypedHTML(tokens, count) {
  let html = '';
  let curCls = null;
  let buffer = '';
  let seen = 0;

  function flush() {
    if (!buffer) return;
    html += curCls ? `<span class="${curCls}">${buffer}</span>` : buffer;
    buffer = '';
  }

  outer:
  for (const token of tokens) {
    const cls = token.cls || null;
    for (const ch of token.text) {
      if (seen >= count) break outer;
      if (ch === '\n') {
        flush();
        html += '<br>';
        curCls = null;
      } else {
        if (cls !== curCls) { flush(); curCls = cls; }
        buffer += ch;
      }
      seen++;
    }
  }
  flush();
  return html;
}

function tokensLength(tokens) {
  return tokens.reduce((n, t) => n + t.text.length, 0);
}

function typeTokens(el, tokens, opts = {}) {
  const { charDelayMin = 14, charDelayMax = 32, linePause = 90, onDone } = opts;
  const total = tokensLength(tokens);

  if (prefersReducedMotion) {
    el.innerHTML = buildTypedHTML(tokens, total);
    onDone && onDone();
    return;
  }

  // Precompute the flat char list with their source char (to detect newlines for pausing)
  const flatChars = [];
  tokens.forEach(t => { for (const ch of t.text) flatChars.push(ch); });

  let i = 0;
  function step() {
    if (i >= total) { onDone && onDone(); return; }
    i++;
    el.innerHTML = buildTypedHTML(tokens, i);
    const wasNewline = flatChars[i - 1] === '\n';
    setTimeout(step, wasNewline ? linePause : charDelayMin + Math.random() * (charDelayMax - charDelayMin));
  }
  step();
}

// ==========================================================================
// Hero: Java snippet typing
// ==========================================================================
function runHeroTyping() {
  const el = document.getElementById('bootLines');
  const nameEl = document.getElementById('heroName');
  if (!el) return;

  const tokens = [
    { text: 'public class Diego {\n' },
    { text: '    public static void main(String[] args) {\n' },
    { text: '        System.out.println("Desenvolvedor Full Stack em formação");\n' },
    { text: '    }\n' },
    { text: '}' },
  ];

  typeTokens(el, tokens, {
    onDone: () => nameEl && nameEl.classList.add('is-visible'),
  });
}

// ==========================================================================
// Footer: Java snippet typing (colored), triggered on scroll into view
// ==========================================================================
function initFooterTyping() {
  const el = document.getElementById('footerCode');
  if (!el) return;

  const year = new Date().getFullYear();

  const tokens = [
    { text: 'public class ', cls: 'fc-kw' },
    { text: 'Rodape' , cls: 'fc-cls' },
    { text: ' {\n' },
    { text: '\u00A0\u00A0' },
    { text: 'public static void', cls: 'fc-kw' },
    { text: ' ' },
    { text: 'main', cls: 'fc-fn' },
    { text: '(String[] args) {\n' },
    { text: '\u00A0\u00A0\u00A0\u00A0System.out.' },
    { text: 'println', cls: 'fc-fn' },
    { text: '(' },
    { text: `"feito com café, paciência e um pouco de PowerShell — ${year}"`, cls: 'fc-str' },
    { text: ');\n' },
    { text: '\u00A0\u00A0}\n' },
    { text: '}' },
  ];

  const run = () => typeTokens(el, tokens, { charDelayMin: 10, charDelayMax: 22, linePause: 70 });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    run();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        run();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(el);
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
  runHeroTyping();
  initFooterTyping();
  initMobileNav();
  initScrollReveal();
});
