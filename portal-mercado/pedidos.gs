/* ============================================================================
   ESENCIA Y TAZA — Apps Script: Pedidos & Clientes
   Despliega como: Aplicación web → Ejecutar como: Yo → Acceso: Cualquier usuario
   =========================================================================== */

const SHEET_PEDIDOS  = '1hyx7y9qdXwfiXFlLsm4hcCCiBUm_tH3xzwvZ7uRBR4Y';
const SHEET_CLIENTES = '1brrITidrtD78AbLOagFTVLQ47KXqNzq7Bk1WflGDjBE';
const EMAIL_VENDEDOR = 'comercial@esenciaytaza.com';
const WHATSAPP_VENDEDOR = '573022573244';

// Debe coincidir con CLIENT_TOKEN en main.js / gracias.js. NO es un secreto
// (viaja en el JS público); solo filtra bots y llamadas directas triviales.
const CLIENT_TOKEN = 'et_cli_v1_9f3a2b7c1d';

// API pública de Wompi para verificar el estado real de una transacción.
const WOMPI_API = 'https://production.wompi.co/v1/transactions/';

// Límites anti-abuso
const MAX_PEDIDOS_POR_MINUTO = 8;   // global
const COOLDOWN_EMAIL_SEG     = 45;  // un mismo correo no puede repetir pedido tan seguido
const TOTAL_MAX_COP          = 5000000;
const MAX_ITEMS              = 30;

