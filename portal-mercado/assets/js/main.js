/* ============================================================================
   ESENCIA Y TAZA - MAIN.JS (versión de mercado)
   Productos dinámicos + carrito funcional (preparado para Wompi)
   =========================================================================== */

const WHATSAPP = '573022573244';

const PEDIDOS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwVbUa59Zlb-pD5dsLEKqw4AnnKBQdvQI3YhVgRAl4ZUwEC-hxhzafSXsrcJIB2FwU/exec';

const WOMPI = {
  publicKey  : 'pub_prod_i8kgq0AwhbR6ZGuKKrvH1Nh6Fq8EnXZn',
  currency   : 'COP',
  activo     : true,
  redirectUrl: 'https://esenciaytaza.com/',
  scriptUrl  : 'https://script.google.com/macros/s/AKfycbxNxiFXnLsuD_K8g4p9xagimfgm8pC5DXvaRpqxTHNIIgUx78gWmKwrRFLMYbRaxjip/exec'
};

// ── Catálogo: Café Origen Caicedo, presentaciones (grano o molido) ─────────
const PRESENTACIONES = [
  { id: '125g',  tamano: '125 g',  precio: 20000,
    desc: 'Ideal para descubrir el perfil de taza de Caicedo. Notas de chocolate oscuro y caramelo con tueste medio, perfecto en espresso o prensa francesa.',
    tueste: 'Tueste medio', uso: 'Ideal para probar' },
  { id: '250g',  tamano: '250 g',  precio: 33000,
    desc: 'Para quienes ya disfrutan de nuestro origen. Tueste medio que realza la dulzura natural del grano de altura, perfecto para consumo semanal.',
    tueste: 'Tueste medio', uso: 'Consumo semanal' },
  { id: '500g',  tamano: '500 g',  precio: 60000, destacado: true,
    desc: 'El favorito de nuestros clientes. Abastece el consumo diario de tu hogar por más de un mes. Granos seleccionados de Caicedo, tostados bajo pedido.',
    tueste: 'Tueste medio', uso: 'Consumo diario en casa' },
  { id: '2500g', tamano: '2.5 kg', precio: 180000,
    desc: 'Para cafeterías, restaurantes y familias grandes. Lote artesanal tostado bajo pedido con precio mayorista y la misma calidad de origen Caicedo.',
    tueste: 'Tueste medio', uso: 'Negocios y cafeterías' }
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

    // Basurero: visible solo cuando hay items
    const btnVaciar = document.getElementById('cart-vaciar');
    if (btnVaciar) {
      if (items.length === 0) btnVaciar.setAttribute('hidden', '');
      else btnVaciar.removeAttribute('hidden');
    }

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

  const checkoutWompi = async () => {
    const referencia      = 'ET-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    const montoEnCentavos = String(total() * 100);

    const btnPagar   = document.getElementById('cart-pagar');
    const textoOrig  = btnPagar ? btnPagar.innerHTML : '';
    if (btnPagar) { btnPagar.disabled = true; btnPagar.textContent = 'Generando pago…'; }

    // redirect-url fijo para producción (evita exponer localhost a Wompi)
    const redirectUrl = WOMPI.redirectUrl || (window.location.origin + window.location.pathname);

    const irAWompi = (signature) => {
      const params = new URLSearchParams({
        'public-key'      : WOMPI.publicKey,
        'currency'        : WOMPI.currency,
        'amount-in-cents' : montoEnCentavos,
        'reference'       : referencia,
        'redirect-url'    : redirectUrl,
      });
      if (signature) params.set('signature:integrity', signature);
      window.location.href = 'https://checkout.wompi.co/p/?' + params.toString();
    };

    if (WOMPI.scriptUrl) {
      try {
        const url = `${WOMPI.scriptUrl}?ref=${encodeURIComponent(referencia)}&amount=${montoEnCentavos}&cur=COP`;
        const res  = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!data.signature) throw new Error('Sin firma en respuesta');
        irAWompi(data.signature);
      } catch (e) {
        console.error('[Wompi] Error al obtener firma:', e.message);
        if (btnPagar) { btnPagar.disabled = false; btnPagar.innerHTML = textoOrig; }
        const seguir = confirm('No se pudo iniciar el pago seguro.\n¿Completar pedido por WhatsApp?');
        if (seguir) checkoutWhatsApp();
      }
    } else {
      irAWompi(null);
    }
  };

  const vaciar = () => {
    if (items.length === 0) return;
    items = [];
    render();
  };

  return { add, abrir, cerrar, render, checkout, pagar, vaciar,
           totalActual: total,
           itemsActuales: () => [...items] };
})();

