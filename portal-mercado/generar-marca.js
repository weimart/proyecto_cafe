#!/usr/bin/env node
/* ============================================================================
   generar-marca.js — Deriva todos los activos del logo oficial

       node generar-marca.js

   Fuente:  img/Logo nuevo esencia y taza.jpeg  (1600x1600, fondo crema)

   Genera, en portal-mercado/assets/images/:
     logo.png             logotipo completo, fondo transparente
     logo-claro.png       ídem en tinta clara, para el pie oscuro
     logo-grande.png      versión grande para datos estructurados
     favicon.png          SOLO el isotipo (montaña + taza), sin texto
     favicon-16 / -32     tamaños exactos para la pestaña
     apple-touch-icon.png 180x180 sobre crema (iOS no respeta transparencia)
     og-image.jpg         1200x630 para vistas previas al compartir

   Los originales se respaldan en assets/images/_originales/.
   ============================================================================ */

'use strict';

const Jimp = require('c:/Users/PC/Desktop/proyecto_cafe/Proyecto_CDA/node_modules/jimp');
const fs   = require('fs');
const path = require('path');

const RAIZ   = path.join(__dirname, '..');
const FUENTE = path.join(RAIZ, 'img', 'Logo nuevo esencia y taza.jpeg');
const SALIDA = path.join(__dirname, 'assets', 'images');
const BAK    = path.join(SALIDA, '_originales');
const MARCA  = path.join(RAIZ, 'marca', 'logos');

// Caja del isotipo dentro del original, medida sobre la imagen real.
const ISO = { x0: 332, x1: 1262, y0: 500, y1: 1306 };
// Solo el cuenco. A 16 px la montana y la taza juntas son una mancha: el
// navegador tiene 256 pixeles para todo. La taza sola si se reconoce.
const TAZA = { x0: 332, x1: 1262, y0: 854, y1: 1306 };
const CREMA = 0xFBF8F5FF;   // el propio fondo del logo

const ok = m => console.log('  \x1b[32m✓\x1b[0m ' + m);
const kb = f => Math.round(fs.statSync(f).size / 1024);

/** Convierte el fondo plano en transparencia.
 *  La opacidad se gradúa con la distancia al color de fondo, así los bordes
 *  suavizados no quedan dentados. */
function recortarFondo(img, umbral = 120) {
  const bg = Jimp.intToRGBA(img.getPixelColor(2, 2));
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, i) {
    const d = Math.abs(this.bitmap.data[i]     - bg.r) +
              Math.abs(this.bitmap.data[i + 1] - bg.g) +
              Math.abs(this.bitmap.data[i + 2] - bg.b);
    this.bitmap.data[i + 3] = d >= umbral ? 255 : Math.round((d / umbral) * 255);
  });
  return img;
}

/** Pasa la tinta oscura a crema, conservando los dorados.
 *  El marrón del logo ronda una luminancia de 50; el dorado, 140. */
function tintaClara(img) {
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, i) {
    const d = this.bitmap.data;
    if (d[i + 3] < 8) return;
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (lum < 105) { d[i] = 0xFB; d[i + 1] = 0xF7; d[i + 2] = 0xF0; }
  });
  return img;
}

/** Limpia el ruido que deja el JPEG.
 *  La compresión salpica de microvariaciones las zonas planas; al convertirlas
 *  en alfa, el PNG acaba con miles de colores casi idénticos y se dispara de
 *  peso. Se fijan los extremos del alfa y se reduce la paleta. */
function limpiar(img, niveles = 24) {
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, i) {
    const d = this.bitmap.data;
    if (d[i + 3] < 24) { d[i + 3] = 0; return; }       // fuera el polvo del fondo
    if (d[i + 3] > 232) d[i + 3] = 255;                // trazo pleno
    for (let k = 0; k < 3; k++) {
      d[i + k] = Math.round(d[i + k] / (256 / niveles)) * (256 / niveles);
    }
  });
  img.posterize(niveles);
  return img;
}

/** Medallón circular: crema dentro, aro dorado, esquinas transparentes.
 *  Es el mismo tratamiento que la marca tiene en la cabecera del sitio, así
 *  que el icono de la pestaña y el logo de la web se reconocen como lo mismo.
 *  Un cuadrado suelto, en cambio, se lee como un recorte. */
