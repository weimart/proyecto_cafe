# ☕ ESENCIA Y TAZA - Proyecto Web
## Código Listo para Visual Studio Code

---

## 🚀 INICIO RÁPIDO

### 1. **Abrir en Visual Studio Code**

#### Opción A: Más Fácil (Recomendado)
```bash
# Abre VS Code y arrastra la carpeta del proyecto
# O usa el menú: File → Open Folder
# Selecciona la carpeta: PROJECT_VSCODE
```

#### Opción B: Desde Terminal
```bash
# Abre la terminal en la carpeta del proyecto
cd PROJECT_VSCODE

# Abre en VS Code
code .
```

#### Opción C: Desde VS Code
```
Ctrl+K Ctrl+O (Windows/Linux)
Cmd+K Cmd+O (Mac)
→ Selecciona la carpeta PROJECT_VSCODE
```

---

## 📁 **ESTRUCTURA DEL PROYECTO**

```
PROJECT_VSCODE/
├── .vscode/
│   └── settings.json          ← Configuración de VS Code
├── src/
│   ├── index.html             ← Página principal
│   └── assets/
│       ├── css/
│       │   └── styles.css     ← Estilos completos
│       ├── js/
│       │   └── main.js        ← JavaScript funcional
│       └── images/            ← Carpeta para imágenes
├── .gitignore                 ← Archivos a ignorar en Git
├── package.json               ← Configuración de npm
└── README.md                  ← Este archivo
```

---

## ⚙️ **INSTALACIÓN & CONFIGURACIÓN**

### Paso 1: Instalar Node.js (si no lo tienes)
Descarga desde: https://nodejs.org/ (versión LTS)

### Paso 2: Instalar dependencias
```bash
# En la terminal de VS Code (Ctrl+`)
npm install
```

### Paso 3: Instalar extensiones recomendadas en VS Code

Abre VS Code y ve a `Extensions` (Ctrl+Shift+X) e instala:

- **Live Server** (ritwickdey.LiveServer)
  - Para abrir servidor local en tiempo real
- **Prettier** (esbenp.prettier-vscode)
  - Para formatear código automáticamente
- **HTML CSS Support** (ecmel.vscode-html-css)
  - Autocompletado de CSS en HTML
- **JavaScript (ES6) code snippets** (xabikos.JavaScriptSnippets)
  - Snippets útiles para JavaScript
- **Thunder Client** (rangav.vscode-thunder-client)
  - Para hacer peticiones HTTP (opcional)

---

## 🏃 **EJECUTAR EL PROYECTO**

### Opción 1: Live Server (Más Fácil)
```bash
# Click derecho en src/index.html
# → Open with Live Server

# O presiona Alt+L Alt+O
```

### Opción 2: Comando npm
```bash
npm start
# Se abre en http://localhost:8000
```

### Opción 3: Comando npm dev (con auto-reload)
```bash
npm run dev
# Se abre automáticamente en el navegador
```

---

## 📝 **ARCHIVOS PRINCIPALES**

### `src/index.html`
- **Qué es:** Página principal del sitio
- **Qué contiene:**
  - Header con navegación
  - 5 secciones principales
  - Footer
  - Meta tags y Schema.org
- **Cómo editar:**
  - Abre en VS Code
  - Cambia textos, colores, contenido
  - Guarda (Ctrl+S)

### `src/assets/css/styles.css`
- **Qué es:** Todos los estilos CSS
- **Qué contiene:**
  - Variables CSS (colores, fuentes, espaciado)
  - Estilos de componentes
  - Media queries responsive
  - Animaciones
- **Cómo editar:**
  - Modifica colores en `:root`
  - Cambia tamaños de fuentes
  - Ajusta breakpoints

### `src/assets/js/main.js`
- **Qué es:** Interactividad JavaScript
- **Qué contiene:**
  - Módulo de Carrito
  - Módulo de Trazabilidad (Lots)
  - Módulo de Navegación
  - Módulo de Productos
  - Lazy Loading
  - Validación de formularios
- **Cómo editar:**
  - Cada módulo está claramente separado
  - Agregar funcionalidad nueva es fácil

---

## 🎨 **PERSONALIZACIÓN RÁPIDA**

### Cambiar Colores

Abre `src/assets/css/styles.css` y busca `:root`:

```css
:root {
  --color-dark: #3D2817;      /* Tu color aquí */
  --color-gold: #D4AF37;      /* Tu color aquí */
  --color-cream: #FFFAF0;     /* Tu color aquí */
}
```

### Cambiar Textos

Abre `src/index.html` y busca el texto:

```html
<h1>Del Árbol a tu Taza</h1>  <!-- Edita aquí -->
<p>Café Orgánico de Montaña</p> <!-- O aquí -->
```

### Agregar Imágenes

1. Crea carpeta `src/assets/images/`
2. Copia tus imágenes ahí
3. En HTML, cambia el `src`:

```html
<img src="./assets/images/tu-imagen.jpg" alt="Descripción">
```

### Agregar Nueva Sección

1. Copia una sección existente en `index.html`
2. Pega debajo
3. Cambia contenido y clases CSS

---

## 🔧 **ATAJOS VS CODE ÚTILES**

```
Ctrl+S              Guardar archivo
Ctrl+Shift+S        Guardar todo
Ctrl+/              Comentar línea
Alt+Shift+F         Formatear documento
Ctrl+H              Buscar y reemplazar
Ctrl+F              Buscar en archivo
Ctrl+Shift+F        Buscar en proyecto
Ctrl+`              Abrir terminal
```

