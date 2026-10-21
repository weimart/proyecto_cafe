# 📐 ESQUEMAS Y WIREFRAMES VISUALES
## ESENCIA Y TAZA - Guía Completa de Layouts

---

## 🎯 ARCHIVOS DE WIREFRAME DISPONIBLES

### 1. **08_WIREFRAME_ASCII_DETALLADO.txt** 
**Formato:** ASCII Art + Descripción Técnica

✅ **Cuándo usar:**
- Documentación técnica y reportes
- Discusiones por email o Slack
- Análisis en terminal
- Referencias offline
- Documentación en Git

✅ **Contenido:**
- Diagrama ASCII full desktop y mobile
- Detalles de componentes individuales
- Especificaciones de interactividad
- Detalles de paleta de colores
- Especificaciones de tipografía
- Timings de animaciones

**Ventajas:**
- No requiere navegador
- Universalmente compatible
- Fácil de copiar/pegar
- Texto puro = versionable en Git

**Desventajas:**
- Requiere imaginación para visualizar
- No es interactivo
- Difícil de mostrar en presentaciones

---

### 2. **09_WIREFRAME_VISUAL_HTML_INTERACTIVO.html**
**Formato:** HTML5 + CSS3 Interactivo

✅ **Cuándo usar:**
- Presentaciones con stakeholders
- Demostración de layout en vivo
- Prototipado rápido
- Diseño visual real
- Testing de responsividad

✅ **Características Implementadas:**
- Diseño responsive (Desktop + Mobile)
- Colores reales de la marca (Paleta exacta)
- Tipografía similar
- Componentes interactivos:
  - Expandible de lotes
  - Carrito funcional
  - Botones con hover effects
  - Animaciones CSS
- Audio mock player
- Footer funcional

**Ventajas:**
- Visualización real en navegador
- Responsive testing inmediato
- Interactividad demostrable
- Colores y tipografía real
- Fácil de compartir (archivo único)

**Desventajas:**
- Requiere navegador web
- Solo está en HTML/CSS (sin backend)
- No es completamente funcional (UI only)

---

## 📊 ESTRUCTURA VISUAL COMPLETA

```
┌─────────────────────────────────────────────────────────────────┐
│                         WIREFRAME MAP                            │
└─────────────────────────────────────────────────────────────────┘

ASCII FORMAT (08)           HTML FORMAT (09)
↓                           ↓
┌─────────────────┐        ┌──────────────────┐
│  Documentación  │        │  Visual Preview  │
│  Técnica Pura   │        │  Interactivo     │
│                 │        │                  │
│  ┌───────────┐  │        │  [↯ Abre HTML]   │
│  │ HEADER    │  │        │  ┌────────────┐  │
│  ├───────────┤  │        │  │ HEADER     │  │
│  │HERO       │  │        │  ├────────────┤  │
│  ├───────────┤  │        │  │HERO (Live) │  │
│  │SECTION 2  │  │        │  ├────────────┤  │
│  ├───────────┤  │        │  │SECTION 2   │  │
│  │SECTION 3  │  │        │  ├────────────┤  │
│  │(Detalles) │  │        │  │SECTION 3   │  │
│  ├───────────┤  │        │  │(Expand!)   │  │
│  │SECTION 4  │  │        │  ├────────────┤  │
│  │SECTION 5  │  │        │  │SECTION 4   │  │
│  │SECTION 6  │  │        │  ├────────────┤  │
│  ├───────────┤  │        │  │SECTION 5   │  │
│  │FOOTER     │  │        │  ├────────────┤  │
│  └───────────┘  │        │  │FOOTER      │  │
│                 │        │  └────────────┘  │
│ 5,000 líneas    │        │ ~500 líneas      │
│ Referencia      │        │ Prototipo        │
└─────────────────┘        └──────────────────┘
```

---

## 🚀 CÓMO USAR CADA WIREFRAME

### Opción A: Formato ASCII (Técnico)

```bash
# Abrir en cualquier editor
cat 08_WIREFRAME_ASCII_DETALLADO.txt

# O en tu terminal favorita
less 08_WIREFRAME_ASCII_DETALLADO.txt

# Imprimir (si necesitas versión física)
print 08_WIREFRAME_ASCII_DETALLADO.txt
```

**Mejor para:**
- Documentación Git
- Reportes técnicos
- Análisis arquitectónico
- Discussions en código

