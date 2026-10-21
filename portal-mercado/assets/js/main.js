/* ============================================================================
   ESENCIA Y TAZA - MAIN.JS (versión de mercado)
   Productos dinámicos + carrito funcional (preparado para Wompi)
   =========================================================================== */

const WHATSAPP = '573022573244';

const PEDIDOS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwVbUa59Zlb-pD5dsLEKqw4AnnKBQdvQI3YhVgRAl4ZUwEC-hxhzafSXsrcJIB2FwU/exec';

// Token compartido con los Apps Script. NO es un secreto (viaja en este JS público);
// solo sirve para que los endpoints rechacen bots y peticiones directas triviales.
// Debe coincidir con CLIENT_TOKEN en pedidos.gs.
const CLIENT_TOKEN = 'et_cli_v1_9f3a2b7c1d';

// ── Utilidades de seguridad ──────────────────────────────────────────────────
// Escapa caracteres peligrosos antes de insertar texto en HTML.
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));
// Quita caracteres de control (incluye CR/LF, que permiten inyección de cabeceras en mailto:).
const limpiarTexto = (s, max) => String(s == null ? '' : s)
  .replace(/\p{Cc}+/gu, ' ')
  .trim()
  .slice(0, max || 500);

// El monto y la firma de integridad los calcula pedidos.gs (no el navegador).
const WOMPI = {
  publicKey  : 'pub_prod_i8kgq0AwhbR6ZGuKKrvH1Nh6Fq8EnXZn',
  currency   : 'COP'
};

// Envío. Aquí solo se usa para MOSTRARLO: el que se cobra lo calcula
// pedidos.gs (ENVIO). Si cambias la regla, cámbiala en los dos sitios.
const ENVIO = { tarifa: 12000, gratisDesde: 120000 };
const costoEnvio = (subtotal) => (subtotal >= ENVIO.gratisDesde ? 0 : ENVIO.tarifa);

// ── Catálogo: Café Origen Caicedo, presentaciones (grano o molido) ─────────
const PRESENTACIONES = [
  { id: '125g',  tamano: '125 g',  precio: 20000,
    desc: 'Ideal para descubrir el perfil de taza de Caicedo. Cuerpo alto, dulzor medio y acidez media, con tueste medio. Perfecto en espresso o prensa francesa.',
    tueste: 'Tueste medio', uso: 'Ideal para probar' },
  { id: '250g',  tamano: '250 g',  precio: 33000,
    desc: 'Para tu consumo diario de café en casa. Tueste medio que realza la dulzura natural del grano de altura, ideal para espresso, V60 o prensa francesa.',
    tueste: 'Tueste medio', uso: 'Consumo diario' },
  { id: '500g',  tamano: '500 g',  precio: 60000, destacado: true,
    desc: 'El favorito de nuestros clientes. Abastece el consumo semanal de tu hogar con granos seleccionados de Caicedo, tostados bajo pedido a precio justo.',
    tueste: 'Tueste medio', uso: 'Consumo semanal' },
  { id: '2500g', tamano: '2.5 kg', precio: 199999,
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
  };

  const cambiarCantidad = (key, delta) => {
    const it = items.find(i => i.key === key);
    if (!it) return;
    it.cantidad += delta;
    if (it.cantidad <= 0) items = items.filter(i => i.key !== key);
    render();
  };

  const subtotal = () => items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const envio    = () => (items.length ? costoEnvio(subtotal()) : 0);
  const total    = () => subtotal() + envio();
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
      const envioVacio = document.getElementById('cart-envio');
      if (envioVacio) envioVacio.textContent = '—';
      document.getElementById('cart-checkout')?.setAttribute('disabled', 'true');
      document.getElementById('cart-pagar')?.setAttribute('disabled', 'true');
      return;
    }

    cont.innerHTML = items.map(i => `
      <div class="cart-item">
        <div class="cart-item-info">
          <strong>${esc(i.nombre)}</strong>
          <span>${esc(i.tamano)} · ${esc(i.tipo)}</span>
          <span class="cart-item-precio">${formatoCOP(i.precio)} c/u</span>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-key="${esc(i.key)}" data-delta="-1">−</button>
          <span>${Number(i.cantidad) || 0}</span>
          <button class="qty-btn" data-key="${esc(i.key)}" data-delta="1">+</button>
        </div>
      </div>
    `).join('');

    const envioEl = document.getElementById('cart-envio');
    if (envioEl) {
      const e = envio();
      envioEl.textContent = e ? formatoCOP(e) : 'Gratis';
    }
    if (totalEl) totalEl.textContent = formatoCOP(total());
    document.getElementById('cart-checkout')?.removeAttribute('disabled');
    document.getElementById('cart-pagar')?.removeAttribute('disabled');

    cont.querySelectorAll('.qty-btn').forEach(b => {
      b.addEventListener('click', () =>
        cambiarCantidad(b.getAttribute('data-key'), parseInt(b.getAttribute('data-delta'))));
    });
  };

  const vaciar = () => {
    if (items.length === 0) return;
    items = [];
    render();
  };

  return { add, abrir, cerrar, render, vaciar,
           subtotalActual: subtotal,
           envioActual: envio,
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
        <div class="product-visual">
          <img src="./assets/images/product-${p.id}.jpg"
               alt="Café Origen Caicedo ${p.tamano} — Esencia y Taza"
               class="product-visual-img"
               loading="lazy" decoding="async" width="400" height="220">
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
                    data-tamano="${p.tamano}">
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
        const tipo = card.dataset.tipo || 'En grano';
        // Precio siempre desde PRESENTACIONES (fuente autoritativa), no desde el DOM
        const pres = PRESENTACIONES.find(p => p.tamano === tamano);
        if (!pres) return;
        Cart.add(tamano, tipo, pres.precio);
        CartToast.show(`Café ${tamano}`);
        btn.textContent = '✓ Añadido';
        setTimeout(() => { btn.textContent = '+ Añadir'; }, 1500);
      });
    });
  };

  return { render };
})();

