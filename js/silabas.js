/* =========================================================
   PDUL Maturín · Silabeador español
   Inserta guiones suaves (&shy;) en los textos con clase .just
   para que el navegador corte las palabras por sílabas y el
   texto justificado quede parejo, sin "ríos" blancos.
   No depende del diccionario del navegador.
   ========================================================= */
(function () {
  'use strict';

  var SHY = '\u00AD';
  var FUERTES = 'aeoáéóíúAEOÁÉÓ';          // a, e, o (y vocales con tilde)
  var DEBILES = 'iuüIUÜ';                  // i, u sin tilde
  var VOCALES = 'aeiouáéíóúüAEIOUÁÉÍÓÚÜ';
  var TILDE_DEBIL = 'íúÍÚ';
  var INSEPARABLES = ['pr', 'pl', 'br', 'bl', 'fr', 'fl', 'tr', 'dr', 'cr', 'cl', 'gr', 'gl', 'kr', 'kl', 'ch', 'll', 'rr'];

  function esVocal(c) { return VOCALES.indexOf(c) > -1; }

  // ¿Dos vocales seguidas forman diptongo (misma sílaba)?
  function diptongo(a, b) {
    var fa = FUERTES.indexOf(a) > -1 || TILDE_DEBIL.indexOf(a) > -1;
    var fb = FUERTES.indexOf(b) > -1 || TILDE_DEBIL.indexOf(b) > -1;
    if (TILDE_DEBIL.indexOf(a) > -1 || TILDE_DEBIL.indexOf(b) > -1) return false; // hiato
    if (fa && fb) return false;                                               // hiato (a-e, o-a…)
    return true;                                                              // fuerte+débil, débil+fuerte, débil+débil
  }

  function silabas(palabra) {
    var p = palabra, n = p.length, i;
    var cortes = []; // posiciones donde empieza una sílaba nueva

    // 1) localizar núcleos vocálicos (agrupando diptongos)
    var nucleos = []; // [inicio, fin]
    i = 0;
    while (i < n) {
      var c = p.charAt(i);
      var lc = c.toLowerCase();
      var esV = esVocal(c) || (lc === 'y' && i === n - 1);
      if (esV) {
        var ini = i;
        while (i + 1 < n && esVocal(p.charAt(i + 1)) && diptongo(p.charAt(i), p.charAt(i + 1))) i++;
        // "qu"/"gu" + e,i: la u no cuenta como vocal
        nucleos.push([ini, i]);
      }
      i++;
    }
    // quitar la u muda de que/qui/gue/gui
    for (var k = 0; k < nucleos.length; k++) {
      var s = nucleos[k][0];
      var prev = s > 0 ? p.charAt(s - 1).toLowerCase() : '';
      if ((p.charAt(s).toLowerCase() === 'u') && (prev === 'q' || prev === 'g') && nucleos[k][1] > s) {
        nucleos[k][0] = s + 1; // la "u" pertenece a la consonante
        nucleos[k].push(true); // marca: "u" muda (que, qui, gue, gui)
      }
    }

    // 2) decidir corte entre núcleos consecutivos
    for (k = 0; k < nucleos.length - 1; k++) {
      var finA = nucleos[k][1];
      var iniB = nucleos[k + 1][0];
      var mudo = nucleos[k + 1][2] === true;
      var cons = p.slice(finA + 1, mudo ? iniB - 1 : iniB); // consonantes entre núcleos (sin la "u" muda)
      var low = cons.toLowerCase();
      var corte;
      if (low.length === 0) {
        corte = mudo ? finA + 1 : iniB;                            // hiato
      } else if (low.length === 1) {
        corte = finA + 1;                        // V-CV
      } else if (low.length === 2) {
        corte = INSEPARABLES.indexOf(low) > -1 ? finA + 1 : finA + 2;
      } else if (low.length === 3) {
        corte = INSEPARABLES.indexOf(low.slice(1)) > -1 ? finA + 2 : finA + 3;
      } else {
        corte = INSEPARABLES.indexOf(low.slice(2)) > -1 ? finA + 3 : finA + 4;
      }
      cortes.push(corte);
    }
    return cortes;
  }

  // Inserta guiones suaves (mín. 2 letras antes y 3 después del guion)
  function guionar(palabra) {
    var letras = palabra.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '');
    if (letras.length < 7) return palabra;
    var cortes = silabas(palabra);
    var salida = '', ult = 0;
    for (var i = 0; i < cortes.length; i++) {
      var c = cortes[i];
      if (c >= 2 && palabra.length - c >= 3) {
        salida += palabra.slice(ult, c) + SHY;
        ult = c;
      }
    }
    return salida + palabra.slice(ult);
  }

  function procesarTexto(texto) {
    return texto.replace(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{7,}/g, guionar);
  }

  function recorrer(nodo) {
    if (nodo.nodeType === 3) {
      if (nodo.nodeValue.indexOf(SHY) === -1) nodo.nodeValue = procesarTexto(nodo.nodeValue);
    } else if (nodo.nodeType === 1 && !/^(SCRIPT|STYLE|SVG)$/i.test(nodo.nodeName)) {
      for (var h = nodo.firstChild; h; h = h.nextSibling) recorrer(h);
    }
  }

  function iniciar() {
    var els = document.querySelectorAll('.just');
    for (var i = 0; i < els.length; i++) recorrer(els[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  window.PDULSilabas = { silabas: silabas, guionar: guionar };
})();
