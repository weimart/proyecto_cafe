/* ============================================================================
   resenas-google.js — «Califica nuestro café en Google»

   Muestra un botón que lleva al formulario de reseñas del Perfil de Empresa de
   Esencia y Taza en Google. Aparece en el pie de la página principal y en la
   página de gracias después de una compra.

   Mientras ENLACE esté vacío no se muestra nada: el enlace sale del Perfil de
   Empresa de Google (Perfil → «Pedir opiniones» → «Compartir formulario de
   opiniones») y se ve como https://g.page/r/XXXXXXXXXXXX/review

   Las reseñas son de clientes reales y se escriben en Google: aquí no se
   guarda ni se muestra ninguna calificación, y no se ofrece nada a cambio de
   opinar (Google lo prohíbe y puede borrar las reseñas o la ficha).
   ============================================================================ */
(function () {
  'use strict';
  var ENLACE = '';

  if (!/^https:\/\/(g\.page|www\.google\.com|maps\.app\.goo\.gl|search\.google\.com)\//.test(ENLACE)) return;

  var estilo = document.createElement('style');
  estilo.textContent =
    '.resena-google{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;margin:22px auto 0;max-width:420px}' +
    '.resena-google p{margin:0;font-size:14px;line-height:1.5;opacity:.9}' +
    '.resena-google a{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:999px;' +
    'background:#fff;color:#3B2214;font-weight:600;font-size:15px;text-decoration:none;border:1px solid #E8D9C5;' +
    'box-shadow:0 2px 8px rgba(0,0,0,.08)}' +
    '.resena-google a:hover,.resena-google a:focus-visible{border-color:#D89B2B;outline:none}' +
    '.resena-google .estrellas{color:#D89B2B;letter-spacing:2px}' +
    'footer .resena-google p{color:#E8D9C5}';            // el pie es oscuro: el texto va claro
  document.head.appendChild(estilo);

  function bloque(texto) {
    var div = document.createElement('div');
    div.className = 'resena-google';
    var p = document.createElement('p');
    p.textContent = texto;
    var a = document.createElement('a');
    a.href = ENLACE;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    var est = document.createElement('span');
    est.className = 'estrellas';
    est.setAttribute('aria-hidden', 'true');
    est.textContent = '★★★★★';
    a.appendChild(est);
    a.appendChild(document.createTextNode(' Califica nuestro café en Google'));
    div.appendChild(p);
    div.appendChild(a);
    return div;
  }

  // Página de gracias: debajo de los botones de la compra.
  var wa = document.getElementById('gr-btn-wa');
  if (wa && wa.parentNode) {
    wa.parentNode.parentNode.insertBefore(
      bloque('¿Ya probaste el café? Cuéntalo en Google: tu opinión ayuda a que más personas encuentren café de Caicedo.'),
      wa.parentNode.nextSibling);
    return;
  }
  // Página principal: en el pie.
  var pie = document.querySelector('footer .footer-content');
  if (pie && pie.parentNode) {
    pie.parentNode.insertBefore(bloque('¿Ya compraste? Califica el café en Google.'), pie.nextSibling);
  }
})();
