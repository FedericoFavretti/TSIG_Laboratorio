##primera configuracion
cd SCRIPTS
chmod +x *.sh
./setup.sh

##UBICADOS EN TSIG_Laboratorio
./SCRIPTS/setup.sh              # Primera config
./SCRIPTS/install.sh            # Instala dependencias
./SCRIPTS/start.sh              # Inicia todo el sistema
./SCRIPTS/status.sh             # Estado de los servicios
./SCRIPTS/stop.sh               # Detiene todo el sistema  
./SCRIPTS/logs.sh               # Muestra logs
./SCRIPTS/deploy.sh             # Despliegue
./SCRIPTS/backup.sh             # Backup de datos
./SCRIPTS/config/environments.sh       # Configuraciones por entorno
./SCRIPTS/config/services.sh           # Configuración de servicios

ver logs
./logs.sh all          # Todos los logs
./logs.sh frontend     # Solo frontend
./logs.sh error        # Solo errores