function medallon(iso, lado, proporcion) {
  const S = 1024;                       // se dibuja grande y se reduce: los
  const l = new Jimp(S, S, 0x00000000); // bordes salen suaves sin más trabajo
  const r = S / 2, ancho = Math.round(S * 0.052);
  const crema = Jimp.cssColorToHex('#FBF5EA');
  const oro   = Jimp.cssColorToHex('#C8962E');

  l.scan(0, 0, S, S, function (x, y, i) {
    const d = Math.hypot(x - r + .5, y - r + .5);
    let c = null;
    if (d <= r - ancho)      c = crema;
    else if (d <= r - 1)     c = oro;
    if (!c) return;
    // Antialias del canto exterior
    const borde = d > r - ancho ? Math.min(1, r - d) : 1;
    this.bitmap.data[i]     = (c >>> 24) & 255;
    this.bitmap.data[i + 1] = (c >>> 16) & 255;
    this.bitmap.data[i + 2] = (c >>> 8) & 255;
    this.bitmap.data[i + 3] = Math.round(255 * Math.max(0, borde));
  });

  const m = iso.clone();
  const cabe = S * (proporcion || 0.62);
  m.scaleToFit(cabe, cabe);
  l.composite(m, Math.round((S - m.bitmap.width) / 2),
                 Math.round((S - m.bitmap.height) / 2));
  return l.resize(lado, lado);
}

/** Encaja una imagen en un lienzo cuadrado, centrada. */
function aCuadrado(img, lado, fondo) {
  const lienzo = new Jimp(lado, lado, fondo);
  const escala = Math.min(lado * 0.86 / img.bitmap.width, lado * 0.86 / img.bitmap.height);
  const c = img.clone().resize(Math.round(img.bitmap.width * escala), Jimp.AUTO);
  lienzo.composite(c, Math.round((lado - c.bitmap.width) / 2),
                      Math.round((lado - c.bitmap.height) / 2));
  return lienzo;
}

