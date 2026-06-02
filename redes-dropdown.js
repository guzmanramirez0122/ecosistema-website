/* ============================================================
   Redes Dropdown — Ramírez Guzmán
   Convierte cualquier link "Redes" del nav en un dropdown con
   los iconos de Spotify, YouTube, Facebook e Instagram.

   Uso: <script src="redes-dropdown.js"></script>
        (antes de </body> en cualquier página)

   El script:
   - Busca cualquier <a>, <span> o <button> cuyo texto sea "Redes"
   - Lo reemplaza por un trigger con caret + un menú flotante
   - NO modifica elementos que ya estén dentro de un dropdown
     (ej. el index que ya tiene el suyo) → safe re-include
   ============================================================ */
(function () {
  'use strict';

  var FB = 'https://www.facebook.com/cesarramirezrdz1/';
  var IG = 'https://www.instagram.com/cesarramirezrdz?igsh=c3dhcjI3OTl0YXEy';

  var spotifySvg  = '<svg viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12C24 5.4 18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>';
  var youtubeSvg  = '<svg viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
  var facebookSvg = '<svg viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
  var instagramSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="rd-ig-grad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#FED576"/><stop offset="26%" stop-color="#F47133"/><stop offset="61%" stop-color="#BC3081"/><stop offset="100%" stop-color="#4C63D2"/></linearGradient></defs><path fill="url(#rd-ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>';
  var caretSvg    = '<svg class="rd-caret" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var css = ''
    + '.rd-wrap{position:relative;display:inline-flex;align-items:center;}'
    + '.rd-trigger{cursor:pointer;display:inline-flex;align-items:center;gap:4px;text-decoration:none;}'
    + '.rd-trigger .rd-caret{width:10px;height:10px;transition:transform .2s;flex-shrink:0;}'
    + '.rd-wrap:hover .rd-trigger .rd-caret,.rd-wrap.rd-open .rd-trigger .rd-caret{transform:rotate(180deg);}'
    + '.rd-menu{display:none;position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:12px;z-index:9999;}'
    + '.rd-wrap:hover .rd-menu,.rd-wrap.rd-open .rd-menu{display:block;}'
    + '.rd-card{background:#fff;border-radius:16px;padding:8px 0;box-shadow:0 20px 50px rgba(14,11,0,0.18);border:1px solid rgba(154,162,192,0.2);min-width:180px;}'
    + '.rd-item{display:flex;align-items:center;gap:12px;padding:10px 16px;color:#0E0B00!important;text-decoration:none;font-size:14px;font-family:Inter,Arial,sans-serif;transition:background .15s;background:transparent!important;}'
    + '.rd-item:hover{background:#F8F5EF!important;}'
    + '.rd-item span{font-weight:500;}'
    + '.rd-item svg{width:20px;height:20px;flex-shrink:0;}'
    ;

  function buildMenu() {
    return '<div class="rd-card">'
      + '<a href="Spotify.html" class="rd-item">' + spotifySvg + '<span>Spotify</span></a>'
      + '<a href="YouTube.html" class="rd-item">' + youtubeSvg + '<span>YouTube</span></a>'
      + '<a href="' + FB + '" target="_blank" rel="noopener" class="rd-item">' + facebookSvg + '<span>Facebook</span></a>'
      + '<a href="' + IG + '" target="_blank" rel="noopener" class="rd-item">' + instagramSvg + '<span>Instagram</span></a>'
      + '</div>';
  }

  function isAlreadyDropdown(el) {
    if (el.closest('.rd-wrap, .rd-menu')) return true;
    // Si el contenedor padre ya menciona "Spotify"/"Instagram" es que ya tiene
    // un dropdown construido (ej. el del index inline).
    var parent = el.parentElement;
    if (parent && /Spotify|Instagram/i.test(parent.textContent || '')) return true;
    return false;
  }

  function convert(el) {
    if (isAlreadyDropdown(el)) return;

    // Conservamos las clases originales para que mantenga el estilo del nav.
    var origClass = el.className || '';

    var wrap = document.createElement('div');
    wrap.className = 'rd-wrap';

    var trigger = document.createElement('span');
    trigger.className = 'rd-trigger ' + origClass;
    trigger.innerHTML = 'Redes ' + caretSvg;

    var menu = document.createElement('div');
    menu.className = 'rd-menu';
    menu.innerHTML = buildMenu();

    wrap.appendChild(trigger);
    wrap.appendChild(menu);
    el.replaceWith(wrap);

    // Tap/click para dispositivos táctiles
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      wrap.classList.toggle('rd-open');
    });
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Buscamos candidatos cuyo texto trimmed sea exactamente "Redes"
    var nodes = document.querySelectorAll('a, span, button');
    var candidates = [];
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var txt = (el.textContent || '').trim();
      if (txt === 'Redes') candidates.push(el);
    }
    candidates.forEach(convert);

    // Cerrar al hacer click afuera (estado tap-open)
    document.addEventListener('click', function (e) {
      document.querySelectorAll('.rd-wrap.rd-open').forEach(function (w) {
        if (!w.contains(e.target)) w.classList.remove('rd-open');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
