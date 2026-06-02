/* ============================================================
   Page Loader — Ramírez Guzmán
   Inyecta una animación de fade-in sutil al body para que cada
   página cargue de manera visualmente agradable.

   IMPORTANTE: Solo se anima la opacidad (no transform).
   Aplicar transform al <body> rompe position:fixed de modales,
   tooltips, navs sticky, etc. — un transform en el ancestor
   convierte a los elementos fixed en absolute respecto al body.

   IMPORTANTE 2: Este script debe incluirse dentro del <head>
   (antes de </head>) para que la animación aplique antes de
   que se renderice el body — evita el "flash" del contenido.
   ============================================================ */
(function () {
  'use strict';
  var s = document.createElement('style');
  s.id = '__page-loader-style';
  s.textContent =
    '@keyframes plPageFadeIn{from{opacity:0}to{opacity:1}}' +
    'body{animation:plPageFadeIn .18s ease-out both;}' +
    '@media (prefers-reduced-motion: reduce){body{animation:none;}}';
  document.head.appendChild(s);
})();
