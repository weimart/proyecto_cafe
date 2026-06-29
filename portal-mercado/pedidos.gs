/* ============================================================================
   ESENCIA Y TAZA — Apps Script: Pedidos & Clientes
   Despliega como: Aplicación web → Ejecutar como: Yo → Acceso: Cualquier usuario
   =========================================================================== */

const SHEET_PEDIDOS  = '1hyx7y9qdXwfiXFlLsm4hcCCiBUm_tH3xzwvZ7uRBR4Y';
const SHEET_CLIENTES = '1brrITidrtD78AbLOagFTVLQ47KXqNzq7Bk1WflGDjBE';
const EMAIL_VENDEDOR = 'comercial@esenciaytaza.com';
const WHATSAPP_VENDEDOR = '573022573244';

// Ejecuta esta función desde el editor para autorizar permisos (solo 1 vez)
function _autorizar() {
  const ss = SpreadsheetApp.openById(SHEET_PEDIDOS);
  Logger.log('✅ Sheet pedidos OK: ' + ss.getName());
  const ss2 = SpreadsheetApp.openById(SHEET_CLIENTES);
  Logger.log('✅ Sheet clientes OK: ' + ss2.getName());
  MailApp.sendEmail({
    to: EMAIL_VENDEDOR,
    subject: '✅ Esencia y Taza — Script de pedidos autorizado',
    body: 'El script de pedidos quedó correctamente autorizado. Ya puede recibir pedidos en línea.'
  });
  Logger.log('✅ Email de prueba enviado a ' + EMAIL_VENDEDOR);
  Logger.log('🎉 Autorización completa. El web app está listo.');
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const accion = (e && e.parameter && e.parameter.accion) || '';
  if (accion === 'confirmar_pago') return _json(confirmarPago(e.parameter));
  return _json({ status: 'ok' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.accion === 'nuevo_pedido')    return _json(guardarPedido(data));
    if (data.accion === 'confirmar_pago')  return _json(confirmarPago(data));
    return _json({ error: 'Acción desconocida' });
  } catch (err) {
    return _json({ error: err.message });
  }
}

// ── Guardar pedido nuevo ──────────────────────────────────────────────────────
function guardarPedido(data) {
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

  hoja.appendRow([
    data.idPedido, fecha, estado, data.referencia,
    data.productos, data.total,
    data.nombre, data.email, data.telefono,
    data.departamento, data.ciudad, data.direccion, data.complemento || '',
    data.tipoDoc || '', data.numeroDoc || '', data.razonSocial || '',
    data.factura ? 'Sí' : 'No', ''
  ]);

  // Guardar / actualizar cliente
  _upsertCliente(data);

  // Notificar al vendedor si es WhatsApp (el pago Wompi se confirma después)
  if (data.metodo === 'whatsapp') {
    _notificarVendedor(data, data.idPedido, null);
  }

  return { ok: true, idPedido: data.idPedido };
}

// ── Confirmar pago Wompi ──────────────────────────────────────────────────────
function confirmarPago(data) {
  const ssPedidos = SpreadsheetApp.openById(SHEET_PEDIDOS);
  const hoja = ssPedidos.getSheetByName('Pedidos');
  if (!hoja) return { ok: false, error: 'Hoja no encontrada' };

  const filas = hoja.getDataRange().getValues();
  for (let i = 1; i < filas.length; i++) {
    if (String(filas[i][3]) === String(data.referencia)) {
      hoja.getRange(i + 1, 3).setValue('PAGADO');
      hoja.getRange(i + 1, 18).setValue(data.transaccionId || '');

      // Notificar al vendedor
      const pedido = {
        idPedido: filas[i][0], productos: filas[i][4], total: filas[i][5],
        nombre: filas[i][6], email: filas[i][7], telefono: filas[i][8],
        departamento: filas[i][9], ciudad: filas[i][10],
        direccion: filas[i][11], complemento: filas[i][12],
        tipoDoc: filas[i][13], numeroDoc: filas[i][14],
        razonSocial: filas[i][15], factura: filas[i][16] === 'Sí', metodo: 'wompi'
      };
      _notificarVendedor(pedido, pedido.idPedido, data.transaccionId);
      return { ok: true };
    }
  }
  return { ok: false, error: 'Referencia no encontrada' };
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
      // Actualizar cliente existente
      hoja.getRange(i+1, 2).setValue(fecha);
      hoja.getRange(i+1, 12).setValue((Number(filas[i][11]) || 0) + 1);
      hoja.getRange(i+1, 13).setValue((Number(filas[i][12]) || 0) + Number(data.total));
      return;
    }
  }

  // Cliente nuevo
  hoja.appendRow([
    fecha, fecha,
    data.nombre, data.email, data.telefono,
    data.departamento, data.ciudad, data.direccion,
    data.tipoDoc || '', data.numeroDoc || '', data.razonSocial || '',
    1, Number(data.total)
  ]);
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