// Ejecuta esta función desde el editor para autorizar permisos (solo 1 vez)
function _autorizar() {
  const ss = SpreadsheetApp.openById(SHEET_PEDIDOS);
  Logger.log('✅ Sheet pedidos OK: ' + ss.getName());
  const ss2 = SpreadsheetApp.openById(SHEET_CLIENTES);
  Logger.log('✅ Sheet clientes OK: ' + ss2.getName());
  UrlFetchApp.fetch('https://production.wompi.co/v1/merchants/x', { muteHttpExceptions: true });
  Logger.log('✅ Permiso UrlFetch OK (verificación de pagos Wompi)');
  MailApp.sendEmail({
    to: EMAIL_VENDEDOR,
    subject: '✅ Esencia y Taza — Script de pedidos autorizado',
    body: 'El script de pedidos quedó correctamente autorizado. Ya puede recibir pedidos en línea.'
  });
  Logger.log('🎉 Autorización completa. El web app está listo.');
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Utilidades de seguridad ─────────────────────────────────────────────────
function _esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// Texto plano: quita caracteres de control y recorta longitud.
function _limpiar(v, max) {
  return String(v == null ? '' : v)
    .replace(/\p{Cc}+/gu, ' ')
    .trim()
    .slice(0, max || 300);
}
function _esEmail(v) {
  return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(v);
}

// Rechaza (y sanea) un pedido mal formado. Devuelve el objeto saneado o lanza Error.
function _validarPedido(d) {
  if (!d || typeof d !== 'object') throw new Error('Pedido inválido');

  const nombre   = _limpiar(d.nombre, 100);
  const email    = _limpiar(d.email, 120).toLowerCase();
  const telefono = _limpiar(d.telefono, 25).replace(/[^\d+\s()-]/g, '');
  const total    = Number(d.total);

  if (nombre.length < 2)        throw new Error('Nombre inválido');
  if (!_esEmail(email))         throw new Error('Correo inválido');
  if (telefono.replace(/\D/g, '').length < 7) throw new Error('Teléfono inválido');
  if (!isFinite(total) || total <= 0 || total > TOTAL_MAX_COP) throw new Error('Total inválido');

  let items = Array.isArray(d.items) ? d.items.slice(0, MAX_ITEMS) : [];
  items = items.map(function (i) {
    return {
      nombre:   _limpiar(i && i.nombre, 80),
      tamano:   _limpiar(i && i.tamano, 20),
      tipo:     _limpiar(i && i.tipo, 20),
      precio:   Math.max(0, Number(i && i.precio) || 0),
      cantidad: Math.max(0, Math.min(999, parseInt(i && i.cantidad, 10) || 0))
    };
  });

  return {
    accion:       'nuevo_pedido',
    idPedido:     _limpiar(d.idPedido, 40).replace(/[^A-Za-z0-9_-]/g, '') || ('ET-' + Date.now()),
    referencia:   _limpiar(d.referencia, 40).replace(/[^A-Za-z0-9_-]/g, ''),
    metodo:       d.metodo === 'wompi' ? 'wompi' : 'whatsapp',
    productos:    _limpiar(d.productos, 1500),
    total:        Math.round(total),
    items:        items,
    nombre:       nombre,
    email:        email,
    telefono:     telefono,
    departamento: _limpiar(d.departamento, 60),
    ciudad:       _limpiar(d.ciudad, 60),
    direccion:    _limpiar(d.direccion, 200),
    complemento:  _limpiar(d.complemento, 120),
    factura:      d.factura === true || d.factura === 'true',
    tipoDoc:      _limpiar(d.tipoDoc, 10).replace(/[^A-Za-z]/g, ''),
    numeroDoc:    _limpiar(d.numeroDoc, 20).replace(/[^0-9A-Za-z-]/g, ''),
    razonSocial:  _limpiar(d.razonSocial, 140)
  };
}

// Límite de tasa: global por minuto + cooldown por correo.
function _rateOk(email) {
  try {
    const cache = CacheService.getScriptCache();
    const gKey  = 'ped_g_' + Math.floor(Date.now() / 60000);
    const g     = Number(cache.get(gKey) || 0) + 1;
    cache.put(gKey, String(g), 120);
    if (g > MAX_PEDIDOS_POR_MINUTO) return false;

    if (email) {
      const eKey = 'ped_e_' + Utilities.base64EncodeWebSafe(
        Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, email));
      if (cache.get(eKey)) return false;
      cache.put(eKey, '1', COOLDOWN_EMAIL_SEG);
    }
    return true;
  } catch (err) {
    return true;
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (String(p.token || '') !== CLIENT_TOKEN) return _json({ error: 'No autorizado' });
  if (p.accion === 'confirmar_pago') return _json(confirmarPago(p));
  return _json({ status: 'ok' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (String(data.token || '') !== CLIENT_TOKEN) return _json({ error: 'No autorizado' });

    if (data.accion === 'nuevo_pedido') {
      const limpio = _validarPedido(data);
      if (!_rateOk(limpio.email)) return _json({ error: 'Demasiadas solicitudes. Intenta en un momento.' });
      return _json(guardarPedido(limpio));
    }
    if (data.accion === 'confirmar_pago') return _json(confirmarPago(data));
    return _json({ error: 'Acción desconocida' });
  } catch (err) {
    return _json({ error: err.message });
  }
}

// ── Guardar pedido nuevo ──────────────────────────────────────────────────────
function guardarPedido(data) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (e) { return { ok: false, error: 'Sistema ocupado, reintenta' }; }
  try {
    const ssPedidos = SpreadsheetApp.openById(SHEET_PEDIDOS);
    let hoja = ssPedidos.getSheetByName('Pedidos');
    if (!hoja) {
      hoja = ssPedidos.insertSheet('Pedidos');
      hoja.appendRow([
        'ID Pedido','Fecha','Estado','Referencia','Productos','Total (COP)',
        'Nombre','Email','Teléfono','Departamento','Ciudad','Dirección','Complemento',
        'Tipo Doc','Número Doc','Razón Social','Requiere Factura','ID Transacción Wompi'
      ]);
      hoja.getRange(1,1,1,18).setFontWeight('bold');
    }

    const fecha = Utilities.formatDate(new Date(), 'America/Bogota', 'dd/MM/yyyy HH:mm:ss');
    const estado = data.metodo === 'wompi' ? 'PAGO_PENDIENTE' : 'WHATSAPP_PENDIENTE';

    // Prefijo ' para que Sheets nunca interprete un campo como fórmula.
    const safe = function (v) {
      var s = String(v == null ? '' : v);
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    };

    hoja.appendRow([
      safe(data.idPedido), fecha, estado, safe(data.referencia),
      safe(data.productos), data.total,
      safe(data.nombre), safe(data.email), safe(data.telefono),
      safe(data.departamento), safe(data.ciudad), safe(data.direccion), safe(data.complemento),
      safe(data.tipoDoc), safe(data.numeroDoc), safe(data.razonSocial),
      data.factura ? 'Sí' : 'No', ''
    ]);

    _upsertCliente(data);

    if (data.metodo === 'whatsapp') {
      _notificarVendedor(data, data.idPedido, null);
      _confirmarCliente(data, data.idPedido, null);
    }
    // Para Wompi: los emails se envían al confirmar el pago (ya verificado).

    return { ok: true, idPedido: data.idPedido };
  } finally {
    lock.releaseLock();
  }
}

// ── Confirmar pago Wompi (con verificación real contra la API de Wompi) ───────
function confirmarPago(data) {
  const referencia   = _limpiar(data.referencia, 40).replace(/[^A-Za-z0-9_-]/g, '');
  const transaccionId = _limpiar(data.transaccionId, 64).replace(/[^A-Za-z0-9_-]/g, '');
  if (!referencia || !transaccionId) return { ok: false, error: 'Faltan datos' };

  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (e) { return { ok: false, error: 'Sistema ocupado' }; }
  try {
    const ssPedidos = SpreadsheetApp.openById(SHEET_PEDIDOS);
    const hoja = ssPedidos.getSheetByName('Pedidos');
    if (!hoja) return { ok: false, error: 'Hoja no encontrada' };

    const filas = hoja.getDataRange().getValues();
    let fila = -1;
    for (let i = 1; i < filas.length; i++) {
      if (String(filas[i][3]) === referencia) { fila = i; break; }
    }
    if (fila < 0) return { ok: false, error: 'Referencia no encontrada' };

    // Ya procesado → idempotente, no re-notificar.
    if (String(filas[fila][2]) === 'PAGADO') return { ok: true, yaProcesado: true };

    // ── Verificación con Wompi ──
    let txn;
    try {
      const resp = UrlFetchApp.fetch(WOMPI_API + encodeURIComponent(transaccionId), { muteHttpExceptions: true });
      if (resp.getResponseCode() !== 200) return { ok: false, error: 'No se pudo verificar con Wompi' };
      txn = JSON.parse(resp.getContentText()).data;
    } catch (e) {
      return { ok: false, error: 'Error verificando el pago' };
    }
    if (!txn) return { ok: false, error: 'Transacción no encontrada en Wompi' };

    const totalEsperado = Number(filas[fila][5]) || 0;
    const okStatus = txn.status === 'APPROVED';
    const okRef    = String(txn.reference || '') === referencia;
    const okMonto  = Number(txn.amount_in_cents || 0) === Math.round(totalEsperado * 100);

    if (!okStatus || !okRef || !okMonto) {
      return { ok: false, error: 'El pago no coincide o no está aprobado', status: txn.status || '' };
    }

    hoja.getRange(fila + 1, 3).setValue('PAGADO');
    hoja.getRange(fila + 1, 18).setValue(transaccionId);

    const pedido = {
      idPedido: filas[fila][0], productos: filas[fila][4], total: filas[fila][5],
      nombre: filas[fila][6], email: filas[fila][7], telefono: filas[fila][8],
      departamento: filas[fila][9], ciudad: filas[fila][10],
      direccion: filas[fila][11], complemento: filas[fila][12],
      tipoDoc: filas[fila][13], numeroDoc: filas[fila][14],
      razonSocial: filas[fila][15], factura: filas[fila][16] === 'Sí', metodo: 'wompi'
    };
    _notificarVendedor(pedido, pedido.idPedido, transaccionId);
    _confirmarCliente(pedido, pedido.idPedido, transaccionId);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

// ── Upsert cliente ────────────────────────────────────────────────────────────
function _upsertCliente(data) {
  const ss = SpreadsheetApp.openById(SHEET_CLIENTES);
  let hoja = ss.getSheetByName('Clientes');
  if (!hoja) {
    hoja = ss.insertSheet('Clientes');
    hoja.appendRow([
      'Primera Compra','Última Compra','Nombre','Email','Teléfono',
      'Departamento','Ciudad','Dirección','Tipo Doc','Número Doc',
      'Razón Social','Total Pedidos','Total Acumulado (COP)'
    ]);
    hoja.getRange(1,1,1,13).setFontWeight('bold');
  }

  const fecha = Utilities.formatDate(new Date(), 'America/Bogota', 'dd/MM/yyyy HH:mm:ss');
  const filas = hoja.getDataRange().getValues();

  for (let i = 1; i < filas.length; i++) {
    if (filas[i][3] === data.email || filas[i][4] === data.telefono) {
      hoja.getRange(i+1, 2).setValue(fecha);
      hoja.getRange(i+1, 12).setValue((Number(filas[i][11]) || 0) + 1);
      hoja.getRange(i+1, 13).setValue((Number(filas[i][12]) || 0) + Number(data.total));
      return;
    }
  }

  hoja.appendRow([
    fecha, fecha,
    data.nombre, data.email, data.telefono,
    data.departamento, data.ciudad, data.direccion,
    data.tipoDoc || '', data.numeroDoc || '', data.razonSocial || '',
    1, Number(data.total)
  ]);
}

// ── Email de confirmación al cliente ─────────────────────────────────────────
function _confirmarCliente(p, idPedido, transaccionId) {
  if (!p.email) return;

  const fecha    = Utilities.formatDate(new Date(), 'America/Bogota', 'dd/MM/yyyy HH:mm');
  const metodo   = p.metodo === 'wompi' ? 'Pago en línea (Wompi)' : 'Pedido por WhatsApp';
  const idE      = _esc(idPedido);
  const txnLinea = transaccionId ? `<tr><td style="color:#6B4226;padding:4px 0">ID transacción</td><td style="font-weight:600;text-align:right">${_esc(transaccionId)}</td></tr>` : '';
  const factLinea = p.factura
    ? `<tr><td style="color:#6B4226;padding:4px 0">Documento</td><td style="font-weight:600;text-align:right">${_esc(p.tipoDoc)}: ${_esc(p.numeroDoc)}${p.razonSocial ? ' — ' + _esc(p.razonSocial) : ''}</td></tr>`
    : '';
  const complemento = p.complemento ? `, ${_esc(p.complemento)}` : '';

  const waUrl = `https://wa.me/573022573244?text=${encodeURIComponent('Hola Esencia y Taza, tengo una consulta sobre mi pedido ' + idPedido)}`;

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Confirmación de pedido</title></head>
<body style="margin:0;padding:0;background:#FAF5EE;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="100%" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)">

  <!-- Header -->
  <tr><td style="background:#3D2817;padding:28px 32px;text-align:center">
    <p style="margin:0;font-size:22px;font-weight:700;color:#C8962E;letter-spacing:.5px">Esencia y Taza</p>
    <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,.7)">Café artesanal de origen · Caicedo, Antioquia</p>
  </td></tr>

  <!-- Estado -->
  <tr><td style="background:${p.metodo === 'wompi' ? '#2E7D32' : '#1565C0'};padding:20px 32px;text-align:center">
    <p style="margin:0;font-size:28px">${p.metodo === 'wompi' ? '✅' : '💬'}</p>
    <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#fff">${p.metodo === 'wompi' ? '¡Pedido confirmado!' : '¡Pedido recibido!'}</p>
    <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,.85)">${p.metodo === 'wompi' ? 'Tu pago fue procesado exitosamente.' : 'Nos pondremos en contacto para coordinar el envío.'}</p>
  </td></tr>

  <!-- Cuerpo -->
  <tr><td style="padding:28px 32px">

    <!-- Referencia -->
    <table width="100%" style="background:#FAF5EE;border-radius:8px;margin-bottom:24px"><tr>
      <td style="padding:12px 16px">
        <p style="margin:0;font-size:11px;color:#6B4226;text-transform:uppercase;letter-spacing:.08em">Número de pedido</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#3D2817;font-family:monospace">${idE}</p>
      </td>
      <td style="padding:12px 16px;text-align:right">
        <p style="margin:0;font-size:11px;color:#6B4226;text-transform:uppercase;letter-spacing:.08em">Fecha</p>
        <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#3D2817">${fecha}</p>
      </td>
    </tr></table>

    <!-- Productos -->
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#C8962E;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid rgba(200,150,46,.2);padding-bottom:6px">Productos</p>
    <p style="margin:0 0 4px;font-size:13px;color:#2C1A0E;white-space:pre-line">${_esc(p.productos)}</p>
    <table width="100%" style="margin-top:10px;border-top:2px solid #3D2817;padding-top:8px"><tr>
      <td style="font-size:15px;font-weight:700;color:#3D2817;padding-top:8px">Total</td>
      <td style="font-size:16px;font-weight:700;color:#3D2817;text-align:right;padding-top:8px">$${Number(p.total).toLocaleString('es-CO')} COP</td>
    </tr></table>

    <!-- Método y transacción -->
    <p style="margin:24px 0 8px;font-size:11px;font-weight:700;color:#C8962E;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid rgba(200,150,46,.2);padding-bottom:6px">Pago</p>
    <table width="100%">
      <tr><td style="color:#6B4226;padding:4px 0">Método</td><td style="font-weight:600;text-align:right">${metodo}</td></tr>
      ${txnLinea}
    </table>

    <!-- Envío -->
    <p style="margin:24px 0 8px;font-size:11px;font-weight:700;color:#C8962E;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid rgba(200,150,46,.2);padding-bottom:6px">Dirección de envío</p>
    <table width="100%">
      <tr><td style="color:#6B4226;padding:4px 0">Destinatario</td><td style="font-weight:600;text-align:right">${_esc(p.nombre)}</td></tr>
      <tr><td style="color:#6B4226;padding:4px 0">Teléfono</td><td style="font-weight:600;text-align:right">${_esc(p.telefono)}</td></tr>
      <tr><td style="color:#6B4226;padding:4px 0">Ciudad</td><td style="font-weight:600;text-align:right">${_esc(p.ciudad)}, ${_esc(p.departamento)}</td></tr>
      <tr><td style="color:#6B4226;padding:4px 0">Dirección</td><td style="font-weight:600;text-align:right">${_esc(p.direccion)}${complemento}</td></tr>
    </table>

    ${p.factura ? `
    <!-- Factura -->
    <p style="margin:24px 0 8px;font-size:11px;font-weight:700;color:#C8962E;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid rgba(200,150,46,.2);padding-bottom:6px">Datos de factura</p>
    <table width="100%">${factLinea}</table>` : ''}

    <!-- CTA -->
    <div style="text-align:center;margin:28px 0 0">
      <a href="${waUrl}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px">
        💬 Contactar por WhatsApp
      </a>
    </div>

  </td></tr>

  <!-- Brochure de productos -->
  <tr><td style="background:#2C1A0E;padding:28px 32px">
    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#C8962E;text-transform:uppercase;letter-spacing:.1em;text-align:center">También te puede interesar</p>
    <p style="margin:0 0 20px;font-size:15px;font-weight:700;color:#FAF5EE;text-align:center">Nuestra línea completa de café</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="49%" valign="top" style="background:rgba(255,255,255,.07);border:1px solid rgba(200,150,46,.25);padding:14px 12px;border-radius:8px">
          <p style="margin:0 0 2px;font-size:10px;color:#C8962E;font-weight:700;text-transform:uppercase;letter-spacing:.05em">125 g · $20.000 COP</p>
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#FAF5EE">Ideal para probar</p>
          <p style="margin:0 0 12px;font-size:11px;color:rgba(250,245,238,.75);line-height:1.5">Notas de chocolate oscuro y caramelo. Perfecto en espresso o prensa francesa.</p>
          <a href="https://wa.me/573022573244?text=Hola%20Esencia%20y%20Taza%20%F0%9F%91%8B%20Quiero%20pedir%20el%20Caf%C3%A9%20Origen%20Caicedo%20125%20g%20(%2420.000%20COP).%20%C2%BFTienen%20disponibilidad%3F" style="display:inline-block;background:#C8962E;color:#fff;text-decoration:none;font-size:11px;font-weight:700;padding:7px 14px;border-radius:6px">Pedir →</a>
        </td>
        <td width="2%"></td>
        <td width="49%" valign="top" style="background:rgba(255,255,255,.07);border:1px solid rgba(200,150,46,.25);padding:14px 12px;border-radius:8px">
          <p style="margin:0 0 2px;font-size:10px;color:#C8962E;font-weight:700;text-transform:uppercase;letter-spacing:.05em">250 g · $33.000 COP</p>
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#FAF5EE">Consumo diario</p>
          <p style="margin:0 0 12px;font-size:11px;color:rgba(250,245,238,.75);line-height:1.5">Dulzura natural del grano de altura. Ideal para V60, espresso o drip.</p>
          <a href="https://wa.me/573022573244?text=Hola%20Esencia%20y%20Taza%20%F0%9F%91%8B%20Quiero%20pedir%20el%20Caf%C3%A9%20Origen%20Caicedo%20250%20g%20(%2433.000%20COP).%20%C2%BFTienen%20disponibilidad%3F" style="display:inline-block;background:#C8962E;color:#fff;text-decoration:none;font-size:11px;font-weight:700;padding:7px 14px;border-radius:6px">Pedir →</a>
        </td>
      </tr>
      <tr><td colspan="3" style="height:10px"></td></tr>
      <tr>
        <td width="49%" valign="top" style="background:rgba(200,150,46,.15);border:1px solid rgba(200,150,46,.5);padding:14px 12px;border-radius:8px">
          <p style="margin:0 0 2px;font-size:10px;color:#C8962E;font-weight:700;text-transform:uppercase;letter-spacing:.05em">⭐ Más pedido · 500 g · $60.000 COP</p>
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#FAF5EE">Consumo semanal</p>
          <p style="margin:0 0 12px;font-size:11px;color:rgba(250,245,238,.75);line-height:1.5">El favorito. Granos seleccionados de Caicedo tostados bajo pedido a precio justo.</p>
          <a href="https://wa.me/573022573244?text=Hola%20Esencia%20y%20Taza%20%F0%9F%91%8B%20Quiero%20pedir%20el%20Caf%C3%A9%20Origen%20Caicedo%20500%20g%20(%2460.000%20COP).%20%C2%BFTienen%20disponibilidad%3F" style="display:inline-block;background:#C8962E;color:#fff;text-decoration:none;font-size:11px;font-weight:700;padding:7px 14px;border-radius:6px">Pedir →</a>
        </td>
        <td width="2%"></td>
        <td width="49%" valign="top" style="background:rgba(255,255,255,.07);border:1px solid rgba(200,150,46,.25);padding:14px 12px;border-radius:8px">
          <p style="margin:0 0 2px;font-size:10px;color:#C8962E;font-weight:700;text-transform:uppercase;letter-spacing:.05em">2.5 kg · $199.999 COP</p>
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#FAF5EE">Negocios y cafeterías</p>
          <p style="margin:0 0 12px;font-size:11px;color:rgba(250,245,238,.75);line-height:1.5">Lote mayorista tostado bajo pedido. Precio directo de productor, sin intermediarios.</p>
          <a href="https://wa.me/573022573244?text=Hola%20Esencia%20y%20Taza%20%F0%9F%91%8B%20Quiero%20informaci%C3%B3n%20sobre%20el%20Caf%C3%A9%20Origen%20Caicedo%202.5%20kg%20(%24199.999%20COP)%20para%20mi%20negocio" style="display:inline-block;background:#C8962E;color:#fff;text-decoration:none;font-size:11px;font-weight:700;padding:7px 14px;border-radius:6px">Consultar →</a>
        </td>
      </tr>
    </table>
    <p style="margin:20px 0 0;text-align:center">
      <a href="https://esenciaytaza.com/#cafes" style="display:inline-block;border:1px solid rgba(200,150,46,.5);color:#C8962E;text-decoration:none;font-size:12px;font-weight:700;padding:10px 24px;border-radius:8px">
        🛒 Ver tienda completa →
      </a>
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#FAF5EE;padding:20px 32px;text-align:center;border-top:1px solid rgba(0,0,0,.06)">
    <p style="margin:0;font-size:12px;color:#6B4226">¿Preguntas? Escríbenos a <a href="mailto:comercial@esenciaytaza.com" style="color:#C8962E">comercial@esenciaytaza.com</a></p>
    <p style="margin:6px 0 0;font-size:11px;color:#999">© ${new Date().getFullYear()} Esencia y Taza · Santa Rosa de Osos, Antioquia, Colombia</p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;

  MailApp.sendEmail({
    to: p.email,
    subject: `✅ Pedido ${idPedido} — Esencia y Taza`,
    htmlBody: html,
    replyTo: EMAIL_VENDEDOR,
  });
}

// ── Email al vendedor ─────────────────────────────────────────────────────────
function _notificarVendedor(p, idPedido, transaccionId) {
  const metodoStr = p.metodo === 'wompi' ? '💳 Pago en línea (Wompi)' : '💬 WhatsApp';
  const txnLine   = transaccionId ? `🔐 ID Transacción Wompi: ${transaccionId}\n` : '';
  const factLine  = p.factura
    ? `Sí — ${p.tipoDoc}: ${p.numeroDoc}${p.razonSocial ? ' / ' + p.razonSocial : ''}`
    : 'No';

  const cuerpo = `
┌─────────────────────────────────────┐
  NUEVO PEDIDO — Esencia y Taza
└─────────────────────────────────────┘

📦 ID Pedido : ${idPedido}
📅 Fecha     : ${Utilities.formatDate(new Date(), 'America/Bogota', 'dd/MM/yyyy HH:mm')}
${metodoStr}
${txnLine}
─────── PRODUCTOS ───────
${p.productos}
💰 Total: $${Number(p.total).toLocaleString('es-CO')} COP

─────── CLIENTE ─────────
👤 Nombre  : ${p.nombre}
📧 Email   : ${p.email}
📱 Teléfono: ${p.telefono}

─────── ENVÍO ───────────
🗺  Depto   : ${p.departamento}
🏙  Ciudad  : ${p.ciudad}
🏠 Dirección: ${p.direccion}
${p.complemento ? '📍 Complemento: ' + p.complemento + '\n' : ''}
─────── FACTURA ─────────
${factLine}

─────────────────────────
Ver pedidos: https://docs.google.com/spreadsheets/d/${SHEET_PEDIDOS}
`;

  MailApp.sendEmail({
    to: EMAIL_VENDEDOR,
    subject: `🛒 Nuevo pedido ${idPedido} — ${p.nombre}`,
    body: cuerpo
  });
}
