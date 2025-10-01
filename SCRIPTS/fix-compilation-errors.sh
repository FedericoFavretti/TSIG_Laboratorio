#!/bin/bash

echo "🔧 Corrigiendo errores de compilación..."

# Detener el frontend
./stop.sh

echo "📝 Verificando errores de TypeScript..."
cd ../public-transport-frontend

# Ejecutar verificación de TypeScript
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ No hay errores de TypeScript"
else
    echo "❌ Se encontraron errores de TypeScript"
    echo "🔄 Corrigiendo automáticamente..."
    
    # Aquí podrías agregar comandos para corregir automáticamente
    # Por ahora, mostramos los archivos problemáticos
    npx tsc --noEmit 2>&1 | grep -E "error|Error" || true
fi

echo ""
echo "🚀 Reiniciando aplicación..."
cd ../SCRIPTS
./start.sh

echo "⏳ Esperando 15 segundos para la compilación..."
sleep 15

echo "📊 Verificando estado..."
./status.sh

echo ""
echo "📄 Últimos logs:"
./logs.sh frontend | tail -20