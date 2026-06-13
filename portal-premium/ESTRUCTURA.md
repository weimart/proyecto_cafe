# 📚 GUÍA DE ESTRUCTURA DEL PROYECTO

## 📁 Árbol Completo

```
PROJECT_VSCODE/
│
├── 📄 README.md                    ← Instrucciones principales
├── 📄 QUICKSTART.md                ← Inicio rápido (5 min)
├── 📄 package.json                 ← Dependencias npm
├── 📄 .gitignore                   ← Archivos para ignorar en Git
├── 📄 .editorconfig                ← Configuración de editor
│
├── .vscode/                        ← Configuración VS Code
│   ├── settings.json               ← Preferencias del editor
│   ├── extensions.json             ← Extensiones recomendadas
│   └── launch.json                 ← Configuración de debug
│
└── src/                            ← CÓDIGO FUENTE PRINCIPAL
    ├── index.html                  ← ⭐ PÁGINA PRINCIPAL
    │
    └── assets/
        ├── css/
        │   └── styles.css          ← ⭐ TODOS LOS ESTILOS
        │
        ├── js/
        │   └── main.js             ← ⭐ INTERACTIVIDAD
        │
        └── images/                 ← Tu carpeta de imágenes
            ├── cafe-1.jpg
            ├── cafe-2.jpg
            ├── cafe-3.jpg
            ├── cafetal.jpg
            ├── hero-bg.jpg
            ├── story-1.jpg
            ├── story-2.jpg
            ├── story-3.jpg
            ├── story-4.jpg
            └── logo.png
```

---

## 🔑 Archivos Clave para Editar

### 1️⃣ `src/index.html` (Contenido)
**Qué editar:**
- Textos (títulos, descripciones)
- Links de navegación
- Información de contacto
- Meta tags
- Schema.org

**Estructura:**
```html
<header>Navegación</header>
<main>
  <section>Hero</section>
  <section>Origen</section>
  <section>Trazabilidad</section>
  <section>Productos</section>
  <section>Historias</section>
</main>
<footer>Información</footer>
```

### 2️⃣ `src/assets/css/styles.css` (Diseño)
**Qué editar:**
- Variables CSS (colores, fuentes)
- Tamaños de componentes
- Breakpoints responsivos
- Animaciones
- Sombras y bordes

**Estructura:**
```css
:root { /* Variables */ }
* { /* Reset */ }
body { /* Estilos base */ }
.container { /* Layout */ }
h1, h2, h3... { /* Tipografía */ }
.hero { /* Secciones */ }
@media (max-width: 768px) { /* Responsive */ }
```

### 3️⃣ `src/assets/js/main.js` (Interactividad)
**Qué editar:**
- Funciones del carrito
- Interactividad de elementos
- Validación de formularios
- Lazy loading
- Eventos

**Módulos:**
```javascript
const Cart = { /* Carrito */ }
const Lots = { /* Trazabilidad */ }
const Navigation = { /* Menú */ }
const Products = { /* Productos */ }
const LazyLoad = { /* Imágenes */ }
const Animations = { /* Efectos */ }
const FormValidation = { /* Formularios */ }
```

---

## 🎨 Cambios Rápidos

### Cambiar Color Principal
**Archivo:** `src/assets/css/styles.css`
**Busca:** `:root`
**Edita:**
```css
--color-dark: #3D2817;    /* Aquí tu color */
```

### Cambiar Nombre de la Marca
**Archivo:** `src/index.html`
**Busca:** `Esencia y Taza`
**Reemplaza:** Con tu nombre

### Cambiar Logo
**Archivo:** `src/index.html`
**Busca:** `☕ Esencia y Taza`
**Edita:** El emoji o imagen

### Cambiar Producto
**Archivo:** `src/index.html`
**Busca:** `<article class="product-card">`
**Edita:**
- Nombre
- Precio
- Descripción
- Imagen

---

## 📝 Flujo de Edición Típico

### 1. Editar Contenido (HTML)
```
VS Code → Abre src/index.html
         → Edita textos
         → Guarda (Ctrl+S)
         → Navegador se actualiza automáticamente
```

### 2. Cambiar Diseño (CSS)
```
VS Code → Abre src/assets/css/styles.css
         → Edita estilos
         → Guarda (Ctrl+S)
         → Navegador se actualiza automáticamente
```