---

### Opción B: Formato Visual Interactivo (Visual)

```bash
# Opción 1: Abrir directamente en navegador
open 09_WIREFRAME_VISUAL_HTML_INTERACTIVO.html

# Opción 2: Arrastrar a navegador Chrome/Firefox
# (Arrastrar archivo .html a ventana del navegador)

# Opción 3: Servir localmente
python -m http.server 8000
# Luego: http://localhost:8000/09_WIREFRAME_VISUAL_HTML_INTERACTIVO.html

# Opción 4: Compartir en línea
# (Subir HTML a cualquier servidor web)
```

**Mejor para:**
- Presentaciones a clientes
- Demostración visual
- Testing de responsividad
- Diseño colaborativo

---

## 🎨 COMPARACIÓN VISUAL

### En ASCII (Formato de Texto)
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  SECTION 2: NUESTRO ORIGEN      ┃
┃  (2-column: Imagen + Texto)     ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
│        │ Nuestro Terroir        │
│[Imagen]│ Caicedo, Antioquia     │
│ Real   │                        │
│ 600x   │ Texto descriptivo...   │
│ 400px  │                        │
│        │ ┌──────────┬────────┐ │
│        │ │ 1900+ m  │ 100%   │ │
│        │ └──────────┴────────┘ │
└────────┴────────────────────────┘
```

### En HTML Visual
```
┌─────────────────────────────────────────────────┐
│ NUESTRO ORIGEN                                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Imagen de Cafetal Real]  │ Caicedo, Ant.     │
│  con degradado              │                   │
│  600x400px                  │ A 1900 metros...  │
│  Sombra realista            │                   │
│  Hover: Zoom                │ Stats boxes:      │
│                             │ ┌──┬──┬──┬──┐   │
│                             │ │19│10│35│10│   │
│                             │ │00│0%│+ │0%│   │
│                             │ └──┴──┴──┴──┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📋 SECCIONES DISPONIBLES EN AMBOS FORMATOS

### Todas las siguientes secciones están en AMBOS wireframes:

```
✅ HEADER / NAVEGACIÓN
   - Logo
   - Links de navegación
   - Carrito
   - Sticky en scroll

✅ SECTION 1: HERO
   - Full-screen
   - Título principal
   - Subtítulos
   - CTAs (Botones)
   - Parallax effect

✅ SECTION 2: NUESTRO ORIGEN
   - Imagen + Texto (2-column)
   - Stats boxes (4)
   - Responsive (1-column mobile)

✅ SECTION 3: TRAZABILIDAD
   - Bolsa de café visual
   - 2 Lotes expandibles
   - Detalles de trazabilidad
   - Botón "Ver Certificado"

✅ SECTION 4: TIENDA
   - 3 Product cards
   - Imagen del producto
   - Rating + Reviews
   - Notas de sabor (badges)
   - Selector de molido
   - Precio y tamaño
   - Botón "Añadir al carrito"

✅ SECTION 5: HISTORIAS
   - 4 Story cards
   - Imagen + contenido
   - Título, descripción
   - Nombre de autor/ubicación

✅ SECTION 6: AUDIO
   - Título y descripción
   - Play button
   - Barra de progreso (mock)

✅ FOOTER
   - 4 columnas (info, nav, legal, social)
   - Copyright
   - Responsive stacking
```

---

## 🎯 FLUJO RECOMENDADO DE USO

### Para Diseñadores/Developers:
```
1. Lee 08_WIREFRAME_ASCII_DETALLADO.txt
   ↓ (Entiende la estructura)
2. Abre 09_WIREFRAME_VISUAL_HTML_INTERACTIVO.html
   ↓ (Visualiza en navegador)
3. Inspecciona código HTML/CSS
   ↓ (Entiende la implementación)
4. Comienza a desarrollar sobre esta base
```

### Para Presentaciones a Clientes:
```
1. Abre 09_WIREFRAME_VISUAL_HTML_INTERACTIVO.html en navegador
   ↓ (Looks professional)
2. Prueba responsividad (F12 → Mobile)
   ↓ (Shows adaptability)
3. Explica cada sección
   ↓ (Educate client)
4. Toma screenshots para documento final
```

