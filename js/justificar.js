/* =========================================================
   PDUL Maturín · Afinador de texto justificado
   Para cada párrafo .just prueba combinaciones muy finas de
   espaciado entre palabras y entre letras y se queda con la
   que deja el hueco más pequeño entre palabras (sin "ríos").
   Los cambios son imperceptibles a simple vista (≤ 0,012 em).
   ========================================================= */
(function () {
  'use strict';

  var PALABRA = [-0.08, -0.06, -0.04, -0.02, 0];
  var LETRA = [-0.012, -0.006, 0, 0.006, 0.012];
  // si aún queda un hueco grande, se estrecha el párrafo unos píxeles (siempre dentro del padding de la tarjeta)
  var MARGEN = [0, 4, 8, 12, 16, 20];
  var OBJETIVO = 1.6;
  // último recurso (solo si un párrafo no logra bajar de ACEPTABLE): variación mínima del cuerpo de letra
  var ESCALA = [1, 0.975, 1.025, 0.95, 1.05];
  var ACEPTABLE = 2.0;
  var LIMITE = 3.2;

  function medir(el, anchoEspacio) {
    var tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var n, prev = null, peor = 0, suma = 0, cuenta = 0;
    while ((n = tw.nextNode())) {
      var re = /\S+/g, m, t = n.nodeValue;
      while ((m = re.exec(t))) {
        var r = document.createRange();
        r.setStart(n, m.index);
        r.setEnd(n, m.index + m[0].length);
        var rects = r.getClientRects();
        if (!rects.length) continue;
        var ini = rects[0], fin = rects[rects.length - 1];
        if (prev && Math.abs(prev.top - ini.top) < 4) {
          var ratio = (ini.left - prev.right) / anchoEspacio;
          if (ratio > peor) peor = ratio;
          suma += ratio * ratio; cuenta++;
        }
        prev = fin;
      }
    }
    return { peor: peor, media: cuenta ? suma / cuenta : 0 };
  }

  function afinar(el) {
    el.style.fontSize = ''; el.style.marginRight = ''; el.style.wordSpacing = ''; el.style.letterSpacing = ''; el.style.textAlign = ''; el.style.textAlignLast = '';
    var cs = getComputedStyle(el);
    if (cs.textAlign !== 'justify') { el.style.wordSpacing = ''; el.style.letterSpacing = ''; el.style.marginRight = ''; el.style.fontSize = ''; return; }
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    var esp = ctx.measureText(' ').width || 4;
    var fs = parseFloat(cs.fontSize);
    var mejor = null;
    for (var e = 0; e < ESCALA.length; e++) {
      el.style.fontSize = ESCALA[e] === 1 ? '' : (fs * ESCALA[e]).toFixed(2) + 'px';
      var esc = ESCALA[e] === 1 ? esp : esp * ESCALA[e];
      for (var k = 0; k < MARGEN.length; k++) {
        el.style.marginRight = MARGEN[k] ? MARGEN[k] + 'px' : '';
        for (var i = 0; i < PALABRA.length; i++) {
          for (var j = 0; j < LETRA.length; j++) {
            el.style.wordSpacing = PALABRA[i] + 'em';
            el.style.letterSpacing = LETRA[j] + 'em';
            var r = medir(el, esc);
            // puntuación: prioriza el peor hueco y luego el promedio
            var punt = r.peor * 10 + r.media + Math.abs(LETRA[j]) * 30 + MARGEN[k] * 0.05 + Math.abs(ESCALA[e] - 1) * 40;
            if (!mejor || punt < mejor.punt) mejor = { punt: punt, p: PALABRA[i], l: LETRA[j], m: MARGEN[k], e: ESCALA[e], peor: r.peor };
          }
        }
        if (mejor.peor <= OBJETIVO) break;
      }
      if (mejor.peor <= ACEPTABLE) break;
    }
    el.style.fontSize = mejor.e === 1 ? '' : (fs * mejor.e).toFixed(2) + 'px';
    el.style.wordSpacing = mejor.p + 'em';
    el.style.letterSpacing = mejor.l + 'em';
    el.style.marginRight = mejor.m ? mejor.m + 'px' : '';
    // red de seguridad: si aun así quedara un hueco exagerado (columnas diminutas), se alinea a la izquierda
    el.style.textAlign = mejor.peor > LIMITE ? 'left' : '';
    el.style.textAlignLast = mejor.peor > LIMITE ? 'auto' : '';
  }

  function todo() {
    var els = document.querySelectorAll('.just');
    for (var i = 0; i < els.length; i++) afinar(els[i]);
  }

  var t;
  function programar() { clearTimeout(t); t = setTimeout(todo, 150); }

  function iniciar() {
    var listo = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    listo.then(function () { requestAnimationFrame(todo); });
    window.addEventListener('resize', programar);
    window.addEventListener('load', programar);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
