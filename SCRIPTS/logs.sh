#!/bin/bash

# SCRIPTS/logs.sh
source ./config/environments.sh

case "${1:-all}" in
    "frontend")
        echo "📄 Mostrando logs del frontend:"
        tail -f logs/frontend.log
        ;;
    "backend")
        echo "📄 Mostrando logs del backend:"
        tail -f logs/backend.log
        ;;
    "all")
        echo "📄 Mostrando todos los logs (Ctrl+C para salir):"
        tail -f logs/*.log
        ;;
    "error")
        echo "❌ Mostrando solo errores:"
        grep -r "ERROR\|error\|Error" logs/ || echo "No se encontraron errores"
        ;;
    "clear")
        echo "🧹 Limpiando logs..."
        > logs/frontend.log
        > logs/backend.log
        echo "✅ Logs limpiados"
        ;;
    *)
        echo "Uso: ./logs.sh {frontend|backend|all|error|clear}"
        ;;
esac