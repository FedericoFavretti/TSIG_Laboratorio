import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  notificationCount: number;
  connectionStatus: string;
  onClearNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  notificationCount, 
  connectionStatus, 
  onClearNotifications 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'CONNECTED': return '#4CAF50';
      case 'CONNECTING': return '#FF9800';
      case 'DISCONNECTED': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <header style={{ 
      padding: '1rem', 
      backgroundColor: '#f5f5f5', 
      borderBottom: '1px solid #ddd',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
          <h1>Sistema de Transporte</h1>
        </Link>
        
        <nav>
          <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333' }}>
            Inicio
          </Link>
          <Link to="/admin" style={{ textDecoration: 'none', color: '#333' }}>
            Administración
          </Link>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Indicador de estado de conexión */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div 
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: getConnectionColor()
            }}
          />
          <span style={{ fontSize: '0.8rem', color: '#666' }}>
            {connectionStatus}
          </span>
        </div>

        {/* Botón de notificaciones */}
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            position: 'relative',
            padding: '0.5rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          Notificaciones
          {notificationCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#F44336',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {notificationCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '1rem',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '1rem',
            minWidth: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <h3>Notificaciones</h3>
              <button onClick={onClearNotifications}>Limpiar</button>
            </div>
            {/* Aquí podrías listar las notificaciones */}
            <p>Las notificaciones se muestran en tiempo real</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;