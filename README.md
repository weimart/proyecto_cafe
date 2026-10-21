# Esencia y Taza — tienda web

Tienda de **Esencia y Taza**, café de origen de Caicedo y Santa Rosa de Osos,
Antioquia (Colombia). En línea en **https://esenciaytaza.com**.

## Carpetas

| Carpeta | Qué hay | ¿Se publica? |
|---|---|---|
| `portal-mercado/` | La web: páginas, imágenes, CSS y JS, `robots.txt`, `sitemap.xml` | Sí, Netlify publica solo esta carpeta (`netlify.toml`) |
| `backend/` | `pedidos.gs` (pedidos y pagos Wompi) y `dashboard.gs` (panel de ventas) | No. Se copian a mano en Google Apps Script |
| `herramientas/` | `generar-marca.js`, regenera logos y favicons | No |
| `marca/`, `img/` | Manual de marca, logos y piezas de campaña | No |
| `plantilla-control/` | Plantillas CSV de ventas, gastos y clientes | No |
| `archivo/` | Prototipos y versiones anteriores, solo de consulta | No |

`index.html` y `links.html` en la raíz solo redirigen a esenciaytaza.com, por si
alguien llega por la dirección antigua de GitHub Pages.

## Publicar cambios

1. Cambios en `portal-mercado/`: abrir un pull request; Netlify crea una vista previa.
   Al fusionar en `main` se publica en esenciaytaza.com.
2. Cambios en `backend/`: pegar el archivo en su proyecto de Apps Script y publicar una
   **nueva versión** de la implementación existente (así la URL no cambia).
3. `/assets/*` se guarda en caché un año: al cambiar un CSS o JS, sube el `?v=` con que
   lo carga el HTML.

Las llaves de Wompi y el PIN del panel van en *Propiedades del script*, nunca en el código.
Detalle de la puesta en marcha del pago: `PASOS-publicar-pagos-2026-10-21.md`.
