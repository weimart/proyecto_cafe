# 🚀 INTEGRAR CÓDIGO EN TU CARPETA proyecto_cafe

## OPCIÓN 1: Método Más Fácil (Recomendado)

### Paso 1: Copiar los archivos

1. **Ve a `/mnt/user-data/outputs/PROJECT_VSCODE/`** (donde descargaste los archivos)

2. **Copia ESTAS carpetas/archivos:**
   ```
   ✓ src/                    (Carpeta completa)
   ✓ package.json
   ✓ README.md
   ✓ QUICKSTART.md
   ✓ ESTRUCTURA.md
   ✓ INICIO.txt
   ✓ .vscode/                (Carpeta de configuración)
   ✓ .gitignore
   ✓ .editorconfig
   ```

3. **Pega en tu carpeta `proyecto_cafe` en el Desktop**
   - Abre Finder
   - Ve a Desktop
   - Abre carpeta `proyecto_cafe`
   - Pega los archivos/carpetas

### Paso 2: Abrir en VS Code

1. **Abre VS Code**
2. **Ctrl+K Ctrl+O** (o Cmd+K Cmd+O en Mac)
3. **Selecciona tu carpeta `proyecto_cafe` del Desktop**
4. **Click en "Abrir"**

### Paso 3: Instalar dependencias

1. **Abre terminal en VS Code** (Ctrl+` o Cmd+`)
2. **Ejecuta:**
   ```bash
   npm install
   ```

### Paso 4: Iniciar servidor

1. **En terminal:**
   ```bash
   npm start
   ```
   O **click derecho en `src/index.html` → "Open with Live Server"**

---

## OPCIÓN 2: Método Terminal (Para usuarios avanzados)

```bash
# 1. Ve a tu carpeta proyecto_cafe
cd ~/Desktop/proyecto_cafe

# 2. Copia los archivos de la descarga
# (Reemplaza PATH_DESCARGA con tu ruta)
cp -r /PATH_DESCARGA/PROJECT_VSCODE/src .
cp -r /PATH_DESCARGA/PROJECT_VSCODE/.vscode .
cp /PATH_DESCARGA/PROJECT_VSCODE/package.json .
cp /PATH_DESCARGA/PROJECT_VSCODE/README.md .
cp /PATH_DESCARGA/PROJECT_VSCODE/*.md .
cp /PATH_DESCARGA/PROJECT_VSCODE/.* .

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor
npm start
```

---

## OPCIÓN 3: Estructura Manual

Si prefieres crear la estructura manualmente:

```
proyecto_cafe/
├── src/
│   ├── index.html           ← Copiar de PROJECT_VSCODE
│   └── assets/
│       ├── css/
│       │   └── styles.css
│       ├── js/
│       │   └── main.js
│       └── images/
├── .vscode/
│   ├── settings.json        ← Copiar de PROJECT_VSCODE
│   ├── extensions.json
│   └── launch.json
├── package.json             ← Copiar de PROJECT_VSCODE
├── README.md
├── QUICKSTART.md
├── .gitignore
└── .editorconfig
```

---

## ✅ VERIFICACIÓN

Después de copiar, verifica que tu `proyecto_cafe` tenga:

- [ ] Carpeta `src/` con `index.html`
- [ ] Carpeta `src/assets/css/` con `styles.css`
- [ ] Carpeta `src/assets/js/` con `main.js`
- [ ] Carpeta `.vscode/` con configuración
- [ ] Archivo `package.json`
- [ ] Archivo `README.md`

Si todo está ✓, abre en VS Code y ¡listo!

---

## 🎯 SIGUIENTES PASOS

1. ✓ Copia archivos a `proyecto_cafe`
2. ✓ Abre en VS Code
3. ✓ Instala `npm install`
4. ✓ Inicia con `npm start`
5. ✓ ¡Edita tu contenido!

---

## 📍 RUTAS EN MAC

```
Descargas: ~/Downloads/
Desktop:  ~/Desktop/
Tu carpeta: ~/Desktop/proyecto_cafe/
```

---

## 💡 CONSEJO

Si quieres que los archivos descargados se integren automáticamente, usa esta ruta en terminal:

```bash
# Desde tu carpeta proyecto_cafe
cp -r /mnt/user-data/outputs/PROJECT_VSCODE/* .
npm install
npm start
```

---

¿Necesitas ayuda con algún paso específico?
