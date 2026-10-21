# Cómo publicar los cambios del pago en línea (21 oct 2026)

Los archivos ya están corregidos en esta carpeta. Para que funcionen en la tienda
hay que hacer estos 5 pasos, en este orden. Toma unos 20 minutos.
Los originales quedaron guardados en `respaldo-2026-10-21/`.

## 1. Actualizar el script de pedidos (Google Apps Script)

1. Abre en script.google.com el proyecto de **pedidos**: es el que publica la URL
   que termina en `...FwU/exec`.
2. Borra el código y pega todo el contenido de `backend/pedidos.gs`.
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

## 3. Proteger el panel de ventas

El panel publicado en Apps Script es más nuevo que `backend/dashboard.gs` (tiene clave
propia, marketing e inventario). **No pegues `backend/dashboard.gs` encima**: es la
versión 1.0 y borraría esas funciones.

1. *Implementar → Gestionar implementaciones* → lápiz → **Quién puede acceder: Solo yo** →
   *Nueva versión* → **Implementar**.
2. Confirma que la clave del panel publicado no sea el PIN viejo (2025), que estaba
   publicado en el código.
3. Pendiente: pasar al panel publicado las protecciones contra inyección de HTML (XSS)
   que tiene `backend/dashboard.gs` (función `_escD` y `encodeData`).

## 3b. Publicar la web

Fusiona el pull request en GitHub: Netlify publica `portal-mercado/` solo.
Los scripts de Apps Script ahora están en `backend/` y ya no se publican en la web.

## 4. Apagar el script viejo de firma

En script.google.com abre el proyecto **wompi-firma** → *Implementar → Gestionar
implementaciones* → **Archivar**. Ya no se usa: firmaba cualquier monto.

## 5. Compra de prueba

Compra una bolsa de 125 g con tu propia tarjeta o Nequi y revisa:
- El carrito y Wompi muestran **$32.000** (20.000 + 12.000 de envío).
- La hoja de Pedidos pasa de PAGO_PENDIENTE a **PAGADO** sola, aunque cierres la pestaña al pagar.
- Te llegan los dos correos (vendedor y cliente).

## Si cambias precios o envío

Lo que **se cobra** está en un solo sitio: `PRECIOS` y `ENVIO` en `backend/pedidos.gs`
(después repite el paso 1). El precio también se **muestra** en estos sitios; cámbialo en todos:

- `portal-mercado/assets/js/main.js` → `PRESENTACIONES` y `ENVIO`
- `portal-mercado/index.html` → meta descripción ("desde $20.000"), los dos bloques de
  datos para Google (`"price"` y `shippingRate`), la nota del carrito y la pregunta frecuente de envíos
- `portal-mercado/link.html` → las cuatro tarjetas de producto
- `portal-mercado/terminos.html` → sección 4 (envío)
- `backend/pedidos.gs` → las tarjetas de productos del correo al cliente

Si se te pasa uno, se cobra bien igual: solo quedaría un texto desactualizado.
