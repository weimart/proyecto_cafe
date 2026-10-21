/* ============================================================================
   ESENCIA Y TAZA — JS compartido del blog
   Extraído de cada HTML para permitir una CSP estricta (sin scripts inline).
   =========================================================================== */
(function () {
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  // ── Menú móvil ──
  (function () {
    var btn  = document.getElementById('blog-ham');
    var menu = document.getElementById('blog-mobile-menu');
    var nav  = document.querySelector('.blog-nav');
    if (!btn || !menu) return;

    function navH() { return nav ? nav.offsetHeight : 66; }
    function abrir() {
      menu.style.top = navH() + 'px';
      menu.removeAttribute('hidden');
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function cerrar() {
      menu.setAttribute('hidden', '');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      if (menu.hasAttribute('hidden')) abrir(); else cerrar();
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', cerrar); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
    window.addEventListener('resize', function () {
      if (!menu.hasAttribute('hidden')) menu.style.top = navH() + 'px';
    });
  }());

  // ── Compartir por WhatsApp (solo en la guía de métodos) ──
  (function () {
    var a = document.getElementById('share-wa-metodos');
    if (!a) return;
    var txt = 'Mira esta guía completa de métodos de preparación de café: https://esenciaytaza.com/blog/metodos-preparacion.html';
    a.href = 'https://wa.me/?text=' + encodeURIComponent(txt);
  }());
}());
