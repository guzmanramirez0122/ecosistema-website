/* ============================================================
   RG Animations — Ramírez Guzmán / César Ramírez landing
   Sistema de animaciones premium adaptado del Studio CMS.
   Curva estrella: cubic-bezier(0.2, 0.8, 0.2, 1).

   IMPORTANTE: No aplica transform al <body> (rompe position:fixed).
   page-loader.js sigue manejando el fade-in del body.

   Uso: <script src="rg-animations.js"></script> antes de </body>.
   Auto-aplica reveal-on-scroll a <section> (excepto la primera) y
   <footer>; agrega hovers a .btn-gold/.btn-outline/.case-card/etc.
   Respeta prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var styleHTML =
    ':root { --rg-ease: cubic-bezier(0.2, 0.8, 0.2, 1); }' +
    '@keyframes rg-fade-in    { from { opacity:0; } to { opacity:1; } }' +
    '@keyframes rg-scale-in   { from { opacity:0; transform: translateY(6px) scale(0.985); } to { opacity:1; transform: none; } }' +
    '@keyframes rg-slide-left { from { opacity:0; transform: translateX(-8px); } to { opacity:1; transform: none; } }' +

    '.rg-reveal, .rg-reveal-fade, .rg-reveal-left { opacity: 0; will-change: transform, opacity; }' +
    '.rg-reveal.in-view      { animation: rg-scale-in 460ms var(--rg-ease) both; }' +
    '.rg-reveal-fade.in-view { animation: rg-fade-in 320ms ease both; }' +
    '.rg-reveal-left.in-view { animation: rg-slide-left 360ms var(--rg-ease) both; }' +

    '.rg-stagger.in-view > *:nth-child(1) { animation-delay: 60ms; }' +
    '.rg-stagger.in-view > *:nth-child(2) { animation-delay: 120ms; }' +
    '.rg-stagger.in-view > *:nth-child(3) { animation-delay: 180ms; }' +
    '.rg-stagger.in-view > *:nth-child(4) { animation-delay: 240ms; }' +
    '.rg-stagger.in-view > *:nth-child(5) { animation-delay: 300ms; }' +
    '.rg-stagger.in-view > *:nth-child(n+6) { animation-delay: 360ms; }' +

    '.btn-gold, .btn-outline, .case-card, .t-card, .service-row, .faq-item, ' +
    '#cases-prev, #cases-next, #testimonials-prev, #testimonials-next, ' +
    'nav a, footer a {' +
    '  transition: transform 220ms var(--rg-ease), box-shadow 220ms var(--rg-ease),' +
    '              border-color 220ms ease, background-color 220ms ease,' +
    '              color 200ms ease, opacity 200ms ease;' +
    '}' +
    '.btn-gold:hover  { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(20,17,12,0.22); opacity: 0.95; }' +
    '.btn-outline:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(154,162,192,0.20); }' +
    '.btn-gold:active, .btn-outline:active { transform: scale(0.98); }' +

    '.case-card:hover, .t-card:hover {' +
    '  transform: translateY(-3px);' +
    '  box-shadow: 0 14px 32px rgba(20,17,12,0.10);' +
    '  border-color: rgba(154,162,192,0.50);' +
    '}' +
    '.service-row { transform-origin: left center; }' +
    '.service-row:hover { background: rgba(154,162,192,0.05); transform: translateX(3px); }' +
    '.faq-item:hover    { background: rgba(154,162,192,0.03); }' +

    'nav a:hover    { transform: translateY(-1px); }' +
    'footer a { position: relative; }' +
    'footer a::after {' +
    '  content: \'\'; position: absolute; left: 0; bottom: -2px;' +
    '  width: 100%; height: 1px; background: currentColor;' +
    '  transform: scaleX(0); transform-origin: left;' +
    '  transition: transform 220ms var(--rg-ease);' +
    '}' +
    'footer a:hover::after { transform: scaleX(1); }' +

    '#cases-prev:hover, #cases-next:hover,' +
    '#testimonials-prev:hover, #testimonials-next:hover { transform: scale(1.10); }' +
    '#cases-prev:active, #cases-next:active,' +
    '#testimonials-prev:active, #testimonials-next:active { transform: scale(0.94); }' +

    '@media (prefers-reduced-motion: reduce) {' +
    '  *, *::before, *::after {' +
    '    animation-duration: 0.01ms !important;' +
    '    animation-iteration-count: 1 !important;' +
    '    transition-duration: 0.01ms !important;' +
    '  }' +
    '  .rg-reveal, .rg-reveal-fade, .rg-reveal-left { opacity: 1 !important; }' +
    '}';

  function injectStyle() {
    if (document.getElementById('rg-animations-style')) return;
    var s = document.createElement('style');
    s.id = 'rg-animations-style';
    s.textContent = styleHTML;
    document.head.appendChild(s);
  }

  var io = null;
  var observed = (typeof WeakSet === 'function') ? new WeakSet() : null;

  function ensureObserver() {
    if (io || !('IntersectionObserver' in window)) return io;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    return io;
  }

  function observeAll(root) {
    var observer = ensureObserver();
    if (!observer) {
      (root || document).querySelectorAll('.rg-reveal, .rg-reveal-fade, .rg-reveal-left').forEach(function (el) {
        el.classList.add('in-view');
      });
      return;
    }
    (root || document).querySelectorAll('.rg-reveal, .rg-reveal-fade, .rg-reveal-left, .rg-stagger').forEach(function (el) {
      if (observed && observed.has(el)) return;
      if (observed) observed.add(el);
      observer.observe(el);
    });
  }

  function tagAndObserve(root) {
    var sections = (root || document).querySelectorAll('section');
    sections.forEach(function (s, i) {
      // En el documento principal saltamos la primera (hero); en sub-roots, animar todas
      if (!root && i === 0) return;
      if (!s.classList.contains('rg-reveal') &&
          !s.classList.contains('rg-reveal-fade') &&
          !s.classList.contains('rg-reveal-left')) {
        s.classList.add('rg-reveal-fade');
      }
    });
    var footer = (root || document).querySelector('footer');
    if (footer &&
        !footer.classList.contains('rg-reveal') &&
        !footer.classList.contains('rg-reveal-fade')) {
      footer.classList.add('rg-reveal-fade');
    }
    observeAll(root);
  }

  function init() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    tagAndObserve(null);

    // Bundler-aware: si el contenido se inyecta dinámicamente (Spotify.html / YouTube.html
    // usan templates de bundler), re-evaluar cuando aparezcan nuevas <section>.
    if (typeof MutationObserver !== 'function') return;
    var last = document.querySelectorAll('section').length;
    var mo = new MutationObserver(function () {
      var current = document.querySelectorAll('section').length;
      if (current !== last) {
        last = current;
        tagAndObserve(null);
      }
    });
    mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
    // Auto-desconectar después de 12s — la renderización inicial del bundler ya terminó.
    setTimeout(function () { mo.disconnect(); }, 12000);
  }

  injectStyle();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