(async () => {
  console.log('\n\x1b[1mActivos de marca — Esencia y Taza\x1b[0m\n');

  if (!fs.existsSync(FUENTE)) { console.error('  No existe ' + FUENTE); process.exit(1); }
  fs.mkdirSync(BAK, { recursive: true });
  fs.mkdirSync(MARCA, { recursive: true });

  const orig = await Jimp.read(FUENTE);
  ok('Fuente: ' + orig.bitmap.width + 'x' + orig.bitmap.height);

  // Respaldo de lo que vamos a sustituir
  for (const f of ['logo.png', 'logo-grande.png', 'favicon.png', 'og-image.jpg']) {
    const p = path.join(SALIDA, f);
    if (fs.existsSync(p) && !fs.existsSync(path.join(BAK, f))) fs.copyFileSync(p, path.join(BAK, f));
  }
  ok('Originales respaldados');

  // ── Maestro en el sistema de marca ────────────────────────────────────────
  await orig.clone().writeAsync(path.join(MARCA, 'logo-oficial.png'));
  ok('marca/logos/logo-oficial.png');

  // ── 1. Logotipo completo, transparente ────────────────────────────────────
  const completo = limpiar(recortarFondo(orig.clone()));
  completo.autocrop({ tolerance: 0.002, cropOnlyFrames: false });

  const logo = completo.clone().resize(340, Jimp.AUTO);
  await logo.writeAsync(path.join(SALIDA, 'logo.png'));
  ok('logo.png            ' + logo.bitmap.width + 'x' + logo.bitmap.height +
     '  ' + kb(path.join(SALIDA, 'logo.png')) + ' KB  transparente');

  const grande = completo.clone().resize(600, Jimp.AUTO);
  await grande.writeAsync(path.join(SALIDA, 'logo-grande.png'));
  ok('logo-grande.png     ' + grande.bitmap.width + 'x' + grande.bitmap.height +
     '  ' + kb(path.join(SALIDA, 'logo-grande.png')) + ' KB');

  // ── 2. Variante clara para el pie oscuro ──────────────────────────────────
  const claro = tintaClara(completo.clone()).resize(340, Jimp.AUTO);
  await claro.writeAsync(path.join(SALIDA, 'logo-claro.png'));
  ok('logo-claro.png      ' + claro.bitmap.width + 'x' + claro.bitmap.height +
     '  ' + kb(path.join(SALIDA, 'logo-claro.png')) + ' KB  tinta clara');

  // ── 3. Favicon: solo el isotipo, sin una letra ────────────────────────────
  const iso = orig.clone().crop(ISO.x0, ISO.y0, ISO.x1 - ISO.x0, ISO.y1 - ISO.y0);
  const isoTrans = limpiar(recortarFondo(iso.clone()));

  // Medallon circular, no un cuadrado: replica el circulo dorado que la marca
  // ya lleva en la cabecera del sitio. A 16 px el dibujo se agranda un poco
  // dentro del aro, porque a ese tamano el detalle fino se pierde.
  const tazaSola = limpiar(recortarFondo(
      orig.clone().crop(TAZA.x0, TAZA.y0, TAZA.x1 - TAZA.x0, TAZA.y1 - TAZA.y0)));

  for (const [n, lado, prop, marca] of [['favicon.png',    64, 0.62, isoTrans],
                                        ['favicon-32.png', 32, 0.68, isoTrans],
                                        ['favicon-16.png', 16, 0.86, tazaSola]]) {
    await medallon(marca, lado, prop).writeAsync(path.join(SALIDA, n));
    ok(n.padEnd(20) + lado + 'x' + lado + '  medallon' +
       (marca === tazaSola ? ' (solo la taza: a este tamano el detalle se pierde)' : ''));
  }

  // iOS aplica su propia mascara redondeada y pinta de negro lo transparente:
  // aqui si conviene el cuadrado lleno.
  await aCuadrado(iso, 180, CREMA).writeAsync(path.join(SALIDA, 'apple-touch-icon.png'));
  ok('apple-touch-icon.png 180x180  cuadrado (lo redondea iOS)');

  // Isotipo suelto, con transparencia, para el sistema de marca
  const isoLimpio = limpiar(recortarFondo(iso.clone()));
  await aCuadrado(isoLimpio.clone(), 1024, 0x00000000)
        .writeAsync(path.join(MARCA, 'isotipo-oficial.png'));
  ok('marca/logos/isotipo-oficial.png');

  // La cabecera y el pie del sitio encierran la marca en un círculo de 48 y
  // 64 px con `border-radius:50%` y `object-fit:cover`. El logotipo completo
  // ahí dentro es ilegible: hay que usar el isotipo, que además evita repetir
  // el nombre, ya presente en texto al lado.
  const isoWeb = aCuadrado(isoLimpio.clone(), 256, 0x00000000);
  await isoWeb.writeAsync(path.join(SALIDA, 'isotipo.png'));
  ok('isotipo.png         256x256  ' + kb(path.join(SALIDA, 'isotipo.png')) + ' KB  cabecera');

  const isoClaro = aCuadrado(tintaClara(isoLimpio.clone()), 256, 0x00000000);
  await isoClaro.writeAsync(path.join(SALIDA, 'isotipo-claro.png'));
  ok('isotipo-claro.png   256x256  ' + kb(path.join(SALIDA, 'isotipo-claro.png')) + ' KB  pie oscuro');

  // ── 4. Vista previa al compartir ──────────────────────────────────────────
  const og = new Jimp(1200, 630, CREMA);
  const oc = completo.clone().resize(Jimp.AUTO, 520);
  og.composite(oc, Math.round((1200 - oc.bitmap.width) / 2), Math.round((630 - 520) / 2));
  await og.quality(90).writeAsync(path.join(SALIDA, 'og-image.jpg'));
  ok('og-image.jpg        1200x630  ' + kb(path.join(SALIDA, 'og-image.jpg')) + ' KB');

  // ── 5. Copia en img/, que mantiene su propio juego ────────────────────────
  const IMG = path.join(RAIZ, 'img');
  if (fs.existsSync(IMG)) {
    for (const f of ['logo.png', 'logo-grande.png', 'favicon.png']) {
      fs.copyFileSync(path.join(SALIDA, f), path.join(IMG, f));
    }
    ok('img/ sincronizada');
  }

  console.log('\n  Listo. Revisa el resultado antes de desplegar.\n');
})();
