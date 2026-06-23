// ============================================================
// ESENCIA Y TAZA — Firma de integridad Wompi
// Desplegar en: https://script.google.com
// ============================================================
// INSTRUCCIONES:
//  1. Abre https://script.google.com  →  "Nuevo proyecto"
//  2. Borra el código existente y pega TODO este archivo
//  3. Clic en  Implementar → Nueva implementación
//     - Tipo: Aplicación web
//     - Ejecutar como: Yo
//     - Quién tiene acceso: Cualquier usuario
//  4. Copiar la URL de implementación
//  5. En main.js, pegar la URL en:  WOMPI.scriptUrl = 'URL_AQUI'
// ============================================================

const INTEGRITY_SECRET = 'prod_integrity_qrtppfzColAXQQ80cCZLx35SQarxMQ9h';

function doGet(e) {
  const ref    = (e.parameter.ref    || '').trim();
  const amount = (e.parameter.amount || '').trim();
  const cur    = (e.parameter.cur    || 'COP').trim();

  if (!ref || !amount) {
    return json({ error: 'Faltan parámetros: ref y amount son obligatorios' });
  }

  // SHA-256( referencia + monto_en_centavos + moneda + llave_integridad )
  const cadena = ref + amount + cur + INTEGRITY_SECRET;
  const bytes  = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, cadena);
  const hash   = bytes.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');

  return json({ signature: hash });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
