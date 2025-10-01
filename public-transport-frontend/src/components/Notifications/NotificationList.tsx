// components/Notifications/NotificationList.tsx
import React, { useState, useEffect } from 'react';
import { transportWebSocket, TransportNotification } from '../../services/websocket';

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<TransportNotification[]>([]);

  useEffect(() => {
    const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws';
    
    const handleWebSocketMessage = (message: TransportNotification) => {
      setNotifications(prev => [message, ...prev.slice(0, 9)]); // Mantener solo las últimas 10
    };

    transportWebSocket.connect(WS_URL, handleWebSocketMessage);

    return () => {
      transportWebSocket.disconnect();
    };
  }, []);

  return (
    <div className="notification-list">
      <h3>Notificaciones en Tiempo Real</h3>
      <div className="connection-status">
        Estado: {transportWebSocket.getConnectionState()}
      </div>
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <strong>{notification.title}</strong>
          <p>{notification.message}</p>
          <small>{new Date(notification.timestamp).toLocaleTimeString()}</small>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;