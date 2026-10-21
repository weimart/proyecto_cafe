/* ============================================================================
   ESENCIA Y TAZA — Dashboard de Ventas v1.0

   INSTRUCCIONES DE DESPLIEGUE:
   1. Abre script.google.com → Nuevo proyecto → Pega este código completo
   2. Configuración del proyecto → Propiedades del script → agrega PANEL_PIN
      con un PIN de al menos 6 dígitos (el PIN ya NO va en el código).
   3. Ejecuta _autorizar() una vez para otorgar permisos de Sheets
   4. Implementar → Nueva implementación → Aplicación web
      · Descripción: Dashboard v1
      · Ejecutar como: Yo (comercial@esenciaytaza.com)
      · Quién puede acceder: Solo yo  (así lo protege tu inicio de sesión de
        Google; el PIN queda como segunda barrera)
   5. Copia la URL y guárdala en un lugar seguro
   ============================================================================ */

const D_PEDIDOS  = '1hyx7y9qdXwfiXFlLsm4hcCCiBUm_tH3xzwvZ7uRBR4Y';
const D_CLIENTES = '1brrITidrtD78AbLOagFTVLQ47KXqNzq7Bk1WflGDjBE';

// PIN en Propiedades del script (PANEL_PIN). Tras 5 intentos fallidos el
// panel se bloquea 15 minutos para todos.
const MAX_FALLOS_PIN = 5;
function _pinOk(pin) {
  const correcto = PropertiesService.getScriptProperties().getProperty('PANEL_PIN') || '';
  if (correcto.length < 6) return { error: 'Configura PANEL_PIN (mín. 6 dígitos) en las propiedades del script' };
  const cache  = CacheService.getScriptCache();
  const fallos = Number(cache.get('panel_fallos') || 0);
  if (fallos >= MAX_FALLOS_PIN) return { error: 'Demasiados intentos. Espera 15 minutos.' };
  if (String(pin) !== correcto) {
    cache.put('panel_fallos', String(fallos + 1), 900);
    return { error: 'PIN incorrecto' };
  }
  return null;
}

