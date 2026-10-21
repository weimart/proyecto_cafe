/* ============================================================================
   ESENCIA Y TAZA — gracias.html
   Extraído a archivo externo para poder aplicar una CSP estricta (sin scripts
   inline). Muestra el resumen del pedido y consulta el estado real en Wompi.
   =========================================================================== */
(function () {
  const PEDIDOS_URL  = 'https://script.google.com/macros/s/AKfycbwVbUa59Zlb-pD5dsLEKqw4AnnKBQdvQI3YhVgRAl4ZUwEC-hxhzafSXsrcJIB2FwU/exec';
  const WHATSAPP     = '573022573244';
  const CLIENT_TOKEN = 'et_cli_v1_9f3a2b7c1d'; // debe coincidir con pedidos.gs / main.js

  const $ = (id) => document.getElementById(id);

  // Botón de impresión (antes era onclick inline)
  document.querySelector('.gr-btn-print')?.addEventListener('click', () => window.print());

  // Leer datos guardados antes del pago (con verificación de TTL)
  let pedido = null;
  try { pedido = JSON.parse(localStorage.getItem('et_pedido_pendiente') || 'null'); }
  catch (_) { pedido = null; }
  if (pedido && pedido._exp && Date.now() > pedido._exp) {
    localStorage.removeItem('et_pedido_pendiente');
    pedido = null;
  }

  // Leer params de Wompi en URL
  const params = new URLSearchParams(window.location.search);
  const txnId  = (params.get('id') || '').trim();
  const ref    = (params.get('ref') || (pedido && pedido.referencia) || '').trim();

  // Solo aceptamos IDs de transacción con forma conocida (evita inyectar en la ruta del fetch)
  const txnIdValido = /^[A-Za-z0-9_-]{1,64}$/.test(txnId);

  const esPago = txnIdValido;
  const esWA   = pedido && pedido.metodo === 'whatsapp';

  const statusEl = $('gr-status');
  const iconEl   = $('gr-icon');
  const tituloEl = $('gr-titulo');
  const subtitEl = $('gr-subtitulo');

  // El carrito (main.js) se vacía solo cuando el pedido quedó hecho: pago
  // aprobado o pedido por WhatsApp. Si el pago falla, el cliente lo conserva.
  const _vaciarCarrito = () => { try { localStorage.removeItem('et_carrito'); } catch (_) {} };

  const _pintarAprobado = () => {
    _vaciarCarrito();
    iconEl.textContent   = '✅';
    tituloEl.textContent = '¡Pedido confirmado!';
    subtitEl.textContent = 'Gracias por tu compra. Pronto nos pondremos en contacto contigo.';
  };
  const _pintarPendiente = () => {
    statusEl.style.background = '#E65100';
    iconEl.textContent   = '⏳';
    tituloEl.textContent = 'Pago en proceso';
    subtitEl.textContent = 'Tu pago está siendo verificado. Te avisaremos cuando se confirme.';
  };
  const _pintarRechazado = () => {
    statusEl.style.background = '#B71C1C';
    iconEl.textContent   = '❌';
    tituloEl.textContent = 'Pago no completado';
    subtitEl.textContent = 'El pago no pudo procesarse. Puedes intentar de nuevo o completar tu pedido por WhatsApp.';
  };
  const _pintarSinConfirmar = () => {
    statusEl.style.background = '#5C6BC0';
    iconEl.textContent   = '⏳';
    tituloEl.textContent = 'Pago recibido — pendiente de verificación';
    subtitEl.textContent = 'No pudimos confirmar el estado con Wompi en este momento. Te escribiremos apenas se valide.';
  };

  // Pintar estado inicial
  if (!esPago && !esWA) {
    statusEl.classList.add('pending');
    iconEl.textContent   = '⏳';
    tituloEl.textContent = 'Pedido en proceso';
    subtitEl.textContent = 'Completa el pago para confirmar tu pedido.';
  } else if (esWA) {
    _vaciarCarrito();
    statusEl.style.background = '#1565C0';
    iconEl.textContent   = '💬';
    tituloEl.textContent = '¡Pedido recibido por WhatsApp!';
    subtitEl.textContent = 'Te contactaremos para confirmar disponibilidad y envío.';
  } else {
    statusEl.style.background = '#5C6BC0';
    iconEl.textContent   = '⏳';
    tituloEl.textContent = 'Verificando pago…';
    subtitEl.textContent = 'Consultando el estado de tu transacción con Wompi.';

    fetch(`https://production.wompi.co/v1/transactions/${encodeURIComponent(txnId)}`)
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((data) => {
        const status = (data && data.data && data.data.status) || '';
        if (status === 'APPROVED') {
          statusEl.style.background = '';
          _pintarAprobado();
        } else if (status === 'PENDING') {
          _pintarPendiente();
        } else {
          _pintarRechazado();
        }
      })
      .catch(() => {
        // Si la API no responde NO afirmamos que el pago fue aprobado:
        // mostramos un estado neutro y dejamos que el vendedor lo verifique.
        _pintarSinConfirmar();
      });
  }

  // Rellenar datos del pedido
  if (pedido) {
    $('gr-ref').textContent      = pedido.idPedido || ref || '—';
    $('gr-fecha').textContent    = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
    $('gr-nombre').textContent   = pedido.nombre || '—';
    $('gr-telefono').textContent = pedido.telefono || '—';
    $('gr-ciudad').textContent   = `${pedido.ciudad || ''}, ${pedido.departamento || ''}`;
    $('gr-direccion').textContent = (pedido.direccion || '') + (pedido.complemento ? ', ' + pedido.complemento : '');
    $('gr-total').textContent    = '$' + (Number(pedido.total) || 0).toLocaleString('es-CO') + ' COP';

    // Productos — se construyen por DOM (sin innerHTML)
    const prodEl = $('gr-productos');
    (pedido.items || []).forEach((item) => {
      const d = document.createElement('div');
      d.className = 'gr-item';
      const precio = (Number(item.precio) || 0) * (Number(item.cantidad) || 0);
      d.appendChild(document.createTextNode(
        `${Number(item.cantidad) || 0}× Café Origen Caicedo ${item.tamano || ''} (${item.tipo || ''}) `
      ));
      const span = document.createElement('span');
      span.textContent = '$' + precio.toLocaleString('es-CO');
      d.appendChild(span);
      prodEl.appendChild(d);
    });
    if (pedido.envio != null) {
      const d = document.createElement('div');
      d.className = 'gr-item';
      d.appendChild(document.createTextNode('Envío '));
      const span = document.createElement('span');
      const envio = Number(pedido.envio) || 0;
      span.textContent = envio ? '$' + envio.toLocaleString('es-CO') : 'Gratis';
      d.appendChild(span);
      prodEl.appendChild(d);
    }

    // Factura
    if (pedido.factura) {
      $('gr-sec-factura').style.display = '';
      $('gr-doc').textContent   = `${pedido.tipoDoc || ''}: ${pedido.numeroDoc || ''}`;
      $('gr-email').textContent = pedido.email || '—';
      if (pedido.razonSocial) {
        $('gr-razon-row').style.display = '';
        $('gr-razon').textContent = pedido.razonSocial;
      }
    }

    // WhatsApp de seguimiento
    const msg = `Hola Esencia y Taza, realicé un pedido con referencia *${pedido.idPedido || ref}* y quiero hacer seguimiento. 🛒`;
    $('gr-btn-wa').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

    // Confirmar pago Wompi al Apps Script (fire & forget). El script verifica el
    // estado real contra la API de Wompi antes de marcar nada como PAGADO.
    if (esPago && PEDIDOS_URL && !PEDIDOS_URL.includes('__')) {
      const url = `${PEDIDOS_URL}?accion=confirmar_pago`
        + `&referencia=${encodeURIComponent(ref)}`
        + `&transaccionId=${encodeURIComponent(txnId)}`
        + `&token=${encodeURIComponent(CLIENT_TOKEN)}`;
      fetch(url, { mode: 'no-cors' }).catch(() => {});
    }

    setTimeout(() => localStorage.removeItem('et_pedido_pendiente'), 3000);
  } else {
    $('gr-ref').textContent = ref || 'Sin referencia';
    $('gr-btn-wa').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, necesito información sobre mi pedido.')}`;
  }
})();
