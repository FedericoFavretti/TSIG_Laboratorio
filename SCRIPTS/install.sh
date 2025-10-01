#!/bin/bash

# SCRIPTS/install.sh
echo "📦 Instalando dependencias del Sistema de Transporte Público..."

# Instalar dependencias del frontend
echo "🎨 Instalando dependencias del frontend..."
cd ../frontend-public-transport
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend: Dependencias instaladas"
else
    echo "❌ Frontend: Error instalando dependencias"
    exit 1
fi

# Instalar dependencias del backend (si existe)
cd ../SCRIPTS
source ./config/environments.sh

if [ "$HAS_BACKEND" = true ]; then
    echo "🔧 Instalando dependencias del backend..."
    cd ../backend
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Backend: Dependencias instaladas"
    else
        echo "❌ Backend: Error instalando dependencias"
        exit 1
    fi
fi

cd ../SCRIPTS
echo ""
echo "🎉 Todas las dependencias instaladas correctamente!"
echo "🚀 Para iniciar el sistema: ./start.sh"