---

## 🌐 **PUBLICAR EN INTERNET (Opciones)**

### Opción 1: Vercel (Más Fácil)
```bash
# 1. Instala Vercel CLI
npm install -g vercel

# 2. Deploy
vercel
```

### Opción 2: Netlify
```bash
# 1. Arrastra la carpeta src/ a netlify.com
```

### Opción 3: GitHub Pages
```bash
# 1. Sube a GitHub
# 2. Ve a Settings → Pages
# 3. Selecciona rama main y carpeta docs
```

---

## 🧪 **TESTING & VALIDACIÓN**

### Validar HTML
```bash
# Usa: https://validator.w3.org/
# Copia y pega el HTML
```

### Validar CSS
```bash
# Usa: https://jigsaw.w3.org/css-validator/
# Copia y pega el CSS
```

### Validar Performance
```bash
# Usa Google Lighthouse
# En Chrome DevTools (F12) → Lighthouse
# Goal: >90 en todas métricas
```

### Validar Accesibilidad
```bash
# Usa WAVE: https://wave.webaim.org/
# Paste URL de tu sitio
```

---

## 🐛 **TROUBLESHOOTING**

### Problema: "No puedo abrir el proyecto"
**Solución:** 
```bash
# Asegúrate que estés en la carpeta correcta
cd PROJECT_VSCODE
# Luego abre: code .
```

### Problema: "Las imágenes no cargan"
**Solución:**
- Verifica que el archivo exista en `src/assets/images/`
- Revisa que el `src` en HTML sea correcto
- Usa ruta relativa: `./assets/images/nombre.jpg`

### Problema: "Live Server no funciona"
**Solución:**
- Instala extensión "Live Server"
- Click derecho en `index.html` → Open with Live Server
- O presiona Alt+L Alt+O

### Problema: "Los estilos no se aplican"
**Solución:**
- Verifica que `styles.css` esté en `src/assets/css/`
- En HTML: `<link rel="stylesheet" href="./assets/css/styles.css">`
- Recarga la página (Ctrl+R) o (Cmd+R)
- Limpia caché del navegador (Ctrl+Shift+Delete)

---

## 📚 **RECURSOS ÚTILES**

- **MDN Web Docs:** https://developer.mozilla.org
- **CSS Tricks:** https://css-tricks.com
- **JavaScript.info:** https://javascript.info
- **Can I use:** https://caniuse.com (compatibilidad navegadores)
- **Google Fonts:** https://fonts.google.com

---

## 🎓 **PRÓXIMOS PASOS**

1. **Personaliza el contenido**
   - Cambia textos, imágenes, colores

2. **Agrega tu logo**
   - Reemplaza el ☕ en el header

3. **Implementa contacto real**
   - Conecta formulario con backend

4. **Agrega más productos**
   - Copia/pega la estructura de producto

5. **Publica en internet**
   - Elige Vercel, Netlify o GitHub Pages

---

## 🤝 **AYUDA & SOPORTE**

Si tienes problemas:

1. **Abre la terminal en VS Code** (Ctrl+`)
2. **Busca errores** en la consola del navegador (F12)
3. **Valida tu código** (HTML, CSS, JS)
4. **Busca en Google** el error que ves

---

## 📝 **NOTAS IMPORTANTES**

- ✅ Todo está listo para producción
- ✅ Código optimizado para rendimiento
- ✅ Responsive en mobile, tablet y desktop
- ✅ Accesible (WCAG 2.1 AA)
- ✅ SEO optimizado (Schema.org)
- ✅ Sin dependencias externas (excepto Google Fonts)

---

## ✨ **¡Que disfrutes desarrollando!**

**Versión:** 1.0  
**Status:** Listo para producción  
**Última actualización:** 2024-01-15

---

**¿Preguntas?** Revisa la documentación técnica completa en los otros archivos incluidos.

Abre `src/index.html` en Live Server y ¡comienza a editar! 🚀