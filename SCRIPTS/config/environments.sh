#!/bin/bash

# SCRIPTS/config/environments.sh

# Configuración de puertos
export FRONTEND_PORT=3000
export BACKEND_PORT=3001

# Configuración de servicios
export START_BACKEND=false  # Cambiar a true cuando exista backend
export HAS_BACKEND=false

# Entorno
export NODE_ENV=development

# URLs
export VITE_API_BASE_URL="http://localhost:$BACKEND_PORT/api"
export VITE_WS_URL="ws://localhost:$BACKEND_PORT/ws"