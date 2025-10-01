#!/bin/bash

# SCRIPTS/stop.sh
echo "🛑 Deteniendo Sistema de Transporte Público..."

# Detener frontend
if [ -f "pids/frontend.pid" ]; then
    FRONTEND_PID=$(cat pids/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null; then
        kill $FRONTEND_PID
        echo "✅ Frontend detenido (PID: $FRONTEND_PID)"
    else
        echo "⚠️  Frontend ya estaba detenido"
    fi
    rm pids/frontend.pid
fi

# Detener backend
if [ -f "pids/backend.pid" ]; then
    BACKEND_PID=$(cat pids/backend.pid)
    if ps -p $BACKEND_PID > /dev/null; then
        kill $BACKEND_PID
        echo "✅ Backend detenido (PID: $BACKEND_PID)"
    else
        echo "⚠️  Backend ya estaba detenido"
    fi
    rm pids/backend.pid
fi

# Limpiar procesos huérfanos de React
pkill -f "react-scripts" 2>/dev/null && echo "✅ Procesos de React limpiados"

echo "🎯 Todos los servicios detenidos"