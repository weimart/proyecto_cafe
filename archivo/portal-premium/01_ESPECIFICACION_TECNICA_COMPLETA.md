# 🏗️ ESPECIFICACIÓN TÉCNICA INDUSTRIAL
## Proyecto: ESENCIA Y TAZA
### "El Arte del Origen, Tradición que se Cultiva"

---

## ÍNDICE
1. [Análisis de Marca](#análisis-de-marca)
2. [Paleta de Colores & Tipografía](#paleta-de-colores--tipografía)
3. [Arquitectura de Información (SEO)](#arquitectura-de-información-seo)
4. [Stack Tecnológico](#stack-tecnológico)
5. [Optimizaciones de Rendimiento](#optimizaciones-de-rendimiento)
6. [Seguridad & HTTPS](#seguridad--https)
7. [Configuración Nginx](#configuración-nginx)
8. [Estructura de Carpetas](#estructura-de-carpetas)
9. [Despliegue Unix/Linux](#despliegue-unixlinux)
10. [Métricas & Monitoreo](#métricas--monitoreo)

---

## ANÁLISIS DE MARCA

### Identidad Visual Extraída
```
Marca: ESENCIA Y TAZA
Ubicación: Santa Rosa de Osos, Antioquia, Colombia
Lema: "El Arte del Origen, Tradición que se Cultiva"
Estilo: Grabado artesanal vintage + tecnología moderna
Público: Apreciadores de café de origen, profesionales, turistas.
```

### Diferenciadores
- **Autenticidad**: Grabado vintage original (no digital)
- **Comunidad**: Santa Rosa de Osos es productora cafetera histórica
- **Narrativa**: Tradición + innovación
- **Experiencia**: Sensorial (visual, gustativa, emocional)

---

## PALETA DE COLORES & TIPOGRAFÍA

### Variables CSS `:root` (Sistema de Colores)

```css
:root {
  /* PRIMARY COLORS - Extraídos de la marca */
  --color-primary-dark:       #3D2817;   /* Café oscuro (letras) */
  --color-primary-dark-rgb:   61, 40, 23;
  --color-primary-medium:     #6B5344;   /* Café tostado (líneas) */
  --color-primary-medium-rgb: 107, 83, 68;
  --color-primary-light:      #A0826D;   /* Café claro */
  --color-primary-light-rgb:  160, 130, 109;
  
  /* ACCENT COLORS */
  --color-accent-gold:        #D4AF37;   /* Dorado vintage */
  --color-accent-gold-dark:   #C9A961;   /* Dorado oscuro */
  --color-accent-warm:        #E8A87C;   /* Tierra cálida */
  
  /* SECONDARY COLORS */
  --color-secondary-cream:    #FFFAF0;   /* Blanco crema (fondo) */
  --color-secondary-beige:    #E8DECC;   /* Beige claro */
  --color-secondary-light:    #F5EFFE;   /* Fondo ultra ligero */
  
  /* NEUTRAL PALETTE */
  --color-neutral-50:         #FAFAFA;
  --color-neutral-100:        #F5F5F5;
  --color-neutral-200:        #EEEEEE;
  --color-neutral-300:        #E0E0E0;
  --color-neutral-400:        #BDBDBD;
  --color-neutral-500:        #9E9E9E;
  --color-neutral-600:        #757575;
  --color-neutral-700:        #616161;
  --color-neutral-800:        #424242;
  --color-neutral-900:        #212121;
  
  /* FUNCTIONAL COLORS */
  --color-success:            #4CAF50;
  --color-warning:            #FF9800;
  --color-error:              #F44336;
  --color-info:               #2196F3;
  
  /* BACKGROUNDS */
  --bg-primary:               var(--color-secondary-cream);
  --bg-secondary:             var(--color-secondary-beige);
  --bg-tertiary:              var(--color-secondary-light);
  --bg-overlay:               rgba(61, 40, 23, 0.9);
  --bg-overlay-light:         rgba(224, 224, 224, 0.5);
  
  /* TEXT COLORS */
  --text-primary:             var(--color-primary-dark);
  --text-secondary:           var(--color-primary-medium);
  --text-tertiary:            var(--color-neutral-600);
  --text-light:               var(--color-neutral-400);
  --text-inverse:             var(--color-secondary-cream);
  
  /* TYPOGRAPHY */
  --font-serif:               'Playfair Display', 'Georgia', serif;
  --font-sans:                'Source Sans Pro', 'Segoe UI', sans-serif;
  --font-mono:                'IBM Plex Mono', 'Courier New', monospace;
  
  --font-weight-light:        300;
  --font-weight-normal:       400;
  --font-weight-medium:       500;
  --font-weight-semibold:     600;
  --font-weight-bold:         700;
  --font-weight-extrabold:    800;
  
  /* TYPOGRAPHY SCALE */
  --text-xs:                  0.75rem;   /* 12px */
  --text-sm:                  0.875rem;  /* 14px */
  --text-base:                1rem;      /* 16px */
  --text-lg:                  1.125rem;  /* 18px */
  --text-xl:                  1.25rem;   /* 20px */
  --text-2xl:                 1.5rem;    /* 24px */
  --text-3xl:                 1.875rem;  /* 30px */
  --text-4xl:                 2.25rem;   /* 36px */
  --text-5xl:                 3rem;      /* 48px */
  --text-6xl:                 3.75rem;   /* 60px */
  
  /* LINE HEIGHTS */
  --line-height-tight:        1.2;
  --line-height-normal:       1.5;
  --line-height-relaxed:      1.75;
  --line-height-loose:        2;
  
  /* SPACING SYSTEM (8px base) */
  --spacing-0:                0;
  --spacing-1:                0.25rem;   /* 4px */
  --spacing-2:                0.5rem;    /* 8px */
  --spacing-3:                0.75rem;   /* 12px */
  --spacing-4:                1rem;      /* 16px */
  --spacing-5:                1.25rem;   /* 20px */
  --spacing-6:                1.5rem;    /* 24px */
  --spacing-7:                1.75rem;   /* 28px */
  --spacing-8:                2rem;      /* 32px */
  --spacing-10:               2.5rem;    /* 40px */
  --spacing-12:               3rem;      /* 48px */
  --spacing-16:               4rem;      /* 64px */
  --spacing-20:               5rem;      /* 80px */
  --spacing-24:               6rem;      /* 96px */
  --spacing-28:               7rem;      /* 112px */
  --spacing-32:               8rem;      /* 128px */
  
  /* BORDER RADIUS */
  --radius-none:              0;
  --radius-sm:                0.25rem;
  --radius-md:                0.5rem;
  --radius-lg:                1rem;
  --radius-xl:                1.5rem;
  --radius-full:              9999px;
  
  /* SHADOWS */
  --shadow-xs:                0 1px 2px 0 rgba(61, 40, 23, 0.05);
  --shadow-sm:                0 1px 3px 0 rgba(61, 40, 23, 0.1), 0 1px 2px 0 rgba(61, 40, 23, 0.06);
  --shadow-md:                0 4px 6px -1px rgba(61, 40, 23, 0.1), 0 2px 4px -1px rgba(61, 40, 23, 0.06);
  --shadow-lg:                0 10px 15px -3px rgba(61, 40, 23, 0.1), 0 4px 6px -2px rgba(61, 40, 23, 0.05);
  --shadow-xl:                0 20px 25px -5px rgba(61, 40, 23, 0.1), 0 10px 10px -5px rgba(61, 40, 23, 0.04);
  --shadow-2xl:               0 25px 50px -12px rgba(61, 40, 23, 0.25);
  
  /* TRANSITIONS */
  --transition-fast:          150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base:          200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow:          300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Z-INDEX SCALE */
  --z-dropdown:               1000;
  --z-sticky:                 1020;
  --z-fixed:                  1030;
  --z-modal-backdrop:         1040;
  --z-modal:                  1050;
  --z-popover:                1060;
  --z-tooltip:                1070;
}

/* DARK MODE (Opcional para futura implementación) */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary:             var(--color-neutral-900);
    --bg-secondary:           #2a1f15;
    --bg-tertiary:            #3d2817;
    --text-primary:           var(--color-secondary-cream);
    --text-secondary:         var(--color-accent-gold);
    --text-tertiary:          var(--color-neutral-400);
  }
}
```

### Tipografía (Google Fonts)

```html
<!-- En <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Source+Sans+Pro:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

**Jerarquía tipográfica**:
```
H1 (Títulos principales):    Playfair Display, 3rem (48px), bold, color-primary-dark
H2 (Títulos secundarios):    Playfair Display, 2.25rem (36px), bold
H3 (Subtítulos):             Playfair Display, 1.875rem (30px), semibold
H4/H5/H6 (Menores):          Source Sans Pro, 1.25rem-1rem, semibold
Párrafos (Body):             Source Sans Pro, 1rem (16px), normal, color-text-primary, line-height 1.75
Caption:                     Source Sans Pro, 0.875rem (14px), light, color-text-tertiary
Code/Mono:                   IBM Plex Mono, 0.875rem (14px), color-neutral-700
```

---

## ARQUITECTURA DE INFORMACIÓN (SEO)

### Estructura de Árbol del Sitio

```
esenciaytaza.com
├── / (Home)
│   ├── Hero section + Brand story
│   ├── Featured products carousel
│   ├── Experience section
│   └── CTA newsletter
├── /nosotros (About/Origin)
│   ├── Historia de la marca
│   ├── Equipo
│   ├── Certificaciones (Orgánico, Fair Trade, etc)
│   ├── Galería (Cafetales, proceso)
│   └── Blog embedded
├── /cafes (Products)
│   ├── /cafes/origenes (Colección)
│   │   ├── /cafes/origenes/santa-rosa-osos
│   │   ├── /cafes/origenes/huila
│   │   └── /cafes/origenes/cauca
│   ├── /cafes/preparaciones (Guías)
│   ├── /cafes/suscripcion (Club)
│   └── Filtros (Origen, perfil, precio)
├── /experiencias (Events/Experiences)
│   ├── Catas
│   ├── Workshops
│   ├── Tours
│   └── Calendario
├── /blog (Content Hub)
│   ├── /blog/historia
│   ├── /blog/tecnica
│   ├── /blog/origen
│   └── /blog/recetas
├── /tienda (E-commerce)
│   ├── Carrito
│   ├── Checkout
│   └── Confirmación
├── /contacto (Contact)
│   ├── Formulario
│   ├── Ubicación (Google Maps)
│   ├── Horarios
│   └── Social links
└── /legal
    ├── Privacidad
    ├── Términos
    └── Cookies policy
```

### Schema.org (Datos Estructurados)

**1. Organization Schema** (Página de inicio)
```json
{
  "@context": "https://schema.org",
  "@type": "CoffeeShop",
  "name": "Esencia y Taza",
  "description": "Café de origen artesanal cultivado en Santa Rosa de Osos, Antioquia",
  "url": "https://esenciaytaza.com",
  "logo": "https://esenciaytaza.com/assets/logo.svg",
  "image": "https://esenciaytaza.com/assets/og-image.jpg",
  "foundingDate": "2015",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "telephone": "+57-4-XXXXXXXX",
    "email": "hola@esenciaytaza.com"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle Principal 123",
    "addressLocality": "Santa Rosa de Osos",
    "addressRegion": "Antioquia",
    "postalCode": "050010",
    "addressCountry": "CO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "6.3667",
    "longitude": "-75.5333"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "07:00",
    "closes": "18:00"
  },
  "sameAs": [
    "https://instagram.com/esenciaytaza",
    "https://facebook.com/esenciaytaza"
  ]
}
```

**2. Product Schema** (Página de producto)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Café Origen Santa Rosa de Osos",
  "description": "Café de origen cultivado a 1800-2000 msnm en Santa Rosa de Osos",
  "image": "https://esenciaytaza.com/assets/cafe-santa-rosa.jpg",
  "brand": {
    "@type": "Brand",
    "name": "Esencia y Taza"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://esenciaytaza.com/cafes/origenes/santa-rosa-osos",
    "priceCurrency": "COP",
    "price": "45000",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "127"
  }
}
```

**3. LocalBusiness Schema** (Ubicación)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Esencia y Taza - Tienda",
  "image": "https://esenciaytaza.com/assets/tienda.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle Principal 123",
    "addressLocality": "Santa Rosa de Osos",
    "addressRegion": "Antioquia",
    "postalCode": "050010",
    "addressCountry": "CO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "6.3667",
    "longitude": "-75.5333"
  },
  "telephone": "+57-4-XXXXXXXX",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "07:00",
    "closes": "18:00"
  }
}
```

### SEO Keywords Strategy

**Primary Keywords** (Volumen medio-alto, competencia media):
- Café de origen Colombia
- Café artesanal Santa Rosa de Osos
- Café orgánico Antioquia
- Café de especialidad

**Secondary Keywords** (Long-tail, intención de compra):
- Dónde comprar café artesanal en Santa Rosa de Osos
- Mejor café de origen Antioquia
- Café orgánico certificado Colombia

**Local Keywords** (Geo-targeting):
- Café Santa Rosa de Osos
- Tienda café Antioquia
- Experiencia café Santa Rosa de Osos

---

## STACK TECNOLÓGICO

### Frontend
```
┌─────────────────────────────────────┐
│         PRESENTACIÓN                 │
├─────────────────────────────────────┤
│ • HTML5 Semántico                   │
│ • CSS3 (Grid, Flexbox, Custom Prop) │
│ • JavaScript ES6+ (Vanilla JS)      │
│ • Animaciones CSS (Prefiere a JS)   │
│ • Three.js (3D - Lazy loaded)       │
└─────────────────────────────────────┘
```

### Backend
```
┌─────────────────────────────────────┐
│         SERVIDOR (Recomendado)      │
├─────────────────────────────────────┤
│ • Node.js + Express (API REST)      │
│ • Python + Django/Flask (CMS)       │
│ • PostgreSQL (Base de datos)        │
│ • Redis (Cache)                      │
└─────────────────────────────────────┘
```

### Infrastructure
```
┌─────────────────────────────────────┐
│         DESPLIEGUE                   │
├─────────────────────────────────────┤
│ • Nginx (Web server + Proxy)        │
│ • SSL/TLS (Certificado Let's Encrypt)
│ • Docker (Containerización)         │
│ • GitHub Actions (CI/CD)            │
│ • CDN (Cloudflare para assets)      │
└─────────────────────────────────────┘
```

---

## OPTIMIZACIONES DE RENDIMIENTO

### Core Web Vitals Target
```
LCP (Largest Contentful Paint):    < 2.5s
FID (First Input Delay):            < 100ms
CLS (Cumulative Layout Shift):      < 0.1
FCP (First Contentful Paint):       < 1.8s
TTB (Time to Interactive):          < 3.8s
```

### Estrategia de Optimización

#### 1. Image Optimization
```
• Usar formatos modernos (WebP con fallback)
• Lazy loading (intersection observer)
• Responsive images (srcset)
• Critical images: inline/preload
• Non-critical: lazy load
```

#### 2. Code Splitting & Bundling
```
• JavaScript modular (ES6 modules)
• Carga diferida para Three.js
• Minificación de assets
• Gzip compression en servidor
• Tree shaking de dependencias
```

#### 3. Caching Strategy
```
Level 1 - Browser:     1 año (assets estáticos)
Level 2 - CDN:         24 horas (imágenes)
Level 3 - Server:      Redis (datos dinámicos)
Level 4 - Database:    Queries optimizadas (índices)
```

#### 4. Critical Rendering Path
```
1. Preload fuentes Google (woff2)
2. Inline CSS crítico (above-the-fold)
3. Async/Defer scripts no-críticos
4. Lazy load componentes below-the-fold
5. Defer third-party scripts
```

---

## SEGURIDAD & HTTPS

### Headers de Seguridad (Nginx)
```nginx
# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' *.gstatic.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self'" always;

# X-Frame-Options (Clickjacking)
add_header X-Frame-Options "SAMEORIGIN" always;

# X-Content-Type-Options (MIME Sniffing)
add_header X-Content-Type-Options "nosniff" always;

# Referrer-Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions-Policy
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

# HSTS (HTTP Strict Transport Security)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# X-XSS-Protection (Obsoleto pero compatible)
add_header X-XSS-Protection "1; mode=block" always;
```

### HTTPS/SSL
```
• Certificado Let's Encrypt (Auto-renovable)
• TLS 1.3 + TLS 1.2
• OCSP Stapling
• HTTP/2 enabled
• Perfect Forward Secrecy (DHE)
```

---

## CONFIGURACIÓN NGINX

Ver archivo separado: `nginx.conf`

---

## ESTRUCTURA DE CARPETAS

```
esencia-y-taza/
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       ├── test.yml
│       └── lighthouse.yml
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   ├── hero/
│   │   │   ├── products/
│   │   │   └── blog/
│   │   ├── fonts/
│   │   └── icons/
│   ├── css/
│   │   ├── variables.css          (Variables CSS :root)
│   │   ├── reset.css              (Normalize)
│   │   ├── base.css               (Estilos base)
│   │   ├── layout.css             (Grid, Flexbox)
│   │   ├── components.css         (Componentes reutilizables)
│   │   ├── utilities.css          (Clases helper)
│   │   ├── animations.css         (Keyframes)
│   │   ├── responsive.css         (Media queries)
│   │   └── main.css               (Bundle final)
│   ├── js/
│   │   ├── core/
│   │   │   ├── app.js             (Inicializador)
│   │   │   ├── utils.js           (Utilidades)
│   │   │   └── constants.js       (Constantes)
│   │   ├── modules/
│   │   │   ├── navigation.js      (Menú, scroll)
│   │   │   ├── lazy-loader.js     (Lazy loading)
│   │   │   ├── 3d-cup.js          (Three.js - Taza 3D)
│   │   │   ├── animations.js      (Animaciones scroll)
│   │   │   ├── forms.js           (Validación forms)
│   │   │   └── analytics.js       (Tracking)
│   │   └── main.js                (Entry point)
│   ├── html/
│   │   ├── index.html             (Home)
│   │   ├── about.html             (Nosotros)
│   │   ├── products.html          (Cafés)
│   │   ├── blog.html              (Blog)
│   │   ├── contact.html           (Contacto)
│   │   └── components/            (Parciales)
│   │       ├── header.html
│   │       ├── footer.html
│   │       ├── nav.html
│   │       └── product-card.html
│   ├── data/
│   │   ├── products.json
│   │   ├── blog.json
│   │   └── settings.json
│   └── scripts/
│       └── build.js               (Bundler/minificador)
├── public/
│   └── (archivos compilados)
├── server/
│   ├── app.js                     (Express app)
│   ├── config/
│   │   ├── database.js
│   │   ├── environment.js
│   │   └── cors.js
│   ├── routes/
│   │   ├── api/products.js
│   │   ├── api/orders.js
│   │   └── pages.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── error-handler.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── User.js
│   └── views/
│       └── (templates)
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .dockerignore
├── nginx/
│   ├── nginx.conf
│   ├── conf.d/
│   │   ├── gzip.conf
│   │   ├── cache.conf
│   │   └── security.conf
│   └── ssl/
│       ├── cert.pem
│       └── key.pem
├── scripts/
│   ├── deploy.sh                  (Script despliegue)
│   ├── build.sh                   (Build production)
│   ├── start.sh                   (Iniciar servidor)
│   └── backup.sh                  (Backup BD)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── ARCHITECTURE.md
│   └── SEO.md
├── .env.example                   (Variables de entorno)
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── .editorconfig
```

---

## DESPLIEGUE UNIX/LINUX

### Requisitos del Sistema
```bash
# Distribuciones soportadas
Ubuntu 22.04 LTS / Debian 12 / AlmaLinux 9

# Requisitos mínimos
RAM:    2GB (recomendado 4GB)
CPU:    2 cores (recomendado 4)
Disco:  20GB SSD
```

### Instalación Inicial

```bash
# 1. Actualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar dependencias base
sudo apt install -y build-essential curl wget git nano htop net-tools

# 3. Instalar Node.js (LTS)
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Instalar Nginx
sudo apt install -y nginx

# 5. Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 6. Instalar Redis (cache)
sudo apt install -y redis-server

# 7. Instalar Certbot (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
```

### Configuración de Proyecto

```bash
# 1. Clonar repositorio
cd /var/www
sudo git clone https://github.com/tu-usuario/esencia-y-taza.git
cd esencia-y-taza

# 2. Instalar dependencias Node
npm install --production

# 3. Crear archivo .env
cp .env.example .env
sudo nano .env
# Editar con credenciales y URLs correctas

# 4. Construir assets
npm run build

# 5. Configurar base de datos
createdb esencia_taza
psql esencia_taza < database/schema.sql

# 6. Configurar permisos
sudo chown -R www-data:www-data /var/www/esencia-y-taza
sudo chmod -R 755 /var/www/esencia-y-taza
```

### SSL/TLS Certificate

```bash
# 1. Obtener certificado Let's Encrypt
sudo certbot certonly --nginx -d esenciaytaza.com -d www.esenciaytaza.com

# 2. Auto-renovación
sudo systemctl enable certbot.timer
sudo certbot renew --dry-run
```

### Iniciar Servicios

```bash
# 1. Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# 2. Node.js (usando PM2)
sudo npm install -g pm2
pm2 start src/server.js --name "esencia-taza" --instances max
pm2 startup
pm2 save

# 3. Redis
sudo systemctl enable redis-server
sudo systemctl start redis-server

# 4. PostgreSQL
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### Monitoreo

```bash
# Ver logs en tiempo real
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
pm2 logs esencia-taza

# Verificar servicios
systemctl status nginx
systemctl status redis-server
pm2 list
```

---

## MÉTRICAS & MONITOREO

### Herramientas Recomendadas
```
Performance:  Google Lighthouse, WebPageTest, GTmetrix
Analytics:    Google Analytics 4, Hotjar
Uptime:       Uptime Robot, StatusPage
Errors:       Sentry, LogRocket
SEO:          Google Search Console, Ahrefs, SEMrush
```

### KPIs Objetivo
```
Conversión:        2-3%
Bounce rate:       < 40%
Avg session:       > 3 minutos
Pages/session:     > 2.5
Mobile traffic:    > 60%
Organic traffic:   > 40%
```

---

## CHECKLIST DE LANZAMIENTO

- [ ] Dominio registrado y configurado
- [ ] SSL/TLS configurado
- [ ] Analytics configurado
- [ ] Schema.org validado (schema.org validator)
- [ ] Robots.txt creado
- [ ] Sitemap.xml creado
- [ ] Lighthouse score > 90
- [ ] Mobile-friendly test pasado
- [ ] Core Web Vitals optimizados
- [ ] Backups automatizados
- [ ] Monitoring configurado
- [ ] Git workflow establecido
- [ ] CI/CD pipeline activo
- [ ] Documentación completa
- [ ] Test de carga realizado
- [ ] Security audit completado

---

**Documento creado:** 2024  
**Versión:** 1.0  
**Status:** Producción Ready