### Para Documentación:
```
1. Usa 08_WIREFRAME_ASCII_DETALLADO.txt
   ↓ (Copiar en Markdown)
2. Inserta en README.md del proyecto
   ↓ (Version control friendly)
3. Referencia en código
   ↓ (Keep teams aligned)
```

---

## 🔧 PERSONALIZACIÓN RÁPIDA

### En el HTML (09):

**Cambiar colores:**
```css
:root {
  --color-dark: #3D2817;      /* Tu color aquí */
  --color-gold: #D4AF37;      /* Tu color aquí */
}
```

**Cambiar textos:**
```html
<h1>Del Árbol a tu Taza</h1>  <!-- Edita aquí -->
<p>Café Orgánico de Montaña</p> <!-- O aquí -->
```

**Agregar secciones:**
```html
<!-- Copiar una sección entera -->
<section>
  <!-- Pegar y adaptar -->
</section>
```

---

## 📱 TESTING DE RESPONSIVIDAD

### En el HTML interactivo:

**Desktop (>992px):**
- 2-3 columnas
- Layouts side-by-side
- Navegación horizontal

**Tablet (768-991px):**
- 2 columnas
- Adaptación gradual
- Nav responsive

**Mobile (<768px):**
- 1 columna
- Full-width content
- Menu hamburguesa
- Botones grandes (44px min)

### Probar responsividad:
```bash
# Abre HTML en Chrome
1. F12 (Abrir DevTools)
2. Ctrl+Shift+M (Toggle Device Mode)
3. Prueba diferentes dispositivos
4. Ajusta CSS según sea necesario
```

---

## 🎨 COLOR SWATCHES

Si necesitas usar los colores exactos:

```html
<!-- Copiar en tu código -->
<style>
  :root {
    --color-dark:    #3D2817;  /* Café Oscuro */
    --color-medium:  #6B5344;  /* Café Tostado */
    --color-light:   #A0826D;  /* Café Claro */
    --color-gold:    #D4AF37;  /* Dorado Vintage */
    --color-cream:   #FFFAF0;  /* Crema */
    --color-beige:   #E8DECC;  /* Beige */
  }
</style>
```

---

## 💾 GUARDAR Y VERSIONAR

### Git Integration:

```bash
# Ambos archivos son versionables
git add 08_WIREFRAME_ASCII_DETALLADO.txt
git add 09_WIREFRAME_VISUAL_HTML_INTERACTIVO.html
git commit -m "Add wireframes for Esencia y Taza"

# Tracks changes over time
git log 08_WIREFRAME_ASCII_DETALLADO.txt
```

---

## 🔗 REFERENCIAS ENTRE WIREFRAMES

| Sección | ASCII | HTML |
|---------|-------|------|
| Header | ✅ | ✅ |
| Hero | ✅ | ✅ |
| Origen | ✅ | ✅ |
| Trazabilidad | ✅ | ✅ |
| Tienda | ✅ | ✅ |
| Historias | ✅ | ✅ |
| Audio | ✅ | ✅ |
| Footer | ✅ | ✅ |

Ambos wireframes cubren **100% del contenido** de la página.

---

## 🎓 PRÓXIMOS PASOS

1. **Estudia ambos formatos**
   - ASCII para entender estructura
   - HTML para ver visual

2. **Elige tu formato preferido**
   - Documentación = ASCII
   - Presentaciones = HTML
   - Desarrollo = HTML código

3. **Personaliza los wireframes**
   - Cambiar textos
   - Ajustar colores
   - Agregar contenido real

4. **Comienza el desarrollo**
   - HTML/CSS real
   - JavaScript funcional
   - Backend integration

5. **Mantén los wireframes actualizados**
   - Si cambias diseño, actualiza wireframes
   - Úsalos como referencia única de verdad

---

## ✨ CONCLUSIÓN

Ahora tienes **2 formatos de wireframes**:

📄 **ASCII** → Para documentación técnica, reporte, referencia  
🌐 **HTML** → Para visualización, presentaciones, prototipado  

**Ambos son 100% completos y listos para usar.**

Elige el que mejor se adapte a tu workflow y ¡comienza a desarrollar! 🚀

---

**Versión:** 1.0  
**Status:** Wireframes Completos  
**Formatos:** 2 (ASCII + HTML)  
**Cobertura:** 100% de página  
**Próxima Fase:** Desarrollo con HTML5 + CSS + JS