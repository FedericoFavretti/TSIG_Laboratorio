import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Header from './components/common/Header';
import { transportWebSocket } from './services/websocket';
import type { TransportNotification } from './types/index';

// Crear un contexto para las notificaciones (opcional pero recomendado)
export const NotificationContext = React.createContext<{
  notifications: TransportNotification[];
  connectionStatus: string;
  clearNotifications: () => void; // Agregar esta línea
}>({
  notifications: [],
  connectionStatus: 'DISCONNECTED',
  clearNotifications: () => {} // Agregar esta línea
});

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<TransportNotification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('DISCONNECTED');

  useEffect(() => {
    const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws';
    
    const handleWebSocketMessage = (message: TransportNotification) => {
      console.log('Nueva notificación recibida:', message);
      setNotifications(prev => [message, ...prev.slice(0, 19)]); // Mantener últimas 20
      
      // Mostrar notificación toast si es crítica
      if (message.type === 'stop_disabled' || message.type === 'route_change') {
        showToastNotification(message);
      }
    };

    // Conectar WebSocket
    transportWebSocket.connect(WS_URL, handleWebSocketMessage);
    
    // Verificar estado de conexión periódicamente
    const connectionCheck = setInterval(() => {
      setConnectionStatus(transportWebSocket.getConnectionState());
    }, 5000);

    return () => {
      transportWebSocket.disconnect();
      clearInterval(connectionCheck);
    };
  }, []);

  const showToastNotification = (notification: TransportNotification) => {
    // Aquí podrías integrar con una librería de toasts o crear una propia
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/transport-icon.png'
      });
    } else if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/transport-icon.png'
          });
        }
      });
    }
    
    // También mostrar en consola para desarrollo
    console.log('Toast:', notification.title, '-', notification.message);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      connectionStatus, 
      clearNotifications 
    }}>
      <Router>
        <Header 
          notificationCount={notifications.length}
          connectionStatus={connectionStatus}
          onClearNotifications={clearNotifications}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route element={<NotFound/>} />
        </Routes>
        
        {/* Componente de notificaciones toast (opcional) */}
        <GlobalNotificationHandler />
      </Router>
    </NotificationContext.Provider>
  );
};

// Componente para manejar notificaciones globales
const GlobalNotificationHandler: React.FC = () => {
  const { notifications } = React.useContext(NotificationContext);

  useEffect(() => {
    // Aquí podrías integrar con un sistema de toasts visual
    notifications.forEach(notification => {
      if (notification.type === 'route_change') {
        // Lógica específica para cambios de ruta
        console.warn('Cambio de ruta detectado:', notification);
      }
    });
  }, [notifications]);

  return null; // Este componente no renderiza nada visible
};

export default App;