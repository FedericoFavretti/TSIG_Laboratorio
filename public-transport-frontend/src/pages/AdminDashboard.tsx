// pages/AdminDashboard.tsx - Rediseñada
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'lines' | 'stops' | 'schedules'>('map');
  
  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <button onClick={() => setActiveTab('map')}>Mapa Principal</button>
        <button onClick={() => setActiveTab('lines')}>Gestión de Líneas</button>
        <button onClick={() => setActiveTab('stops')}>Gestión de Paradas</button>
        <button onClick={() => setActiveTab('schedules')}>Gestión de Horarios</button>
      </nav>
      
      <div className="admin-content">
        {activeTab === 'map' && <AdminMap />}
        {activeTab === 'lines' && <LineManagement />}
        {activeTab === 'stops' && <StopManagement />}
        {activeTab === 'schedules' && <ScheduleManagement />}
      </div>
    </div>
  );
};
export default AdminDashboard;