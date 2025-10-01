// components/Notifications/NotificationSystem.tsx
const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    // WebSocket para notificaciones en tiempo real
    const ws = new WebSocket(WEBSOCKET_URL);
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev]);
    };
    
    return () => ws.close();
  }, []);

  return (
    <div className="notification-system">
      <h3>Cambios Recientes</h3>
      <div className="time-filter">
        <label>Mostrar cambios de las últimas:</label>
        <select>
          <option value="1">1 hora</option>
          <option value="6">6 horas</option>
          <option value="24">24 horas</option>
        </select>
      </div>
      <NotificationList notifications={notifications} />
    </div>
  );
};