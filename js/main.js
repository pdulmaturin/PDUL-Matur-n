/* PDUL Maturín · interacciones mínimas */
(function () {
  'use strict';

  // Menú móvil
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    var cerrar = function () {
      menu.classList.remove('abierto');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menú');
    };
    burger.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      burger.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) cerrar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 760) cerrar(); });
  }

  // Aparición suave al hacer scroll
  var items = document.querySelectorAll('.celda, .burbuja, .blanca, .dos-tonos, .resumen, blockquote, .promo-t, .final .wrap');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
