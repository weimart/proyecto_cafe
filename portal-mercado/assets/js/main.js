/* ============================================================================
   ESENCIA Y TAZA - MAIN.JS (versión de mercado)
   Productos dinámicos + carrito funcional (preparado para Wompi)
   =========================================================================== */

const WHATSAPP = '573022573244';

// ── Configuración de Wompi (se completará cuando llegue la llave) ──────────
// Cuando el equipo entregue la llave pública, reemplazar aquí:
const WOMPI = {
  publicKey: '',          // ej: 'pub_prod_xxxxxxxxxxxx'  <-- PEGAR AQUÍ
  currency: 'COP',
  activo: false           // poner en true cuando publicKey esté lista
};

// ── Catálogo: Café Origen Caicedo, presentaciones (grano o molido) ─────────
const PRESENTACIONES = [
  { id: '125g',  tamano: '125 g',  precio: 20000 },
  { id: '250g',  tamano: '250 g',  precio: 33000 },
  { id: '500g',  tamano: '500 g',  precio: 60000, destacado: true },
  { id: '2500g', tamano: '2.5 kg', precio: 180000 }
];

const formatoCOP = (v) => '$' + v.toLocaleString('es-CO');

// ============================================================================
// MÓDULO: Carrito
// ============================================================================
const Cart = (() => {
  let items = []; // { key, nombre, tamano, tipo, precio, cantidad }

  const add = (tamano, tipo, precio) => {
    const key = `${tamano}-${tipo}`;
    const exist = items.find(i => i.key === key);
    if (exist) {
      exist.cantidad += 1;
    } else {
      items.push({ key, nombre: 'Café Origen Caicedo', tamano, tipo, precio, cantidad: 1 });
    }
    render();
    abrir();
  };

  const cambiarCantidad = (key, delta) => {
    const it = items.find(i => i.key === key);
    if (!it) return;
    it.cantidad += delta;
    if (it.cantidad <= 0) items = items.filter(i => i.key !== key);
    render();
  };

  const total = () => items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const totalItems = () => items.reduce((s, i) => s + i.cantidad, 0);

  const abrir = () => {
    document.getElementById('cart-panel')?.classList.add('abierto');
    document.getElementById('cart-overlay')?.classList.add('visible');
  };
  const cerrar = () => {
    document.getElementById('cart-panel')?.classList.remove('abierto');
    document.getElementById('cart-overlay')?.classList.remove('visible');
  };

  const render = () => {
    // Badge del botón del carrito
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = totalItems();

    // Lista de items en el panel
    const cont = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!cont) return;

    if (items.length === 0) {
      cont.innerHTML = '<p class="cart-vacio">Tu carrito está vacío.<br>Agrega tu café favorito ☕</p>';
      if (totalEl) totalEl.textContent = formatoCOP(0);
      document.getElementById('cart-checkout')?.setAttribute('disabled', 'true');
      document.getElementById('cart-pagar')?.setAttribute('disabled', 'true');
      return;
    }

    cont.innerHTML = items.map(i => `
      <div class="cart-item">
        <div class="cart-item-info">
          <strong>${i.nombre}</strong>
          <span>${i.tamano} · ${i.tipo}</span>
          <span class="cart-item-precio">${formatoCOP(i.precio)} c/u</span>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-key="${i.key}" data-delta="-1">−</button>
          <span>${i.cantidad}</span>
          <button class="qty-btn" data-key="${i.key}" data-delta="1">+</button>
        </div>
      </div>
    `).join('');

    if (totalEl) totalEl.textContent = formatoCOP(total());
    document.getElementById('cart-checkout')?.removeAttribute('disabled');
    document.getElementById('cart-pagar')?.removeAttribute('disabled');

    cont.querySelectorAll('.qty-btn').forEach(b => {
      b.addEventListener('click', () =>
        cambiarCantidad(b.getAttribute('data-key'), parseInt(b.getAttribute('data-delta'))));
    });
  };

  // ── Pedido por WhatsApp (siempre funcional) ──
  const checkout = () => {
    if (items.length === 0) return;
    checkoutWhatsApp();
  };

  // ── Pago en línea con Wompi (botón visible; activo cuando llegue la llave) ──
  const pagar = () => {
    if (items.length === 0) return;

    if (WOMPI.activo && WOMPI.publicKey) {
      checkoutWompi();
    } else {
      // Aún sin llave: mensaje claro + opción de seguir por WhatsApp
      const seguir = confirm(
        'El pago en línea estará disponible muy pronto 🔒\n\n' +
        'Por ahora puedes completar tu pedido por WhatsApp y te ' +
        'enviamos el link de pago seguro.\n\n¿Continuar por WhatsApp?'
      );
      if (seguir) checkoutWhatsApp();
    }
  };

  const checkoutWhatsApp = () => {
    let msg = 'Hola Esencia y Taza, quiero hacer este pedido:\n\n';
    items.forEach(i => {
      msg += `• ${i.cantidad}x Café Origen Caicedo ${i.tamano} (${i.tipo}) — ${formatoCOP(i.precio * i.cantidad)}\n`;
    });
    msg += `\n*Total: ${formatoCOP(total())}*\n\n¿Me confirman disponibilidad y costo de envío?`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Estructura lista para Wompi (Web Checkout). La firma de integridad
  // debe generarse en backend (Apps Script) — aquí queda el punto de enganche.
  const checkoutWompi = () => {
    // TODO: cuando llegue la llave + backend de firma:
    // 1. Pedir referencia + firma al Apps Script
    // 2. Redirigir a https://checkout.wompi.co/p/ con los datos
    alert('Pago con Wompi: pendiente de conectar la llave y la firma de integridad.');
    checkoutWhatsApp(); // fallback seguro mientras tanto
  };

  return { add, abrir, cerrar, render, checkout, pagar };
})();

