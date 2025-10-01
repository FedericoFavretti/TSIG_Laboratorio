#!/bin/bash

# SCRIPTS/config/environments.sh

# Configuración de puertos
export FRONTEND_PORT=3000
export BACKEND_PORT=3001

# Configuración de servicios
export START_BACKEND=false  # Cambiar a true cuando tengas backend
export HAS_BACKEND=false

# Entorno
export NODE_ENV=development

# URLs
export REACT_APP_API_BASE_URL="http://localhost:$BACKEND_PORT/api"
export REACT_APP_WS_URL="ws://localhost:$BACKEND_PORT/ws"