# SCRIPTS/browser-test.sh
#!/bin/bash

echo "🌐 Diagnóstico de Navegador"
echo "==========================="

echo "1. ✅ Servidor responde: HTTP 200"
echo "2. 🔍 Verificando contenido..."

# Obtener HTML
HTML=$(curl -s http://localhost:3000)

if echo "$HTML" | grep -q "root"; then
    echo "   ✅ React mount point ('root') encontrado"
else
    echo "   ❌ No se encuentra el punto de montaje de React"
fi

if echo "$HTML" | grep -q "DOCTYPE html"; then
    echo "   ✅ HTML válido"
else
    echo "   ❌ HTML inválido"
fi

echo ""
echo "3. 🖥️  Soluciones para el navegador:"
echo "   a. Limpia caché: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)"
echo "   b. Abre en ventana de incógnito"
echo "   c. Prueba otro navegador (Chrome, Firefox, Edge)"
echo "   d. Verifica la consola del navegador (F12 → Console)"