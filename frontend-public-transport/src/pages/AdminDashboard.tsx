import React, { useState } from 'react';
// Importar los componentes que faltan
import AdminMap from '../components/Map/AdminMap';
import LineManagement from '../components/Admin/LineManagement';
import StopManagement from '../components/Admin/StopManagement';
import ScheduleManagement from '../components/Admin/ScheduleManagement';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'map' | 'lines' | 'stops' | 'schedules'>('map');
    
    return (
        <div className="admin-dashboard" style={{ padding: '1rem' }}>
            <h1>Panel de Administración</h1>
            
            <nav className="admin-nav" style={{ 
                marginBottom: '1rem',
                borderBottom: '1px solid #ccc',
                paddingBottom: '0.5rem'
            }}>
                <button 
                    onClick={() => setActiveTab('map')}
                    style={{ 
                        marginRight: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: activeTab === 'map' ? '#007bff' : 'transparent',
                        color: activeTab === 'map' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Mapa Principal
                </button>
                <button 
                    onClick={() => setActiveTab('lines')}
                    style={{ 
                        marginRight: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: activeTab === 'lines' ? '#007bff' : 'transparent',
                        color: activeTab === 'lines' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Gestión de Líneas
                </button>
                <button 
                    onClick={() => setActiveTab('stops')}
                    style={{ 
                        marginRight: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: activeTab === 'stops' ? '#007bff' : 'transparent',
                        color: activeTab === 'stops' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Gestión de Paradas
                </button>
                <button 
                    onClick={() => setActiveTab('schedules')}
                    style={{ 
                        padding: '0.5rem 1rem',
                        backgroundColor: activeTab === 'schedules' ? '#007bff' : 'transparent',
                        color: activeTab === 'schedules' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Gestión de Horarios
                </button>
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