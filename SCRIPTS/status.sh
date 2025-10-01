#!/bin/bash

# SCRIPTS/status.sh
source ./config/environments.sh

echo "📊 Estado del Sistema de Transporte Público"
echo "=========================================="

# Verificar frontend
if [ -f "pids/frontend.pid" ]; then
    FRONTEND_PID=$(cat pids/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null; then
        echo "✅ Frontend: ACTIVO (PID: $FRONTEND_PID, Puerto: $FRONTEND_PORT)"
        echo "   🌐 URL: http://localhost:$FRONTEND_PORT"
    else
        echo "❌ Frontend: INACTIVO (PID huérfano)"
        rm pids/frontend.pid
    fi
else
    echo "❌ Frontend: NO INICIADO"
fi

# Verificar backend
if [ -f "pids/backend.pid" ]; then
    BACKEND_PID=$(cat pids/backend.pid)
    if ps -p $BACKEND_PID > /dev/null; then
        echo "✅ Backend: ACTIVO (PID: $BACKEND_PID, Puerto: $BACKEND_PORT)"
        # Verificar salud del backend
        if curl -s http://localhost:$BACKEND_PORT/health > /dev/null; then
            echo "   💚 Salud: OK"
        else
            echo "   💔 Salud: ERROR"
        fi
    else
        echo "❌ Backend: INACTIVO (PID huérfano)"
        rm pids/backend.pid
    fi
else
    echo "❌ Backend: NO INICIADO"
fi

# Verificar uso de recursos
echo ""
echo "📈 Uso de recursos:"
ps aux | grep -E "node|npm" | grep -v grep | awk '{print "   " $11 " (CPU: " $3 "%, MEM: " $4 "%)"}'

echo ""
echo "🛠️  Comandos disponibles:"
echo "   ./start.sh    - Iniciar sistema"
echo "   ./stop.sh     - Detener sistema" 
echo "   ./logs.sh     - Ver logs"
echo "   ./status.sh   - Ver este estado"