// ============================================================================
// MÓDULO: CartToast — notificación al añadir al carrito
// ============================================================================
const CartToast = (() => {
  let timer;

  const _crear = () => {
    const t = document.createElement('div');
    t.id = 'cart-toast';
    t.className = 'cart-toast';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    t.innerHTML = `
      <div class="ct-info">
        <span class="ct-check" aria-hidden="true">✓</span>
        <span class="ct-msg"></span>
      </div>
      <div class="ct-actions">
        <button class="ct-seguir">Seguir comprando</button>
        <button class="ct-ver">Ver carrito →</button>
      </div>`;
    document.body.appendChild(t);
    t.querySelector('.ct-seguir').addEventListener('click', hide);
    t.querySelector('.ct-ver').addEventListener('click', () => { hide(); Cart.abrir(); });
    return t;
  };

  const show = (nombre) => {
    const t = document.getElementById('cart-toast') || _crear();
    t.querySelector('.ct-msg').textContent = `${nombre} añadido al carrito`;
    t.classList.add('cart-toast--visible');
    clearTimeout(timer);
    timer = setTimeout(hide, 4500);
  };

  const hide = () => {
    clearTimeout(timer);
    document.getElementById('cart-toast')?.classList.remove('cart-toast--visible');
  };

  return { show, hide };
})();

