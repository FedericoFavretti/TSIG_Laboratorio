import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Header from './components/common/Header';
import { transportWebSocket } from './services/websocket';
import type { TransportNotification } from './types/index';

// Crear un contexto para las notificaciones
export const NotificationContext = React.createContext<{
  notifications: TransportNotification[];
  connectionStatus: string;
  clearNotifications: () => void; 
  sendWebSocketMessage: (message: any) => void;
}>({
  notifications: [],
  connectionStatus: 'DISCONNECTED',
  clearNotifications: () => {},
  sendWebSocketMessage: () => {}
});

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<TransportNotification[]>([]); 
  const [connectionStatus, setConnectionStatus] = useState<string>('DISCONNECTED');

  useEffect(() => {
    // ✅ URL CORRECTA - Verifica que coincida con tu backend
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/transport-backend/ws/realtime';
    
    console.log('🔄 Iniciando conexión WebSocket:', WS_URL);

    const handleWebSocketMessage = (message: TransportNotification) => {
      console.log('🔔 Nueva notificación WebSocket:', message);
      
      // Manejar diferentes tipos de mensajes
      switch (message.type) {
        case 'connection_established':
          setConnectionStatus('CONNECTED');
          break;
        case 'vehicle_position_update':
          // Actualizar posición de vehículos en tiempo real
          handleVehicleUpdate(message);
          break;
        case 'route_updated':
        case 'stop_updated':
        case 'schedule_updated':
          // Notificaciones importantes - mostrar toast
          showToastNotification(message);
          break;
        default:
          console.log('📨 Mensaje WebSocket no manejado:', message);
      }
      
      // Agregar a la lista de notificaciones
      setNotifications(prev => [message, ...prev.slice(0, 19)]); // Mantener últimas 20
    };

    // Conectar WebSocket
    transportWebSocket.connect(WS_URL, handleWebSocketMessage);
    
    // Verificar estado de conexión periódicamente
    const connectionCheck = setInterval(() => {
      const newStatus = transportWebSocket.getConnectionState();
      setConnectionStatus(newStatus);
      
      if (newStatus === 'DISCONNECTED') {
        console.warn('⚠️ WebSocket desconectado');
      }
    }, 3000);

    // Cleanup
    return () => {
      console.log('🧹 Limpiando WebSocket...');
      transportWebSocket.disconnect();
      clearInterval(connectionCheck);
    };
  }, []);

  const handleVehicleUpdate = (message: TransportNotification) => {
    // Aquí puedes actualizar el estado global de vehículos
    // Por ejemplo, usando un contexto de vehículos o Redux
    console.log('🚌 Actualización de vehículo:', message);
  };

  const showToastNotification = (notification: TransportNotification) => {
    // Mostrar notificación en UI
    if (import.meta.env.DEV) {
      console.log('📢 Notificación importante:', notification);
    }
    
    // Notificaciones del navegador (opcional)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title || 'Sistema de Transporte', {
        body: notification.message,
        icon: '/transport-icon.png'
      });
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const sendWebSocketMessage = (message: any) => {
    transportWebSocket.send(message);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      connectionStatus, 
      clearNotifications,
      sendWebSocketMessage
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
        
        {/* Componente para manejar notificaciones globales */}
        <GlobalNotificationHandler />
      </Router>
    </NotificationContext.Provider>
  );
};

// Componente para manejar notificaciones globales
const GlobalNotificationHandler: React.FC = () => {
  const { notifications } = React.useContext(NotificationContext);

  useEffect(() => {
    // Aquí puedes integrar con un sistema de toasts visual
    notifications.forEach(notification => {
      // Lógica específica para diferentes tipos de notificaciones
    });
  }, [notifications]);

  return null;
};

export default App;