### 3. Agregar Interactividad (JS)
```
VS Code → Abre src/assets/js/main.js
         → Edita funciones
         → Guarda (Ctrl+S)
         → Recarga navegador (F5)
```

### 4. Agregar Imágenes
```
Carpeta → Copia imagen a src/assets/images/
HTML    → Agrega <img src="./assets/images/...">
CSS     → Ajusta tamaño si necesario
```

---

## ⌨️ Atajos VS Code

| Atajo | Acción |
|-------|--------|
| `Ctrl+S` | Guardar |
| `Ctrl+Shift+S` | Guardar todo |
| `Ctrl+Z` | Deshacer |
| `Ctrl+Y` | Rehacer |
| `Ctrl+F` | Buscar |
| `Ctrl+H` | Buscar y reemplazar |
| `Ctrl+/` | Comentar línea |
| `Alt+Shift+F` | Formatear documento |
| `Ctrl+D` | Seleccionar palabra |
| `Ctrl+L` | Seleccionar línea |
| `Alt+↑/↓` | Mover línea |
| `Ctrl+Shift+K` | Eliminar línea |

---

## 🚀 Comandos npm

```bash
# Iniciar servidor local
npm start

# Desarrollo con auto-reload
npm run dev

# Minificar y compilar
npm run build

# Limpiar y optimizar
npm run minify

# Ver package.json para todos los comandos
npm run
```

---

## 📐 Tamaños Importantes

### Breakpoints Responsive
```css
xs    0px      (Móvil pequeño)
sm  576px      (Móvil)
md  768px      (Tablet)
lg  992px      (Desktop)
xl 1280px      (Desktop grande)
2xl1536px      (Ultra-wide)
```

### Espaciado Estándar
```css
--spacing-4:  1rem    (16px)
--spacing-6:  1.5rem  (24px)
--spacing-8:  2rem    (32px)
--spacing-12: 3rem    (48px)
--spacing-16: 4rem    (64px)
```

### Tamaños de Fuente
```css
h1: 3.5rem    (56px)
h2: 2.5rem    (40px)
h3: 1.875rem  (30px)
p:  1rem      (16px)
```

---

## 🎯 SEO & Meta Tags

**Editar en** `src/index.html` (dentro de `<head>`):

```html
<title>Esencia y Taza - Café Artesanal</title>
<meta name="description" content="Descripción corta...">
<meta name="keywords" content="café, artesanal, origen">
<meta name="author" content="Tu nombre">
```

---

## 📞 Información de Contacto

**Editar en** `src/index.html`:

Busca y reemplaza:
```html
+57-4-XXXXXXXX        ← Tu teléfono
hola@esenciaytaza.com ← Tu email
Calle Principal 123   ← Tu dirección
```

---

## 🔗 Enlaces Sociales

**Editar en** `src/index.html` (Footer):

```html
<a href="https://instagram.com/tu-usuario">Instagram</a>
<a href="https://facebook.com/tu-usuario">Facebook</a>
<a href="https://twitter.com/tu-usuario">Twitter</a>
```

---

## ✅ Checklist Antes de Publicar

- [ ] Cambiaste todos los textos placeholder
- [ ] Actualizaste información de contacto
- [ ] Agregaste tus imágenes reales
- [ ] Personalizaste colores
- [ ] Probaste en móvil (F12)
- [ ] Validaste HTML (validator.w3.org)
- [ ] Probaste Google Lighthouse (>90)
- [ ] Comprobaste enlaces funcionales
- [ ] Testeaste formularios
- [ ] Verificaste rendimiento

---

## 📚 Referencia Rápida de Clases CSS

```css
.container          /* Contenedor máx 1200px */
.section            /* Secciones principales */
.btn                /* Botones */
.btn-primary        /* Botón primario */
.btn-secondary      /* Botón secundario */
.product-card       /* Tarjeta de producto */
.story-card         /* Tarjeta de historia */
.hero               /* Sección hero */
.origin-content     /* Contenido origen */
.stats              /* Cuadros de stats */
.footer             /* Pie de página */
```

---

**¿Necesitas ayuda?** Lee `QUICKSTART.md` o `README.md`

**¿Listo para empezar?** Abre `src/index.html` en Live Server y ¡edita!

---

Versión: 1.0 | Status: Listo para producción
