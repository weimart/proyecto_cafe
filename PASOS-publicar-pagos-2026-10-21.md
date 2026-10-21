# Cómo publicar los cambios del pago en línea (21 oct 2026)

Los archivos ya están corregidos en esta carpeta. Para que funcionen en la tienda
hay que hacer estos 5 pasos, en este orden. Toma unos 20 minutos.
Los originales quedaron guardados en `respaldo-2026-10-21/`.

## 1. Actualizar el script de pedidos (Google Apps Script)

1. Abre en script.google.com el proyecto de **pedidos**: es el que publica la URL
   que termina en `...FwU/exec`.
2. Borra el código y pega todo el contenido de `portal-mercado/pedidos.gs`.
3. Ve a **Configuración del proyecto** (engranaje) → **Propiedades del script** y agrega dos:
   - `WOMPI_INTEGRITY_SECRET` → en el panel de Wompi: *Desarrolladores → Secretos para integración técnica → Integridad*.
   - `WOMPI_EVENTS_SECRET` → en el mismo lugar: *Eventos*.
4. **Implementar → Gestionar implementaciones →** lápiz sobre la implementación actual →
   *Versión: Nueva versión* → **Implementar**. Así la URL no cambia.

## 2. Activar el webhook en Wompi

En el panel de Wompi (modo **Producción**): *Desarrolladores → URL de eventos* →
pega la misma URL del script de pedidos (la que termina en `/exec`) y guarda.

Con esto, un pago aprobado queda como PAGADO en la hoja y te llega el correo
aunque el cliente cierre la pestaña. Wompi puede reintentar el aviso varias veces;
no pasa nada, el script lo procesa una sola vez.

## 3. Publicar la web en Netlify

Sube la carpeta `portal-mercado` como lo hacen siempre. Cambiaron:
`index.html`, `gracias.html`, `terminos.html`, `assets/js/main.js`,
`assets/js/gracias.js` y `assets/css/styles.css`.

## 4. Apagar el script viejo de firma

En script.google.com abre el proyecto **wompi-firma** → *Implementar → Gestionar
implementaciones* → **Archivar**. Ya no se usa: firmaba cualquier monto.

## 5. Compra de prueba

Compra una bolsa de 125 g con tu propia tarjeta o Nequi y revisa:
- El carrito y Wompi muestran **$32.000** (20.000 + 12.000 de envío).
- La hoja de Pedidos pasa de PAGO_PENDIENTE a **PAGADO** sola, aunque cierres la pestaña al pagar.
- Te llegan los dos correos (vendedor y cliente).

## Si cambias precios o envío

Hay que cambiarlos en **dos sitios**: `PRECIOS` y `ENVIO` en `pedidos.gs` (lo que se
cobra) y `PRESENTACIONES` y `ENVIO` en `main.js` (lo que se muestra). Después repite los pasos 1 y 3.
