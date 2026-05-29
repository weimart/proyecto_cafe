# 📊 Plantilla de Control — Esencia y Taza

Sistema de control de **ventas, gastos, clientes y proveedores** para tu
negocio, hecho en Google Sheets (gratis, viene con tu Workspace).

> ⚠️ **GUARDA ESTE ARCHIVO EN GOOGLE DRIVE** una vez montado, para no
> volver a perderlo. La versión local en el computador es solo la plantilla.

## 🚀 Cómo montarlo en tu Google Drive (10-15 minutos)

### Paso 1 — Crear el Sheets en blanco
1. Entra a **sheets.google.com** con `comercial@esenciaytaza.com`
2. Crea un nuevo Sheets en blanco
3. Ponle de nombre: **Esencia y Taza - Control**

### Paso 2 — Importar las 5 hojas (CSV)
Recibes 5 archivos CSV. Importa cada uno como una hoja del Sheets:

| Archivo | Nombre de la hoja en Sheets |
|---|---|
| `1-VENTAS.csv` | `VENTAS` |
| `2-GASTOS.csv` | `GASTOS` |
| `3-CLIENTES.csv` | `CLIENTES` |
| `4-PROVEEDORES.csv` | `PROVEEDORES` |
| `5-RESUMEN.csv` | `RESUMEN` |

Para cada uno:
1. En tu Sheets: menú **Archivo → Importar**
2. Pestaña **Subir** → selecciona el CSV
3. En "Ubicación de importación" elige: **"Insertar nuevas hojas"**
4. Confirma. Queda como una nueva hoja.

> 💡 IMPORTANTE: el nombre exacto de cada hoja debe ser VENTAS, GASTOS,
> CLIENTES, PROVEEDORES y RESUMEN (en mayúsculas, sin el número), porque
> las fórmulas del RESUMEN llaman a las hojas por ese nombre.

### Paso 3 — Activar las fórmulas del RESUMEN
La hoja **RESUMEN** trae las fórmulas como texto (columna C). Para activarlas:
1. Abre la hoja **RESUMEN**
2. Copia el texto de la columna C (ej: `=SUMA(VENTAS!I:I)`)
3. Pégalo en la columna B de esa misma fila
4. Cuando todas estén pegadas, oculta la columna C (clic derecho → Ocultar)

> 💡 La primera fórmula puede pedir autorizar acceso a las otras hojas — acepta.

### Paso 4 — Borrar las filas de ejemplo
Cada hoja trae filas marcadas con "Ejemplo:". Bórralas al empezar con datos reales.

### Paso 5 — Compartir con el equipo
Botón **"Compartir"** → agrega los correos del equipo (Editor o Lector).

---

## 📋 Las 5 hojas y para qué sirve cada una

### 🟢 VENTAS — cada pedido que entra
Fecha · Cliente · WhatsApp · Ciudad · Producto · Cantidad · Precio · Total ·
Método pago · Estado · Guía · Costo envío · Notas.
- **Total** se calcula con: `=G2*H2` (cantidad × precio)
- **Estado:** Cotizando / Pagado-pendiente envío / Enviado / Entregado / Devuelto

### 🔴 GASTOS — cada peso que sale
Fecha · Categoría · Detalle · Monto · **Proveedor** · Método · Comprobante · Notas.
- **Categorías:** Materia prima, Empaque, Envíos, Marketing, Servicios, Impuestos, Otros
- **Proveedor:** enlaza con la hoja PROVEEDORES (usa el mismo nombre)

### 🔵 CLIENTES — quién compra
Una fila por persona. Si vuelve a comprar, actualiza sus columnas (no creas fila nueva).
- **Total comprado** automático: `=SUMAR.SI(VENTAS!C:C; B2; VENTAS!I:I)`

### 🟣 PROVEEDORES — a quién le compras (NUEVO)
Proveedor · Qué provee · Contacto · Tel · Ubicación · Producto/Servicio ·
Precio referencia · Última compra · Calificación · Notas.
- Te sirve para: tener a mano contactos, comparar precios, evaluar calidad,
  saber a quién pedirle cada insumo (café verde, empaque, etiquetas, envíos)
- La **Calificación (1-5)** te ayuda a decidir con quién seguir trabajando

### 🟡 RESUMEN — tu panel automático
Se llena solo. Te muestra: ventas/gastos/utilidad (total y del mes), ticket
promedio, ventas por producto, por método de pago, gastos por categoría,
total de clientes y proveedores.

---

## ⚙️ Automatización futura (cuando haya Wompi real)
- Los pedidos pagados en la web se escribirán SOLOS en la hoja VENTAS
  (vía webhook de Wompi + Google Apps Script — gratis, lo arma Claude)
- Los pedidos por WhatsApp seguirán siendo registro manual o vía Google Form

## 🛡️ Buenas prácticas
- **No borrar filas:** marca "Cancelado" en Estado si no se concretó. Conservas historial.
- **Una persona ingresa las ventas** al inicio, para evitar duplicados.
- **Revisar RESUMEN cada lunes** — 5 min, mucho aprendizaje.
- **Copia de seguridad mensual:** Archivo → Crear una copia → carpeta "Respaldos".
- **GUARDARLO EN DRIVE** para no volver a perderlo (esta vez subirlo de una).
- **No poner contraseñas ni datos de tarjetas** en el Sheets.
