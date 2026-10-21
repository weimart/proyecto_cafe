#!/bin/bash

# Script para integrar archivos en proyecto_cafe
# Uso: bash integrar.sh

echo "🚀 Iniciando integración en proyecto_cafe..."

# Variables
ORIGEN="/mnt/user-data/outputs/PROJECT_VSCODE"
DESTINO="$HOME/Desktop/proyecto_cafe"

# Verificar que existe la carpeta destino
if [ ! -d "$DESTINO" ]; then
    echo "❌ Error: No encontré la carpeta proyecto_cafe en Desktop"
    echo "   Crea la carpeta primero: mkdir ~/Desktop/proyecto_cafe"
    exit 1
fi

echo "✓ Carpeta destino encontrada: $DESTINO"

# Copiar archivos
echo ""
echo "📁 Copiando archivos..."

# Copiar carpetas principales
echo "  → Copiando src/"
cp -r "$ORIGEN/src" "$DESTINO/"

echo "  → Copiando .vscode/"
cp -r "$ORIGEN/.vscode" "$DESTINO/"

# Copiar archivos de configuración
echo "  → Copiando archivos de configuración"
cp "$ORIGEN/package.json" "$DESTINO/" 2>/dev/null || echo "    ⚠ package.json no encontrado"
cp "$ORIGEN/README.md" "$DESTINO/" 2>/dev/null || echo "    ⚠ README.md no encontrado"
cp "$ORIGEN/QUICKSTART.md" "$DESTINO/" 2>/dev/null || echo "    ⚠ QUICKSTART.md no encontrado"
cp "$ORIGEN/ESTRUCTURA.md" "$DESTINO/" 2>/dev/null || echo "    ⚠ ESTRUCTURA.md no encontrado"
cp "$ORIGEN/.gitignore" "$DESTINO/" 2>/dev/null || echo "    ⚠ .gitignore no encontrado"
cp "$ORIGEN/.editorconfig" "$DESTINO/" 2>/dev/null || echo "    ⚠ .editorconfig no encontrado"

echo ""
echo "✅ Archivos copiados exitosamente"

# Instalar dependencias
echo ""
echo "📦 ¿Instalar dependencias npm? (npm install)"
read -p "   Presiona S para sí, N para no: " respuesta

if [[ $respuesta == "S" ]] || [[ $respuesta == "s" ]]; then
    cd "$DESTINO"
    echo "   Instalando..."
    npm install
    echo "   ✅ Dependencias instaladas"
fi

echo ""
echo "🎉 ¡Integración completada!"
echo ""
echo "Próximos pasos:"
echo "1. Abre VS Code"
echo "2. Ctrl+K Ctrl+O → Selecciona proyecto_cafe"
echo "3. Instala extensión Live Server (si no la tienes)"
echo "4. Click derecho en src/index.html → Open with Live Server"
echo ""
echo "¡Listo! 🚀"
