#!/bin/bash

# SCRIPTS/setup.sh
echo "⚙️  Configurando sistema de automatización..."

# Crear directorios necesarios
cd ../SCRIPTS
mkdir -p logs pids config

# Hacer ejecutables todos los scripts
chmod +x *.sh

# Crear archivos de log vacíos
touch logs/frontend.log
touch logs/backend.log

# Configurar gitignore para logs y pids
if [ ! -f .gitignore ]; then
    cat > .gitignore << EOF
logs/
pids/
*.pid
.env
EOF
fi

echo "✅ Configuración completada!"
echo ""
echo "📖 Próximos pasos:"
echo "   1. Revisa config/environments.sh y ajusta los puertos si es necesario"
echo "   2. Ejecuta ./install.sh para instalar dependencias"
echo "   3. Ejecuta ./start.sh para iniciar el sistema"
echo ""
echo "🛠️  Comandos disponibles:"
ls *.sh | while read script; do
    echo "   ./$script"
done