import React from 'react';
import type { TransportNotification } from '../../types/index';

interface NotificationListProps {
  notifications: TransportNotification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'route_change':
        return '🛣️';
      case 'stop_disabled':
        return '🚫';
      case 'schedule_update':
        return '⏰';
      case 'line_update':
        return '🚌';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'route_change':
        return '#ffc107';
      case 'stop_disabled':
        return '#dc3545';
      case 'schedule_update':
        return '#17a2b8';
      case 'line_update':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  if (notifications.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: '#6c757d',
        fontStyle: 'italic'
      }}>
        No hay notificaciones recientes
      </div>
    );
  }

  return (
    <div className="notification-list">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          style={{ 
            padding: '0.75rem',
            marginBottom: '0.5rem',
            borderLeft: `4px solid ${getNotificationColor(notification.type)}`,
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>
              {getNotificationIcon(notification.type)}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '0.25rem'
              }}>
                <strong style={{ fontSize: '0.9rem' }}>
                  {notification.title}
                </strong>
                <span style={{ 
                  fontSize: '0.7rem', 
                  color: '#6c757d',
                  whiteSpace: 'nowrap',
                  marginLeft: '0.5rem'
                }}>
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '0.8rem', 
                color: '#495057',
                lineHeight: '1.4'
              }}>
                {notification.message}
              </p>
              {notification.entityId && (
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: '#6c757d',
                  marginTop: '0.25rem'
                }}>
                  ID: {notification.entityId} | Tipo: {notification.entityType}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;