// ============================================================================
// MÓDULO: Productos (tarjetas dinámicas con placeholder visual)
// ============================================================================
const Products = (() => {
  const render = () => {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = PRESENTACIONES.map(p => `
      <article class="product-card${p.destacado ? ' product-card--destacado' : ''}" data-tipo="En grano">
        <div class="product-visual product-visual--${p.id}">
          <span class="product-visual-tamano" aria-hidden="true">${p.tamano}</span>
          ${p.destacado ? '<span class="product-flag">⭐ Más pedido</span>' : ''}
        </div>
        <div class="product-body">
          <p class="product-origin">Caicedo · Antioquia</p>
          <h3 class="product-title">Café Origen Caicedo ${p.tamano}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-tags">
            <span class="product-tag">${p.tueste}</span>
            <span class="product-tag product-tag--uso">${p.uso}</span>
          </div>
          <div class="product-tipo-group" role="group" aria-label="Tipo de molienda">
            <button class="tipo-pill tipo-pill--active" data-tipo="En grano">En grano</button>
            <button class="tipo-pill" data-tipo="Molido">Molido</button>
          </div>
          <div class="product-action">
            <div class="product-pricing">
              <span class="product-price">${formatoCOP(p.precio)}</span>
              <span class="product-size-label">${p.tamano}</span>
            </div>
            <button class="btn-add-card"
                    data-tamano="${p.tamano}"
                    data-precio="${p.precio}">
              + Añadir
            </button>
          </div>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.tipo-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const card = pill.closest('.product-card');
        card.querySelectorAll('.tipo-pill').forEach(p => p.classList.remove('tipo-pill--active'));
        pill.classList.add('tipo-pill--active');
        card.dataset.tipo = pill.dataset.tipo;
      });
    });

    grid.querySelectorAll('.btn-add-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        const tamano = btn.getAttribute('data-tamano');
        const precio = parseInt(btn.getAttribute('data-precio'));
        const tipo = card.dataset.tipo || 'En grano';
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
// MÓDULO: Popup bienvenida
// ============================================================================
const Popup = (() => {
  const init = () => {
    const overlay = document.getElementById('popup-overlay');
    const btnClose = document.getElementById('popup-close');
    const btnCta   = document.getElementById('popup-cta');
    if (!overlay) return;

    if (sessionStorage.getItem('et_popup_ok')) return;

    setTimeout(() => { overlay.removeAttribute('hidden'); }, 1200);

    const cerrar = () => {
      overlay.setAttribute('hidden', '');
      sessionStorage.setItem('et_popup_ok', '1');
    };

    btnClose?.addEventListener('click', cerrar);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
    btnCta?.addEventListener('click', cerrar);
  };
  return { init };
})();

// ============================================================================
// MÓDULO: Checkout — formulario de envío + factura
// ============================================================================
const Checkout = (() => {
  let _metodo = 'wompi'; // 'wompi' | 'whatsapp'

  const abrir = (metodo) => {
    _metodo = metodo || 'wompi';
    const overlay = document.getElementById('checkout-overlay');
    if (!overlay) return;
    // Actualizar total visible
    const total = Cart.totalActual ? Cart.totalActual() : 0;
    const el = document.getElementById('co-total-resumen');
    if (el) el.textContent = '$' + total.toLocaleString('es-CO') + ' COP';
    overlay.removeAttribute('hidden');
    overlay.querySelector('#co-nombre')?.focus();
    Cart.cerrar();
  };

  const cerrar = () => {
    document.getElementById('checkout-overlay')?.setAttribute('hidden', '');
  };

  const _guardarEnScript = (payload) => {
    if (!PEDIDOS_SCRIPT_URL) return;
    fetch(PEDIDOS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  };

  const init = () => {
    const overlay = document.getElementById('checkout-overlay');
    const form    = document.getElementById('co-form');
    if (!overlay || !form) return;

    // Cerrar modal
    document.getElementById('co-close')?.addEventListener('click', cerrar);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });

    // Toggle factura
    const chkFactura  = document.getElementById('co-req-factura');
    const factFields  = document.getElementById('co-factura-fields');
    const tipoDocSel  = document.getElementById('co-tipo-doc');
    const razonField  = document.getElementById('co-razon-field');
    chkFactura?.addEventListener('change', () => {
      factFields.hidden = !chkFactura.checked;
    });
    tipoDocSel?.addEventListener('change', () => {
      razonField.hidden = tipoDocSel.value !== 'NIT';
    });

    // Determinar qué botón se pulsó
    form.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-metodo]');
      if (btn) _metodo = btn.dataset.metodo;
    });

    // Envío del formulario
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!_validar(form)) return;

      const data = new FormData(form);
      const items = Cart.itemsActuales ? Cart.itemsActuales() : [];
      const total = Cart.totalActual  ? Cart.totalActual()  : 0;

      const lineasProducto = items.map(i =>
        `• ${i.cantidad}x Café Origen Caicedo ${i.tamano} (${i.tipo}) — $${(i.precio * i.cantidad).toLocaleString('es-CO')}`
      ).join('\n');

      const referencia = 'ET-' + Date.now() + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
      const idPedido   = referencia;

      const pedido = {
        accion      : 'nuevo_pedido',
        idPedido,
        referencia,
        metodo      : _metodo,
        productos   : lineasProducto,
        total,
        items,
        nombre      : data.get('nombre').trim(),
        email       : data.get('email').trim(),
        telefono    : data.get('telefono').trim(),
        departamento: data.get('departamento'),
        ciudad      : data.get('ciudad').trim(),
        direccion   : data.get('direccion').trim(),
        complemento : data.get('complemento').trim(),
        factura     : chkFactura.checked,
        tipoDoc     : data.get('tipoDoc') || '',
        numeroDoc   : data.get('numeroDoc').trim(),
        razonSocial : data.get('razonSocial')?.trim() || '',
      };

      // Guardar en localStorage para gracias.html
      localStorage.setItem('et_pedido_pendiente', JSON.stringify(pedido));

      // Enviar a Google Sheets (async, no bloqueante)
      _guardarEnScript(pedido);

      cerrar();

      if (_metodo === 'whatsapp') {
        let msg = `Hola Esencia y Taza, quiero hacer este pedido:\n\n${lineasProducto}\n\n*Total: $${total.toLocaleString('es-CO')} COP*\n\n`;
        msg += `📦 *Envío a:* ${pedido.ciudad}, ${pedido.departamento}\n${pedido.direccion}${pedido.complemento ? ', ' + pedido.complemento : ''}\n`;
        msg += `👤 *Nombre:* ${pedido.nombre}\n📱 *Tel:* ${pedido.telefono}\n`;
        if (pedido.factura) msg += `🧾 *Factura:* ${pedido.tipoDoc} ${pedido.numeroDoc}${pedido.razonSocial ? ' — ' + pedido.razonSocial : ''}\n`;
        msg += `\n¿Me confirman disponibilidad y costo de envío?`;
        // Redirigir a gracias.html y abrir WhatsApp
        const graciasUrl = new URL('gracias.html', window.location.href).href;
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
        window.location.href = graciasUrl;
      } else {
        // Pago Wompi
        await _pagarWompi(pedido);
      }
    });
  };

  const _validar = (form) => {
    let ok = true;
    form.querySelectorAll('[required]').forEach(el => {
      el.classList.remove('error');
      if (!el.value.trim()) { el.classList.add('error'); ok = false; }
    });
    // Campos de factura requeridos si está activo
    const chk = document.getElementById('co-req-factura');
    if (chk?.checked) {
      ['co-tipo-doc','co-num-doc'].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) { el.classList.add('error'); ok = false; }
      });
      const tipoDoc = document.getElementById('co-tipo-doc');
      const razon   = document.getElementById('co-razon');
      if (tipoDoc?.value === 'NIT' && razon && !razon.value.trim()) {
        razon.classList.add('error'); ok = false;
      }
    }
    if (!ok) form.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return ok;
  };

  const _pagarWompi = async (pedido) => {
    const montoEnCentavos = String(pedido.total * 100);
    const redirectUrl = new URL('gracias.html', window.location.href).href;

    const irAWompi = (signature) => {
      const params = new URLSearchParams({
        'public-key'       : WOMPI.publicKey,
        'currency'         : WOMPI.currency,
        'amount-in-cents'  : montoEnCentavos,
        'reference'        : pedido.referencia,
        'redirect-url'     : redirectUrl,
        'customer-data:email'      : pedido.email,
        'customer-data:full-name'  : pedido.nombre,
        'customer-data:phone-number': pedido.telefono.replace(/\s/g,''),
        'shipping-address:address-line-1': pedido.direccion,
        'shipping-address:city'    : pedido.ciudad,
        'shipping-address:country' : 'CO',
      });
      if (signature) params.set('signature:integrity', signature);
      window.location.href = 'https://checkout.wompi.co/p/?' + params.toString();
    };

    if (WOMPI.scriptUrl) {
      try {
        const url  = `${WOMPI.scriptUrl}?ref=${encodeURIComponent(pedido.referencia)}&amount=${montoEnCentavos}&cur=COP`;
        const res  = await fetch(url);
        const json = await res.json();
        irAWompi(json.signature || null);
      } catch {
        irAWompi(null);
      }
    } else {
      irAWompi(null);
    }
  };

  return { init, abrir };
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
    Popup.init();
    Checkout.init();

    // Botones del carrito → abren el modal de checkout
    document.getElementById('cart-toggle')?.addEventListener('click', Cart.abrir);
    document.getElementById('cart-close')?.addEventListener('click', Cart.cerrar);
    document.getElementById('cart-overlay')?.addEventListener('click', Cart.cerrar);
    document.getElementById('cart-vaciar')?.addEventListener('click', Cart.vaciar);
    document.getElementById('cart-checkout')?.addEventListener('click', () => Checkout.abrir('whatsapp'));
    document.getElementById('cart-pagar')?.addEventListener('click',    () => Checkout.abrir('wompi'));
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}

// ── Barra de anuncio Wompi ────────────────────────────────────────────────
(function () {
  const bar = document.getElementById('announcement-bar');
  const btn = document.getElementById('close-announcement');
  if (!bar || !btn) return;
  if (sessionStorage.getItem('et_announcement_closed')) {
    bar.classList.add('hidden');
  }
  btn.addEventListener('click', () => {
    bar.classList.add('hidden');
    sessionStorage.setItem('et_announcement_closed', '1');
  });
}());

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
