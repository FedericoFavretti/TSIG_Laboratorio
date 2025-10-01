#!/bin/bash

# SCRIPTS/config/services.sh

# Servicios a monitorear
SERVICES=("frontend" "backend")

# Comandos de inicio
START_COMMANDS=(
    "cd ../public-transport-frontend && npm start"
    "cd ../backend && npm start"
)

# Patrones de verificación
HEALTH_CHECK_URLS=(
    "http://localhost:3000"
    "http://localhost:3001/health"
)