// Todo texto que viene de la hoja se escapa antes de enviarlo al navegador:
// el panel lo pinta con innerHTML y los datos los escribe cualquier cliente.
function _escD(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ── Autorización inicial ──────────────────────────────────────────────────────
function _autorizar() {
  SpreadsheetApp.openById(D_PEDIDOS);
  SpreadsheetApp.openById(D_CLIENTES);
  Logger.log('✅ Autorización completa. Puedes desplegar el dashboard.');
}

// ── Entrada web app ───────────────────────────────────────────────────────────
function doGet() {
  return HtmlService.createHtmlOutput(DASHBOARD_HTML)
    .setTitle('Dashboard — Esencia y Taza');
}

// ── Datos del dashboard ───────────────────────────────────────────────────────
function getDashboardData(pin) {
  const errPin = _pinOk(pin);
  if (errPin) return errPin;
  try {
    const hPed = SpreadsheetApp.openById(D_PEDIDOS).getSheetByName('Pedidos');
    const hCli = SpreadsheetApp.openById(D_CLIENTES).getSheetByName('Clientes');
    if (!hPed) return { error: 'Hoja "Pedidos" no encontrada. Verifica el ID del Sheet.' };

    const filasPed = hPed.getDataRange().getValues().slice(1);
    const filasCli = hCli ? hCli.getDataRange().getValues().slice(1) : [];

    const ahora   = new Date();
    const mesAct  = ahora.getMonth();
    const anioAct = ahora.getFullYear();

    let totalIngresos = 0, ingresosMes = 0, pedidosMes = 0;
    const ventasProd = { '125 g': 0, '250 g': 0, '500 g': 0, '2.5 kg': 0, 'Otro': 0 };
    const ventasDia  = {};
    const pedidos    = [];

    filasPed.forEach(function(r, idx) {
      var id = r[0], fecha = r[1], estado = r[2], ref = r[3], prods = r[4],
          total = r[5], nombre = r[6], email = r[7], tel = r[8],
          depto = r[9], ciudad = r[10], dir = r[11], comp = r[12],
          tipoDoc = r[13], numDoc = r[14], razon = r[15], factura = r[16], txnId = r[17];

      var totalN = Number(total) || 0;
      var fechaS = String(fecha || '');
      var estadoS = String(estado || '');

      pedidos.push({
        fila: idx + 2,
        id: _escD(id), fecha: _escD(fechaS), estado: _escD(estadoS),
        prods: _escD(prods), total: totalN,
        nombre: _escD(nombre), email: _escD(email),
        tel: _escD(tel), ciudad: _escD(ciudad),
        depto: _escD(depto), dir: _escD(dir),
        comp: _escD(comp), factura: _escD(factura),
        tipoDoc: _escD(tipoDoc), numDoc: _escD(numDoc),
        razon: _escD(razon), txnId: _escD(txnId)
      });

      if (estadoS === 'PAGADO' || estadoS === 'ENVIADO') {
        totalIngresos += totalN;
        var m = fechaS.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
        if (m) {
          var d = parseInt(m[1]), mo = parseInt(m[2]) - 1, a = parseInt(m[3]);
          if (mo === mesAct && a === anioAct) { ingresosMes += totalN; pedidosMes++; }
          var diff = Math.floor((ahora - new Date(a, mo, d)) / 86400000);
          if (diff <= 30) {
            var key = a + '-' + String(mo+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
            ventasDia[key] = (ventasDia[key] || 0) + totalN;
          }
        }
        var p = String(prods || '').toLowerCase();
        if      (p.indexOf('2.5') >= 0 || p.indexOf('2500') >= 0) ventasProd['2.5 kg'] += totalN;
        else if (p.indexOf('500') >= 0)                            ventasProd['500 g']  += totalN;
        else if (p.indexOf('250') >= 0)                            ventasProd['250 g']  += totalN;
        else if (p.indexOf('125') >= 0)                            ventasProd['125 g']  += totalN;
        else                                                        ventasProd['Otro']   += totalN;
      }
    });

    pedidos.sort(function(a, b) { return b.fila - a.fila; });

    var clientes = filasCli.map(function(r) {
      return {
        primeraCompra: _escD(r[0]), ultimaCompra: _escD(r[1]),
        nombre: _escD(r[2]), email: _escD(r[3]),
        telefono: _escD(r[4]), ciudad: _escD(r[6]),
        totalPedidos: Number(r[11]) || 0, totalAcum: Number(r[12]) || 0
      };
    }).sort(function(a, b) { return b.totalAcum - a.totalAcum; });

    var pendientes = pedidos.filter(function(p) {
      return p.estado === 'PAGO_PENDIENTE' || p.estado === 'WHATSAPP_PENDIENTE';
    });

    return {
      ok: true,
      kpis: {
        totalIngresos: totalIngresos, ingresosMes: ingresosMes,
        pedidosMes: pedidosMes, totalPedidos: pedidos.length,
        totalClientes: clientes.length, pendientes: pendientes.length
      },
      pedidos: pedidos,
      clientes: clientes.slice(0, 30),
      ventasProd: ventasProd,
      ventasDia: ventasDia,
      alertas: pendientes.slice(0, 10),
      timestamp: Utilities.formatDate(ahora, 'America/Bogota', 'dd/MM/yyyy HH:mm:ss')
    };
  } catch(e) {
    return { error: _escD(e.message) };
  }
}

// ── Cambiar estado de pedido ──────────────────────────────────────────────────
function cambiarEstado(pin, fila, nuevoEstado) {
  const errPin = _pinOk(pin);
  if (errPin) return errPin;
  fila = Number(fila);
  if (!(fila >= 2 && fila === Math.floor(fila))) return { error: 'Fila no válida' };
  var estadosValidos = ['PAGADO','ENVIADO','CANCELADO','PAGO_PENDIENTE','WHATSAPP_PENDIENTE'];
  if (estadosValidos.indexOf(nuevoEstado) < 0) return { error: 'Estado no válido' };
  try {
    var h = SpreadsheetApp.openById(D_PEDIDOS).getSheetByName('Pedidos');
    if (!h) return { error: 'Hoja no encontrada' };
    h.getRange(fila, 3).setValue(nuevoEstado);
    return { ok: true };
  } catch(e) {
    return { error: e.message };
  }
}

// ── HTML del dashboard ────────────────────────────────────────────────────────
var DASHBOARD_HTML = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dashboard — Esencia y Taza</title><script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script><style>' +
'*{box-sizing:border-box;margin:0;padding:0}' +
'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#0D0805;color:#FAF5EE;min-height:100vh}' +

/* ── Login ── */
'#login{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}' +
'.login-card{background:#1A0F08;border:1px solid rgba(200,150,46,.25);border-radius:16px;padding:48px 40px;width:100%;max-width:380px;text-align:center}' +
'.login-logo{font-size:28px;font-weight:800;color:#C8962E;letter-spacing:.5px;margin-bottom:4px}' +
'.login-sub{font-size:13px;color:rgba(250,245,238,.5);margin-bottom:36px}' +
'.login-label{display:block;text-align:left;font-size:12px;font-weight:600;color:rgba(250,245,238,.6);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}' +
'.login-input{width:100%;background:#0D0805;border:1px solid rgba(200,150,46,.3);border-radius:8px;padding:14px 16px;color:#FAF5EE;font-size:18px;letter-spacing:.3em;text-align:center;outline:none;transition:.2s}' +
'.login-input:focus{border-color:#C8962E;box-shadow:0 0 0 3px rgba(200,150,46,.15)}' +
'.login-btn{margin-top:20px;width:100%;background:#C8962E;color:#fff;border:none;border-radius:8px;padding:14px;font-size:14px;font-weight:700;cursor:pointer;transition:.2s}' +
'.login-btn:hover{background:#E8B84B}' +
'.login-error{margin-top:12px;font-size:13px;color:#F44336;min-height:20px}' +

/* ── App shell ── */
'#app{display:none}' +
'.topbar{background:#1A0F08;border-bottom:1px solid rgba(200,150,46,.2);padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}' +
'.topbar-brand{font-size:16px;font-weight:800;color:#C8962E}' +
'.topbar-brand span{color:rgba(250,245,238,.5);font-weight:400;font-size:12px;margin-left:8px}' +
'.topbar-right{display:flex;align-items:center;gap:12px}' +
'.ts{font-size:12px;color:rgba(250,245,238,.4)}' +
'.btn-refresh{background:rgba(200,150,46,.15);border:1px solid rgba(200,150,46,.3);color:#C8962E;border-radius:6px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;transition:.2s}' +
'.btn-refresh:hover{background:rgba(200,150,46,.25)}' +
'.btn-logout{background:transparent;border:1px solid rgba(250,245,238,.15);color:rgba(250,245,238,.5);border-radius:6px;padding:6px 12px;font-size:12px;cursor:pointer;transition:.2s}' +
'.btn-logout:hover{color:#F44336;border-color:#F44336}' +
'.main{padding:24px;max-width:1400px;margin:0 auto}' +

/* ── Alertas ── */
'#alertas-banner{margin-bottom:20px}' +
'.alerta-item{background:rgba(255,152,0,.1);border:1px solid rgba(255,152,0,.3);border-left:3px solid #FF9800;border-radius:8px;padding:12px 16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center}' +
'.alerta-txt{font-size:13px;color:#FFB74D}' +
'.alerta-txt strong{color:#FF9800}' +
'.alerta-ver{background:rgba(255,152,0,.2);border:none;color:#FF9800;border-radius:5px;padding:4px 10px;font-size:12px;font-weight:600;cursor:pointer;transition:.2s}' +
'.alerta-ver:hover{background:rgba(255,152,0,.35)}' +

/* ── KPIs ── */
'.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px}' +
'.kpi{background:#1A0F08;border:1px solid rgba(200,150,46,.15);border-radius:12px;padding:20px 22px}' +
'.kpi-label{font-size:11px;font-weight:600;color:rgba(250,245,238,.45);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}' +
'.kpi-value{font-size:26px;font-weight:800;color:#FAF5EE;letter-spacing:-.5px}' +
'.kpi-value.gold{color:#C8962E}' +
'.kpi-value.alert{color:#FF9800}' +
'.kpi-sub{font-size:11px;color:rgba(250,245,238,.35);margin-top:4px}' +

/* ── Charts ── */
'.charts-row{display:grid;grid-template-columns:1fr 2fr;gap:16px;margin-bottom:24px}' +
'.chart-card{background:#1A0F08;border:1px solid rgba(200,150,46,.15);border-radius:12px;padding:20px}' +
'.chart-title{font-size:12px;font-weight:700;color:rgba(250,245,238,.5);text-transform:uppercase;letter-spacing:.1em;margin-bottom:16px}' +
'.chart-wrap{position:relative;height:220px}' +

/* ── Tabs ── */
'.tabs-card{background:#1A0F08;border:1px solid rgba(200,150,46,.15);border-radius:12px;overflow:hidden}' +
'.tabs-header{display:flex;border-bottom:1px solid rgba(200,150,46,.15);padding:0 20px}' +
'.tab-btn{background:none;border:none;color:rgba(250,245,238,.4);padding:14px 16px;font-size:13px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:.2s}' +
'.tab-btn.active{color:#C8962E;border-bottom-color:#C8962E}' +
'.tab-content{padding:0}' +

/* ── Filtros pedidos ── */
'.filters{padding:14px 20px;border-bottom:1px solid rgba(200,150,46,.1);display:flex;gap:8px;flex-wrap:wrap}' +
'.f-btn{background:rgba(250,245,238,.06);border:1px solid rgba(250,245,238,.1);color:rgba(250,245,238,.6);border-radius:20px;padding:5px 14px;font-size:12px;font-weight:600;cursor:pointer;transition:.2s}' +
'.f-btn:hover{background:rgba(250,245,238,.1)}' +
'.f-btn.active{background:rgba(200,150,46,.2);border-color:rgba(200,150,46,.4);color:#C8962E}' +

/* ── Tabla ── */
'.tbl-wrap{overflow-x:auto}' +
'table{width:100%;border-collapse:collapse;font-size:13px}' +
'th{padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:rgba(250,245,238,.4);text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid rgba(200,150,46,.1);white-space:nowrap}' +
'td{padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.04);vertical-align:middle}' +
'tr:last-child td{border-bottom:none}' +
'tbody tr{cursor:pointer;transition:background .15s}' +
'tbody tr:hover{background:rgba(200,150,46,.06)}' +
'.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap}' +
'.badge-PAGADO{background:rgba(76,175,80,.15);color:#81C784;border:1px solid rgba(76,175,80,.25)}' +
'.badge-ENVIADO{background:rgba(0,150,136,.15);color:#4DB6AC;border:1px solid rgba(0,150,136,.25)}' +
'.badge-PAGO_PENDIENTE{background:rgba(255,152,0,.15);color:#FFB74D;border:1px solid rgba(255,152,0,.25)}' +
'.badge-WHATSAPP_PENDIENTE{background:rgba(33,150,243,.15);color:#64B5F6;border:1px solid rgba(33,150,243,.25)}' +
'.badge-CANCELADO{background:rgba(244,67,54,.12);color:#E57373;border:1px solid rgba(244,67,54,.2)}' +
'.mono{font-family:monospace;font-size:12px;color:rgba(250,245,238,.5)}' +
'.empty{text-align:center;padding:40px;color:rgba(250,245,238,.25);font-size:13px}' +
'.cliente-rank{width:28px;height:28px;border-radius:50%;background:rgba(200,150,46,.15);border:1px solid rgba(200,150,46,.25);display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#C8962E}' +

/* ── Modal ── */
'#modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:200;align-items:center;justify-content:center;padding:16px}' +
'#modal-overlay.open{display:flex}' +
'.modal{background:#1A0F08;border:1px solid rgba(200,150,46,.25);border-radius:16px;width:100%;max-width:580px;max-height:90vh;overflow-y:auto}' +
'.modal-head{padding:20px 24px;border-bottom:1px solid rgba(200,150,46,.15);display:flex;justify-content:space-between;align-items:center}' +
'.modal-head h3{font-size:15px;font-weight:700;color:#FAF5EE}' +
'.modal-close{background:none;border:none;color:rgba(250,245,238,.4);font-size:20px;cursor:pointer;line-height:1;padding:0 4px}' +
'.modal-close:hover{color:#FAF5EE}' +
'.modal-body{padding:24px}' +
'.m-section{margin-bottom:20px}' +
'.m-section-title{font-size:11px;font-weight:700;color:#C8962E;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(200,150,46,.15)}' +
'.m-row{display:flex;justify-content:space-between;align-items:baseline;padding:5px 0;font-size:13px}' +
'.m-row .lbl{color:rgba(250,245,238,.5)}' +
'.m-row .val{font-weight:600;color:#FAF5EE;text-align:right;max-width:60%}' +
'.modal-actions{padding:16px 24px;border-top:1px solid rgba(200,150,46,.15);display:flex;gap:10px;flex-wrap:wrap}' +
'.act-btn{border:none;border-radius:8px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;transition:.2s;flex:1;min-width:140px;text-align:center}' +
'.act-btn:hover{opacity:.85}' +
'.act-pagado{background:#2E7D32;color:#fff}' +
'.act-enviado{background:#00695C;color:#fff}' +
'.act-cancelado{background:rgba(244,67,54,.2);color:#EF9A9A;border:1px solid rgba(244,67,54,.3)}' +

/* ── Spinner ── */
'.spinner{width:36px;height:36px;border:3px solid rgba(200,150,46,.2);border-top-color:#C8962E;border-radius:50%;animation:spin .8s linear infinite;margin:40px auto}' +
'@keyframes spin{to{transform:rotate(360deg)}}' +

/* ── Responsive ── */
'@media(max-width:768px){' +
'.charts-row{grid-template-columns:1fr}' +
'.kpi-grid{grid-template-columns:repeat(2,1fr)}' +
'.main{padding:16px}' +
'.topbar{padding:0 16px}' +
'}' +
'</style></head><body>' +

/* ── Login screen ── */
'<div id="login"><div class="login-card">' +
'<div class="login-logo">Esencia y Taza</div>' +
'<div class="login-sub">Panel de ventas &mdash; Acceso privado</div>' +
'<label class="login-label" for="pin-input">PIN de acceso</label>' +
'<input id="pin-input" class="login-input" type="password" inputmode="numeric" maxlength="8" placeholder="&bull;&bull;&bull;&bull;" autocomplete="off" onkeydown="if(event.key===\'Enter\')doLogin()">' +
'<button class="login-btn" onclick="doLogin()">Ingresar</button>' +
'<div id="login-err" class="login-error"></div>' +
'</div></div>' +

/* ── App ── */
'<div id="app">' +
'<div class="topbar">' +
'<div class="topbar-brand">Esencia y Taza <span>Dashboard</span></div>' +
'<div class="topbar-right">' +
'<span class="ts" id="ts"></span>' +
'<button class="btn-refresh" onclick="loadData()">&#8635; Actualizar</button>' +
'<button class="btn-logout" onclick="logout()">Salir</button>' +
'</div></div>' +
'<div class="main">' +
'<div id="alertas-banner"></div>' +
'<div class="kpi-grid" id="kpis"></div>' +
'<div class="charts-row">' +
'<div class="chart-card"><div class="chart-title">Ingresos por presentaci&oacute;n</div><div class="chart-wrap"><canvas id="chart-prod"></canvas></div></div>' +
'<div class="chart-card"><div class="chart-title">Ingresos &uacute;ltimos 30 d&iacute;as (COP)</div><div class="chart-wrap"><canvas id="chart-dias"></canvas></div></div>' +
'</div>' +
'<div class="tabs-card">' +
'<div class="tabs-header">' +
'<button class="tab-btn active" onclick="switchTab(\'pedidos\',this)">Pedidos</button>' +
'<button class="tab-btn" onclick="switchTab(\'clientes\',this)">Clientes</button>' +
'</div>' +
'<div id="tab-pedidos" class="tab-content">' +
'<div class="filters" id="filtros"></div>' +
'<div class="tbl-wrap"><div id="tbl-pedidos"></div></div>' +
'</div>' +
'<div id="tab-clientes" class="tab-content" style="display:none">' +
'<div class="tbl-wrap"><div id="tbl-clientes"></div></div>' +
'</div>' +
'</div>' +
'</div></div>' +

/* ── Modal ── */
'<div id="modal-overlay" onclick="if(event.target===this)closeModal()">' +
'<div class="modal">' +
'<div class="modal-head"><h3 id="modal-title">Detalle del pedido</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>' +
'<div class="modal-body" id="modal-body"></div>' +
'<div class="modal-actions" id="modal-actions"></div>' +
'</div></div>' +

'<script>' +
'var PIN = \'\', chartProd = null, chartDias = null, allPedidos = [], filtroActual = \'TODOS\';' +

'function doLogin(){' +
'  var p = document.getElementById(\'pin-input\').value.trim();' +
'  if(!p){document.getElementById(\'login-err\').textContent=\'Ingresa el PIN\';return;}' +
'  document.getElementById(\'login-err\').textContent=\'\';' +
'  document.querySelector(\'.login-btn\').textContent=\'Verificando...\';' +
'  PIN = p;' +
'  google.script.run.withSuccessHandler(function(d){' +
'    document.querySelector(\'.login-btn\').textContent=\'Ingresar\';' +
'    if(d.error){' +
'      document.getElementById(\'login-err\').textContent = d.error === \'PIN incorrecto\' ? \'PIN incorrecto. Int&eacute;ntalo de nuevo.\' : \'Error: \'+d.error;' +
'      PIN = \'\';' +
'    } else {' +
'      document.getElementById(\'login\').style.display=\'none\';' +
'      document.getElementById(\'app\').style.display=\'block\';' +
'      renderAll(d);' +
'    }' +
'  }).withFailureHandler(function(e){' +
'    document.querySelector(\'.login-btn\').textContent=\'Ingresar\';' +
'    document.getElementById(\'login-err\').textContent=\'Error de conexi&oacute;n.\';' +
'  }).getDashboardData(p);' +
'}' +

'function logout(){PIN=\'\';location.reload();}' +

'function loadData(){' +
'  document.getElementById(\'ts\').textContent=\'Actualizando...\';' +
'  google.script.run.withSuccessHandler(renderAll).withFailureHandler(function(e){' +
'    document.getElementById(\'ts\').textContent=\'Error al cargar\';' +
'  }).getDashboardData(PIN);' +
'}' +

'function renderAll(d){' +
'  if(d.error){alert(\'Error: \'+d.error);return;}' +
'  document.getElementById(\'ts\').textContent=\'Actualizado: \'+d.timestamp;' +
'  renderAlertas(d.alertas);' +
'  renderKPIs(d.kpis);' +
'  renderChartProd(d.ventasProd);' +
'  renderChartDias(d.ventasDia);' +
'  allPedidos = d.pedidos;' +
'  renderFiltros();' +
'  renderPedidos(allPedidos, filtroActual);' +
'  renderClientes(d.clientes);' +
'}' +

'function renderAlertas(alertas){' +
'  var el = document.getElementById(\'alertas-banner\');' +
'  if(!alertas || !alertas.length){el.innerHTML=\'\';return;}' +
'  var html = \'\';' +
'  alertas.forEach(function(a){' +
'    var tipo = a.estado===\'PAGO_PENDIENTE\' ? \'Pago pendiente de confirmar\' : \'Pedido WhatsApp por atender\';' +
'    html += \'<div class="alerta-item"><div class="alerta-txt"><strong>\'+tipo+\'</strong> &mdash; \'+' +
'    a.nombre+\' &mdash; \'+formatCOP(a.total)+\' &mdash; <span class="mono">\'+a.id+\'</span></div>\'+' +
'    \'<button class="alerta-ver" onclick="openModal(\'+encodeData(a)+\')">Ver</button></div>\';' +
'  });' +
'  el.innerHTML = html;' +
'}' +

'function renderKPIs(k){' +
'  var mes = new Date().toLocaleDateString(\'es-CO\',{month:\'long\'});' +
'  document.getElementById(\'kpis\').innerHTML =' +
'  \'<div class="kpi"><div class="kpi-label">Ingresos totales</div><div class="kpi-value gold">\'+formatCOP(k.totalIngresos)+\'</div><div class="kpi-sub">acumulado hist&oacute;rico</div></div>\'+' +
'  \'<div class="kpi"><div class="kpi-label">Ingresos \'+mes+\'</div><div class="kpi-value">\'+formatCOP(k.ingresosMes)+\'</div><div class="kpi-sub">\'+k.pedidosMes+\' pedidos pagados</div></div>\'+' +
'  \'<div class="kpi"><div class="kpi-label">Total pedidos</div><div class="kpi-value">\'+k.totalPedidos+\'</div><div class="kpi-sub">desde el inicio</div></div>\'+' +
'  \'<div class="kpi"><div class="kpi-label">Clientes</div><div class="kpi-value">\'+k.totalClientes+\'</div><div class="kpi-sub">registrados</div></div>\'+' +
'  \'<div class="kpi"><div class="kpi-label">Pendientes</div><div class="kpi-value \'+( k.pendientes > 0 ? \'alert\' : \'\')+\'">\'+k.pendientes+\'</div><div class="kpi-sub">\'+( k.pendientes > 0 ? \'Requieren atenci&oacute;n\' : \'Todo al d&iacute;a\')+\'</div></div>\';' +
'}' +

'function renderChartProd(vp){' +
'  var labels=[], vals=[], colors=[\'#C8962E\',\'#8B6F2E\',\'#5D4A20\',\'#3D3018\',\'#2C2010\'];' +
'  Object.keys(vp).forEach(function(k){ if(vp[k]>0){labels.push(k);vals.push(vp[k]);}});' +
'  if(chartProd){chartProd.destroy();}' +
'  var ctx = document.getElementById(\'chart-prod\').getContext(\'2d\');' +
'  chartProd = new Chart(ctx,{type:\'doughnut\',data:{labels:labels,datasets:[{data:vals,backgroundColor:colors.slice(0,vals.length),borderColor:\'#1A0F08\',borderWidth:3,hoverOffset:6}]},' +
'  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:\'bottom\',labels:{color:\'rgba(250,245,238,.6)\',font:{size:12},padding:12,boxWidth:12}},' +
'  tooltip:{callbacks:{label:function(c){return \' \'+c.label+\': \'+formatCOP(c.raw);}}}}}});' +
'}' +

'function renderChartDias(vd){' +
'  var keys=Object.keys(vd).sort();' +
'  var labels=keys.map(function(k){var p=k.split(\'-\');return p[2]+\'/\'+p[1];});' +
'  var vals=keys.map(function(k){return vd[k];});' +
'  if(chartDias){chartDias.destroy();}' +
'  if(!keys.length){' +
'    document.getElementById(\'chart-dias\').parentElement.innerHTML=\'<div class="chart-title">Ingresos &uacute;ltimos 30 d&iacute;as</div><div class="empty">Sin ventas registradas a&uacute;n</div>\';return;' +
'  }' +
'  var ctx=document.getElementById(\'chart-dias\').getContext(\'2d\');' +
'  var grad=ctx.createLinearGradient(0,0,0,220);' +
'  grad.addColorStop(0,\'rgba(200,150,46,.3)\');grad.addColorStop(1,\'rgba(200,150,46,0)\');' +
'  chartDias=new Chart(ctx,{type:\'line\',data:{labels:labels,datasets:[{data:vals,borderColor:\'#C8962E\',backgroundColor:grad,borderWidth:2,pointRadius:3,pointBackgroundColor:\'#C8962E\',tension:.3,fill:true}]},' +
'  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},' +
'  tooltip:{callbacks:{label:function(c){return \' \'+formatCOP(c.raw);}}}},' +
'  scales:{x:{ticks:{color:\'rgba(250,245,238,.4)\',font:{size:11}},grid:{color:\'rgba(255,255,255,.05)\'}},' +
'  y:{ticks:{color:\'rgba(250,245,238,.4)\',font:{size:11},callback:function(v){return formatCOPShort(v);}},grid:{color:\'rgba(255,255,255,.05)\'}}}}});' +
'}' +

'var FILTROS_DEF=[{k:\'TODOS\',l:\'Todos\'},{k:\'PAGADO\',l:\'Pagados\'},{k:\'WHATSAPP_PENDIENTE\',l:\'WhatsApp\'},{k:\'PAGO_PENDIENTE\',l:\'Pago pendiente\'},{k:\'ENVIADO\',l:\'Enviados\'},{k:\'CANCELADO\',l:\'Cancelados\'}];' +
'function renderFiltros(){' +
'  var html=\'\';' +
'  FILTROS_DEF.forEach(function(f){' +
'    var cnt=f.k===\'TODOS\'?allPedidos.length:allPedidos.filter(function(p){return p.estado===f.k;}).length;' +
'    html+=\'<button class="f-btn\'+( filtroActual===f.k?\' active\':\'\')+\'" onclick="setFiltro(\\\'\'+f.k+\'\\\')">\'+f.l+\' (\'+cnt+\')</button>\';' +
'  });' +
'  document.getElementById(\'filtros\').innerHTML=html;' +
'}' +

'function setFiltro(k){filtroActual=k;renderFiltros();renderPedidos(allPedidos,k);}' +

'function renderPedidos(pedidos,filtro){' +
'  var list=filtro===\'TODOS\'?pedidos:pedidos.filter(function(p){return p.estado===filtro;});' +
'  if(!list.length){document.getElementById(\'tbl-pedidos\').innerHTML=\'<div class="empty">No hay pedidos en este filtro.</div>\';return;}' +
'  var html=\'<table><thead><tr><th>ID Pedido</th><th>Fecha</th><th>Cliente</th><th>Ciudad</th><th>Productos</th><th>Total</th><th>Estado</th></tr></thead><tbody>\';' +
'  list.slice(0,60).forEach(function(p){' +
'    html+=\'<tr onclick="openModal(\'+encodeData(p)+\')">\'+' +
'    \'<td><span class="mono">\'+p.id+\'</span></td>\'+' +
'    \'<td style="font-size:12px;color:rgba(250,245,238,.5)">\'+p.fecha.substring(0,10)+\'</td>\'+' +
'    \'<td><strong>\'+p.nombre+\'</strong></td>\'+' +
'    \'<td style="font-size:12px;color:rgba(250,245,238,.5)">\'+p.ciudad+\'</td>\'+' +
'    \'<td style="font-size:12px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\'+p.prods+\'</td>\'+' +
'    \'<td style="font-weight:700;color:#C8962E;white-space:nowrap">\'+formatCOP(p.total)+\'</td>\'+' +
'    \'<td><span class="badge badge-\'+p.estado+\'">\'+estadoLabel(p.estado)+\'</span></td>\'+' +
'    \'</tr>\';' +
'  });' +
'  html+=\'</tbody></table>\';' +
'  document.getElementById(\'tbl-pedidos\').innerHTML=html;' +
'}' +

'function renderClientes(clientes){' +
'  if(!clientes||!clientes.length){document.getElementById(\'tbl-clientes\').innerHTML=\'<div class="empty">Sin clientes registrados.</div>\';return;}' +
'  var html=\'<table><thead><tr><th>#</th><th>Nombre</th><th>Ciudad</th><th>Tel&eacute;fono</th><th>Pedidos</th><th>Total acumulado</th><th>&Uacute;ltima compra</th></tr></thead><tbody>\';' +
'  clientes.forEach(function(c,i){' +
'    html+=\'<tr>\'+' +
'    \'<td><span class="cliente-rank">\'+( i+1)+\'</span></td>\'+' +
'    \'<td><strong>\'+c.nombre+\'</strong><br><span style="font-size:11px;color:rgba(250,245,238,.4)">\'+c.email+\'</span></td>\'+' +
'    \'<td style="font-size:12px;color:rgba(250,245,238,.5)">\'+c.ciudad+\'</td>\'+' +
'    \'<td><span class="mono">\'+c.telefono+\'</span></td>\'+' +
'    \'<td style="text-align:center;font-weight:700">\'+c.totalPedidos+\'</td>\'+' +
'    \'<td style="font-weight:700;color:#C8962E">\'+formatCOP(c.totalAcum)+\'</td>\'+' +
'    \'<td style="font-size:12px;color:rgba(250,245,238,.4)">\'+c.ultimaCompra.substring(0,10)+\'</td>\'+' +
'    \'</tr>\';' +
'  });' +
'  html+=\'</tbody></table>\';' +
'  document.getElementById(\'tbl-clientes\').innerHTML=html;' +
'}' +

'function openModal(p){' +
'  if(typeof p===\'string\')p=JSON.parse(p);' +
'  document.getElementById(\'modal-title\').textContent=\'Pedido \'+p.id;' +
'  var b=\'<div class="m-section"><div class="m-section-title">Resumen</div>\'+' +
'    row(\'Estado\',\'<span class="badge badge-\'+p.estado+\'">\'+estadoLabel(p.estado)+\'</span>\')+' +
'    row(\'Fecha\',p.fecha)+' +
'    row(\'Total\',\'<strong style="color:#C8962E">\'+formatCOP(p.total)+\'</strong>\')+' +
'    row(\'M&eacute;todo\',p.txnId && p.txnId.length>2 ? \'&#128179; Wompi (\'+p.txnId+\')\' : \'&#128172; WhatsApp\')+' +
'    \'</div>\'+' +
'    \'<div class="m-section"><div class="m-section-title">Productos</div>\'+' +
'    \'<p style="font-size:13px;color:rgba(250,245,238,.8);line-height:1.7">\'+p.prods+\'</p></div>\'+' +
'    \'<div class="m-section"><div class="m-section-title">Cliente</div>\'+' +
'    row(\'Nombre\',p.nombre)+' +
'    row(\'Email\',p.email)+' +
'    row(\'Tel&eacute;fono\',p.tel)+' +
'    \'</div>\'+' +
'    \'<div class="m-section"><div class="m-section-title">Env&iacute;o</div>\'+' +
'    row(\'Direcci&oacute;n\',p.dir+(p.comp?\', \'+p.comp:\'\'))+' +
'    row(\'Ciudad\',p.ciudad+\', \'+p.depto)+' +
'    (p.factura===\'S&iacute;\' ? row(\'Factura\',p.tipoDoc+\': \'+p.numDoc+(p.razon?\' / \'+p.razon:\'\')) : \'\')+' +
'    \'</div>\';' +
'  document.getElementById(\'modal-body\').innerHTML=b;' +
'  var ac=\'\', st=p.estado;' +
'  if(st===\'PAGO_PENDIENTE\'||st===\'WHATSAPP_PENDIENTE\')' +
'    ac+=\'<button class="act-btn act-pagado" onclick="marcarEstado(\'+p.fila+\',\\\'PAGADO\\\',\'+encodeData(p)+\')">&#10003; Marcar como PAGADO</button>\';' +
'  if(st===\'PAGADO\')' +
'    ac+=\'<button class="act-btn act-enviado" onclick="marcarEstado(\'+p.fila+\',\\\'ENVIADO\\\',\'+encodeData(p)+\')">&#128666; Marcar como ENVIADO</button>\';' +
'  if(st!==\'CANCELADO\'&&st!==\'ENVIADO\')' +
'    ac+=\'<button class="act-btn act-cancelado" onclick="marcarEstado(\'+p.fila+\',\\\'CANCELADO\\\',\'+encodeData(p)+\')">Cancelar pedido</button>\';' +
'  if(p.tel)' +
'    ac+=\'<a href="https://wa.me/\'+p.tel.replace(/[^0-9]/g,\'\')+\'" target="_blank" style="display:block;flex:1;min-width:140px"><button class="act-btn" style="background:rgba(37,211,102,.15);color:#4ade80;border:1px solid rgba(37,211,102,.25);width:100%">&#128172; WhatsApp</button></a>\';' +
'  document.getElementById(\'modal-actions\').innerHTML=ac;' +
'  document.getElementById(\'modal-overlay\').classList.add(\'open\');' +
'}' +

'function closeModal(){document.getElementById(\'modal-overlay\').classList.remove(\'open\');}' +

'function marcarEstado(fila,estado,pedido){' +
'  if(!confirm(\'¿Cambiar estado a \'+estado+\'?\'))return;' +
'  google.script.run.withSuccessHandler(function(r){' +
'    if(r.error){alert(\'Error: \'+r.error);return;}' +
'    closeModal();' +
'    loadData();' +
'  }).withFailureHandler(function(e){alert(\'Error: \'+e.message);}).cambiarEstado(PIN,fila,estado);' +
'}' +

'function switchTab(name,btn){' +
'  document.getElementById(\'tab-pedidos\').style.display=name===\'pedidos\'?\'block\':\'none\';' +
'  document.getElementById(\'tab-clientes\').style.display=name===\'clientes\'?\'block\':\'none\';' +
'  document.querySelectorAll(\'.tab-btn\').forEach(function(b){b.classList.remove(\'active\');});' +
'  btn.classList.add(\'active\');' +
'}' +

'function row(l,v){return \'<div class="m-row"><span class="lbl">\'+l+\'</span><span class="val">\'+v+\'</span></div>\';}' +
'function estadoLabel(e){var m={PAGADO:\'Pagado\',ENVIADO:\'Enviado\',PAGO_PENDIENTE:\'Pago pendiente\',WHATSAPP_PENDIENTE:\'WhatsApp pendiente\',CANCELADO:\'Cancelado\'};return m[e]||e;}' +
'function formatCOP(n){return \'$\'+Number(n||0).toLocaleString(\'es-CO\');}' +
'function formatCOPShort(n){if(n>=1000000)return \'$\'+(n/1000000).toFixed(1)+\'M\';if(n>=1000)return \'$\'+(n/1000).toFixed(0)+\'k\';return \'$\'+n;}' +
'function encodeData(obj){return JSON.stringify(obj).replace(/&/g,\'&amp;\').replace(/\'/g,"&#39;").replace(/"/g,\'&quot;\');}' +

/* auto-refresh cada 2 min */
'setInterval(function(){if(PIN)loadData();},120000);' +
'<\/script></body></html>';