// ============================================================================
// MÓDULO: Navegación
// ============================================================================
const Navigation = (() => {
  const _cerrarMovil = () => {
    const menu = document.getElementById('nav-mobile-menu');
    const btn  = document.getElementById('nav-hamburger');
    menu?.setAttribute('hidden', '');
    btn?.classList.remove('is-open');
    btn?.setAttribute('aria-expanded', 'false');
  };

  const init = () => {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) header?.classList.add('sticky');
      else header?.classList.remove('sticky');
    }, { passive: true });

    // Hamburguesa
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('nav-mobile-menu');
    const _abrirMovil = () => {
      // Posicionar el drawer exactamente debajo del header real
      const headerH = document.querySelector('.header')?.offsetHeight || 60;
      mobileMenu.style.top = headerH + 'px';
      mobileMenu.removeAttribute('hidden');
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
    };

    hamburger?.addEventListener('click', () => {
      const isOpen = !mobileMenu.hasAttribute('hidden');
      if (isOpen) _cerrarMovil();
      else _abrirMovil();
    });

    // Cerrar menú móvil al pulsar cualquier enlace dentro
    mobileMenu?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', _cerrarMovil);
    });

    // Cerrar menú móvil al hacer scroll
    window.addEventListener('scroll', () => {
      if (!mobileMenu?.hasAttribute('hidden')) _cerrarMovil();
    }, { passive: true });

    // IntersectionObserver: resalta el link activo al scrollear
    const navLinks = document.querySelectorAll('.navbar-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    if (sections.length && navLinks.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('navbar-link--active'));
            const active = document.querySelector(`.navbar-link[href="#${entry.target.id}"]`);
            active?.classList.add('navbar-link--active');
          }
        });
      }, { threshold: 0.35, rootMargin: '-60px 0px -35% 0px' });
      sections.forEach(s => observer.observe(s));
    }

    // Click en link del nav desktop también cierra el menú móvil
    document.querySelectorAll('.navbar-link').forEach(link => {
      link.addEventListener('click', () => {
        document.querySelectorAll('.navbar-link').forEach(l => l.classList.remove('navbar-link--active'));
        link.classList.add('navbar-link--active');
        _cerrarMovil();
      });
    });
  };
  return { init, cerrarMovil: _cerrarMovil };
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

      // Límites de longitud + saneo de caracteres de control (evita URLs gigantes
      // y la inyección de cabeceras vía CR/LF en el enlace mailto:).
      const nombre  = limpiarTexto(document.getElementById('cf-nombre')?.value,  100);
      const correo  = limpiarTexto(document.getElementById('cf-email')?.value,   120);
      const mensaje = limpiarTexto(document.getElementById('cf-mensaje')?.value, 2000);

      let valido = true;
      if (!nombre)  { mostrarError('cf-nombre',  'Por favor ingresa tu nombre.');          valido = false; }
      if (!correo)  { mostrarError('cf-email',   'Por favor ingresa tu correo.');          valido = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        mostrarError('cf-email', 'Ingresa un correo válido.'); valido = false;
      }
      if (!mensaje) { mostrarError('cf-mensaje', 'Por favor escribe tu mensaje o pedido.'); valido = false; }
      if (!valido) return;

      const asunto = encodeURIComponent('Mensaje desde esenciaytaza.com');
      const cuerpo = encodeURIComponent(`Nombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`);
      const mailtoUrl = `mailto:${EMAIL}?subject=${asunto}&body=${cuerpo}`;

      const waTexto = encodeURIComponent(`Hola Esencia y Taza, soy ${nombre} (${correo}).\n\n${mensaje}`);
      const waUrl   = `https://wa.me/573022573244?text=${waTexto}`;

      // Abrir cliente de correo
      window.open(mailtoUrl, '_self');

      // Mostrar fallback WhatsApp inmediatamente — se construye por DOM (sin innerHTML)
      // para que ningún dato del formulario pueda alterar el marcado.
      const nota = form.querySelector('.form-nota');
      if (nota) {
        nota.textContent = '✓ Si no se abrió tu correo, ';
        const a = document.createElement('a');
        a.href = waUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'nota-wa';
        a.textContent = 'envíanos el mensaje por WhatsApp';
        nota.appendChild(a);
        nota.appendChild(document.createTextNode('.'));
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

    setTimeout(() => {
      // Cargar imagen justo antes de mostrar (evita descarga al inicio de página)
      const img = overlay.querySelector('img[data-src]');
      if (img) { img.src = img.dataset.src; }
      overlay.removeAttribute('hidden');
    }, 1200);

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
    const envio = Cart.envioActual ? Cart.envioActual() : 0;
    if (el) el.textContent = '$' + total.toLocaleString('es-CO') + ' COP'
      + (envio ? ` (incluye envío ${formatoCOP(envio)})` : ' (envío gratis)');
    overlay.removeAttribute('hidden');
    overlay.querySelector('#co-nombre')?.focus();
    Cart.cerrar();
  };

  const cerrar = () => {
    document.getElementById('checkout-overlay')?.setAttribute('hidden', '');
  };

  // Pedido por WhatsApp: no esperamos respuesta. keepalive evita que el
  // navegador corte el envío al pasar a gracias.html.
  const _guardarEnScript = (payload) => {
    if (!PEDIDOS_SCRIPT_URL) return;
    fetch(PEDIDOS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...payload, token: CLIENT_TOKEN })
    }).catch(() => {});
  };

  // Pago en línea: registra el pedido y espera el monto y la firma que calcula
  // el servidor. text/plain evita la petición previa (preflight) de CORS, que
  // Apps Script no admite.
  const _registrarParaPago = async (payload) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch(PEDIDOS_SCRIPT_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...payload, token: CLIENT_TOKEN }),
        signal: controller.signal
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      if (!json.ok || !json.firma || !json.montoEnCentavos) throw new Error(json.error || 'Respuesta incompleta');
      return json;
    } finally {
      clearTimeout(timeout);
    }
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
      const envio = Cart.envioActual ? Cart.envioActual() : 0;
      const lineaEnvio = `• Envío — ${envio ? formatoCOP(envio) : 'gratis'}`;

      const referencia = 'ET-' + Date.now() + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
      const idPedido   = referencia;

      const pedido = {
        accion      : 'nuevo_pedido',
        idPedido,
        referencia,
        metodo      : _metodo,
        productos   : lineasProducto + '\n' + lineaEnvio,
        envio,
        total,       // solo para mostrar; el servidor recalcula el que se cobra
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

      // Guardar en localStorage para gracias.html (se borra tras 30 min)
      const guardarLocal = () => {
        try {
          const payload = { ...pedido, _exp: Date.now() + 30 * 60 * 1000 };
          localStorage.setItem('et_pedido_pendiente', JSON.stringify(payload));
        } catch (_) { /* sin almacenamiento: gracias.html muestra lo básico */ }
      };

      if (_metodo === 'whatsapp') {
        guardarLocal();
        _guardarEnScript(pedido);
        cerrar();
        let msg = `Hola Esencia y Taza, quiero hacer este pedido:\n\n${lineasProducto}\n${lineaEnvio}\n\n*Total: $${total.toLocaleString('es-CO')} COP*\n\n`;
        msg += `📦 *Envío a:* ${pedido.ciudad}, ${pedido.departamento}\n${pedido.direccion}${pedido.complemento ? ', ' + pedido.complemento : ''}\n`;
        msg += `👤 *Nombre:* ${pedido.nombre}\n📱 *Tel:* ${pedido.telefono}\n`;
        if (pedido.factura) msg += `🧾 *Factura:* ${pedido.tipoDoc} ${pedido.numeroDoc}${pedido.razonSocial ? ' — ' + pedido.razonSocial : ''}\n`;
        msg += `\n¿Me confirman disponibilidad?`;
        // Redirigir a gracias.html y abrir WhatsApp
        const graciasUrl = new URL('gracias.html', window.location.href).href;
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
        window.location.href = graciasUrl;
      } else {
        // Pago Wompi
        await _pagarWompi(pedido, guardarLocal);
      }
    });
  };

  const _validar = (form) => {
    let ok = true;
    form.querySelectorAll('[required]').forEach(el => {
      el.classList.remove('error');
      if (!el.value.trim()) { el.classList.add('error'); ok = false; }
    });
    // Validar formato de email
    const emailEl = document.getElementById('co-email');
    if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      emailEl.classList.add('error'); ok = false;
    }
    // Validar formato de teléfono (mínimo 7 dígitos)
    const telEl = document.getElementById('co-tel');
    if (telEl && telEl.value.trim() && !/^\+?[\d\s\-()]{7,15}$/.test(telEl.value.trim())) {
      telEl.classList.add('error'); ok = false;
    }
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

  const _pagarWompi = async (pedido, guardarLocal) => {
    const btnPagar = document.getElementById('co-btn-pagar');
    const textoOrig = btnPagar ? btnPagar.innerHTML : '';
    if (btnPagar) { btnPagar.disabled = true; btnPagar.textContent = 'Preparando pago seguro…'; }

    let resp;
    try {
      resp = await _registrarParaPago(pedido);
    } catch (e) {
      console.error('[Wompi] No se pudo registrar el pedido:', e.message);
      if (btnPagar) { btnPagar.disabled = false; btnPagar.innerHTML = textoOrig; }
      const seguir = confirm(
        'No pudimos iniciar el pago en línea en este momento.\n\n' +
        '¿Quieres completar tu pedido por WhatsApp? Te enviamos el link de pago seguro.'
      );
      if (seguir) _enviarWhatsApp(pedido);
      return;
    }

    // El total que se muestra en gracias.html es el que cobró el servidor.
    pedido.total = Number(resp.total) || pedido.total;
    guardarLocal();
    cerrar();

    const telefono = pedido.telefono.replace(/[^\d]/g, '').slice(-10);
    const params = new URLSearchParams({
      'public-key'                     : WOMPI.publicKey,
      'currency'                       : WOMPI.currency,
      'amount-in-cents'                : resp.montoEnCentavos,
      'reference'                      : resp.referencia,
      'signature:integrity'            : resp.firma,
      'redirect-url'                   : new URL('gracias.html', window.location.href).href,
      'customer-data:email'            : pedido.email,
      'customer-data:full-name'        : pedido.nombre,
      'customer-data:phone-number'     : telefono,
      'shipping-address:address-line-1': pedido.direccion,
      'shipping-address:city'          : pedido.ciudad,
      'shipping-address:region'        : pedido.departamento,
      'shipping-address:country'       : 'CO',
      'shipping-address:phone-number'  : telefono,
    });
    window.location.href = 'https://checkout.wompi.co/p/?' + params.toString();
  };

  // Envía el pedido por WhatsApp (usado como fallback si el pago en línea falla)
  const _enviarWhatsApp = (pedido) => {
    let msg = `Hola Esencia y Taza, quiero hacer este pedido:\n\n`;
    msg += `${pedido.productos || ''}\n\n`;
    msg += `*Total: $${(pedido.total || 0).toLocaleString('es-CO')} COP*\n\n`;
    msg += `📦 *Envío a:* ${pedido.ciudad || ''}, ${pedido.departamento || ''}\n${pedido.direccion || ''}\n`;
    msg += `👤 *Nombre:* ${pedido.nombre || ''}\n📱 *Tel:* ${pedido.telefono || ''}\n`;
    msg += `\n¿Me confirman disponibilidad?`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
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
    // Popup.init(); // desactivado temporalmente — pendiente rediseño
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

// ── Newsletter → WhatsApp ─────────────────────────────────────────────────
(function () {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre   = limpiarTexto(document.getElementById('nl-nombre')?.value, 80);
    const telefono = limpiarTexto(document.getElementById('nl-telefono')?.value, 20).replace(/[^\d+]/g, '');
    if (!nombre || !telefono) {
      alert('Por favor completa tu nombre y número de WhatsApp.');
      return;
    }
    if (!/^\+?\d{7,15}$/.test(telefono)) {
      alert('Ingresa un número de WhatsApp válido (7 a 15 dígitos).');
      return;
    }
    const msg = `Hola Esencia y Taza, soy *${nombre}* (${telefono}) y me gustaría recibir novedades sobre sus cafés por WhatsApp. ☕`;
    window.open(`https://wa.me/573022573244?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    form.reset();
  });
}());

// ── Tecla ESC cierra modales ──────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  Cart.cerrar();
  document.getElementById('checkout-overlay')?.setAttribute('hidden', '');
  document.getElementById('popup-overlay')?.setAttribute('hidden', '');
  Navigation.cerrarMovil?.();
});

// ── Botón scroll-to-top ───────────────────────────────────────────────────
(function () {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) btn.removeAttribute('hidden');
    else btn.setAttribute('hidden', '');
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}());

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
