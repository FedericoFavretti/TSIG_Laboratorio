import React, { useState, useEffect } from 'react';
import { TransportNotification } from '../../types/index';
import { transportWebSocket } from '../../services/websocket';
import NotificationList from './NotificationList';

const WEBSOCKET_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws';

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<TransportNotification[]>([]);
  const [timeFilter, setTimeFilter] = useState<number>(1); // 1 hora por defecto
  
  useEffect(() => {
    const handleWebSocketMessage = (notification: TransportNotification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Mantener solo las últimas 10
    };

    // Conectar WebSocket usando nuestra clase
    transportWebSocket.connect(WEBSOCKET_URL, handleWebSocketMessage);
    
    return () => {
      transportWebSocket.disconnect();
    };
  }, []);

  // Filtrar notificaciones por tiempo
  const filteredNotifications = notifications.filter(notification => {
    const notificationTime = new Date(notification.timestamp).getTime();
    const currentTime = new Date().getTime();
    const hoursAgo = timeFilter;
    const timeThreshold = currentTime - (hoursAgo * 60 * 60 * 1000);
    
    return notificationTime >= timeThreshold;
  });

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="notification-system" style={{ 
      padding: '1rem', 
      backgroundColor: '#f8f9fa', 
      border: '1px solid #dee2e6',
      borderRadius: '4px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Cambios Recientes</h3>
        <button 
          onClick={clearNotifications}
          style={{ 
            padding: '0.25rem 0.5rem', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          Limpiar
        </button>
      </div>
      
      <div className="time-filter" style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Mostrar cambios de las últimas:</span>
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(Number(e.target.value))}
            style={{ padding: '0.25rem' }}
          >
            <option value="1">1 hora</option>
            <option value="6">6 horas</option>
            <option value="24">24 horas</option>
          </select>
        </label>
      </div>
      
      <NotificationList notifications={filteredNotifications} />
    </div>
  );
};

export default NotificationSystem;