// ============================================================================
// MÓDULO: Productos (tarjetas dinámicas con placeholder visual)
// ============================================================================
const Products = (() => {
  const render = () => {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = PRESENTACIONES.map((p, i) => `
      <article class="product-card">
        <div class="product-image product-placeholder">
          <img src="./assets/images/logo.png" alt="Esencia y Taza" class="placeholder-logo">
          <span class="placeholder-tamano">${p.tamano}</span>
          ${p.destacado ? '<span class="product-flag">Más pedido</span>' : ''}
        </div>
        <div class="product-info">
          <div class="product-label">CAICEDO, ANTIOQUIA</div>
          <h3 class="product-title">Café Origen Caicedo</h3>
          <p class="product-desc">Café 100% colombiano, tostado bajo pedido. Notas de chocolate y caramelo.</p>
          <div class="product-select">
            <label for="tipo-${i}">Presentación:</label>
            <select id="tipo-${i}" class="select-grind">
              <option value="En grano">${p.tamano} · En grano</option>
              <option value="Molido">${p.tamano} · Molido</option>
            </select>
          </div>
          <div class="product-footer">
            <div>
              <div class="product-price">${formatoCOP(p.precio)}</div>
              <div class="product-size">${p.tamano}</div>
            </div>
            <button class="btn btn-primary btn-add"
                    data-tamano="${p.tamano}"
                    data-precio="${p.precio}"
                    data-tipo-id="tipo-${i}">
              + Añadir
            </button>
          </div>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const tamano = btn.getAttribute('data-tamano');
        const precio = parseInt(btn.getAttribute('data-precio'));
        const sel = document.getElementById(btn.getAttribute('data-tipo-id'));
        const tipo = sel ? sel.value : 'En grano';
        Cart.add(tamano, tipo, precio);

        btn.textContent = '✓ Añadido';
        setTimeout(() => { btn.textContent = '+ Añadir'; }, 1500);
      });
    });
  };

  return { render };
})();

// ============================================================================
// MÓDULO: Navegación
// ============================================================================
const Navigation = (() => {
  const init = () => {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) header?.classList.add('sticky');
      else header?.classList.remove('sticky');
    }, { passive: true });

    document.querySelectorAll('.navbar-link').forEach(link => {
      link.addEventListener('click', () => {
        document.querySelectorAll('.navbar-link').forEach(l => l.classList.remove('navbar-link--active'));
        link.classList.add('navbar-link--active');
      });
    });
  };
  return { init };
})();

// ============================================================================
// MÓDULO: Año dinámico
// ============================================================================
const AnioDinamico = {
  init() {
    const s = document.getElementById('anio');
    if (s) s.textContent = new Date().getFullYear();
  }
};

// ============================================================================
// MÓDULO: Formulario de contacto
// ============================================================================
const ContactForm = (() => {
  const EMAIL = 'comercial@esenciaytaza.com';

  const mostrarError = (id, msg) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = '#e53e3e';
    let err = el.parentNode.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      el.parentNode.appendChild(err);
    }
    err.textContent = msg;
  };

  const limpiarErrores = () => {
    document.querySelectorAll('.field-error').forEach(e => e.remove());
    ['cf-nombre','cf-email','cf-mensaje'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.borderColor = '';
    });
  };

  const init = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      limpiarErrores();

      const nombre  = document.getElementById('cf-nombre')?.value.trim()  || '';
      const correo  = document.getElementById('cf-email')?.value.trim()   || '';
      const mensaje = document.getElementById('cf-mensaje')?.value.trim() || '';

      let valido = true;
      if (!nombre)  { mostrarError('cf-nombre',  'Por favor ingresa tu nombre.');          valido = false; }
      if (!correo)  { mostrarError('cf-email',   'Por favor ingresa tu correo.');          valido = false; }
      if (!mensaje) { mostrarError('cf-mensaje', 'Por favor escribe tu mensaje o pedido.'); valido = false; }
      if (!valido) return;

      const asunto = encodeURIComponent('Mensaje desde esenciaytaza.com');
      const cuerpo = encodeURIComponent(`Nombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`);
      const mailtoUrl = `mailto:${EMAIL}?subject=${asunto}&body=${cuerpo}`;

      const waTexto = encodeURIComponent(`Hola Esencia y Taza, soy ${nombre} (${correo}).\n\n${mensaje}`);
      const waUrl   = `https://wa.me/573022573244?text=${waTexto}`;

      // Abrir cliente de correo
      window.open(mailtoUrl, '_self');

      // Mostrar fallback WhatsApp inmediatamente
      const nota = form.querySelector('.form-nota');
      if (nota) {
        nota.innerHTML = `✓ Si no se abrió tu correo, <a href="${waUrl}" target="_blank" rel="noopener" class="nota-wa">envíanos el mensaje por WhatsApp</a>.`;
        nota.classList.add('form-nota--ok');
      }
    });
  };

  return { init };
})();

// ============================================================================
// APP INIT
// ============================================================================
const App = {
  init() {
    Products.render();
    Navigation.init();
    AnioDinamico.init();
    Cart.render();
    ContactForm.init();

    // Botones del carrito
    document.getElementById('cart-toggle')?.addEventListener('click', Cart.abrir);
    document.getElementById('cart-close')?.addEventListener('click', Cart.cerrar);
    document.getElementById('cart-overlay')?.addEventListener('click', Cart.cerrar);
    document.getElementById('cart-checkout')?.addEventListener('click', Cart.checkout);
    document.getElementById('cart-pagar')?.addEventListener('click', Cart.pagar);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}

// ── Banner de cookies ──────────────────────────────────────────────────────
(function () {
  const banner = document.getElementById('cookie-banner');
  const btn    = document.getElementById('cookie-aceptar');
  if (!banner || !btn) return;

  if (!localStorage.getItem('et_cookies_ok')) {
    banner.removeAttribute('hidden');
  }

  btn.addEventListener('click', () => {
    localStorage.setItem('et_cookies_ok', '1');
    banner.setAttribute('hidden', '');
  });
}());
