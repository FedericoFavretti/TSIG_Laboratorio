#!/bin/bash

# SCRIPTS/start.sh
echo "🚀 Iniciando Sistema de Transporte Público..."

# Cargar configuración
source ./config/environments.sh
source ./config/services.sh

echo "📦 Iniciando servicios..."

# Función para verificar si un puerto está en uso
check_port() {
    netstat -tuln | grep ":$1 " > /dev/null
}

# Iniciar backend (si existe)
if [ "$START_BACKEND" = true ]; then
    echo "🔧 Iniciando backend..."
    cd ../backend
    if [ -f "package.json" ]; then
        if check_port $BACKEND_PORT; then
            echo "⚠️  Backend ya está ejecutándose en puerto $BACKEND_PORT"
        else
            npm start > ../SCRIPTS/logs/backend.log 2>&1 &
            echo $! > ../SCRIPTS/pids/backend.pid
            echo "✅ Backend iniciado (PID: $!)"
        fi
    else
        echo "❌ No se encontró backend"
    fi
    cd ../SCRIPTS
fi

# Esperar a que el backend esté listo
if [ "$START_BACKEND" = true ]; then
    echo "⏳ Esperando a que el backend esté listo..."
    for i in {1..30}; do
        if curl -s http://localhost:$BACKEND_PORT/health > /dev/null; then
            echo "✅ Backend listo!"
            break
        fi
        sleep 1
        if [ $i -eq 30 ]; then
            echo "❌ Timeout esperando al backend"
        fi
    done
fi

# Iniciar frontend
echo "🎨 Iniciando frontend..."
cd ../public-transport-frontend

if check_port $FRONTEND_PORT; then
    echo "⚠️  Frontend ya está ejecutándose en puerto $FRONTEND_PORT"
else
    npm start > ../SCRIPTS/logs/frontend.log 2>&1 &
    echo $! > ../SCRIPTS/pids/frontend.pid
    echo "✅ Frontend iniciado (PID: $!)"
    echo "🌐 URL: http://localhost:$FRONTEND_PORT"
fi

cd ../SCRIPTS

echo ""
echo "🎉 Sistema iniciado correctamente!"
echo "📊 Para ver logs: ./logs.sh"
echo "🛑 Para detener: ./stop.sh"
echo "📈 Para estado: ./status.sh"