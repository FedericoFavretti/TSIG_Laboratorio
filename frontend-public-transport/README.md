##CREAR PROYECTO VITE
cd TSIG_Laboratorio ##si o si estar en la carpeta donde tengan el laboratorio
1-npm create vite ##si pide instalar vite create lo instalan
2-nombre: frontend-public-transport
3-seleccionan react
4-variante TS
5-ejecutar ./SCRIPTS/install.sh (instala dependencias)

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



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
