import React, { useState, useContext } from 'react';
import TransportMap from '../components/Map/TransportMap';
import LineFilter from '../components/User/LineFilter';
import RealTimeInfo from '../components/User/RealTimeInfo';
import NotificationList from '../components/Notifications/NotificationList';
import type { LineSearchCriteria } from '../types';
import { NotificationContext } from '../App';

const Home: React.FC = () => {
    const [searchResults, setSearchResults] = useState<any[]>([]);// Estado para almacenar los resultados de búsqueda
    const { notifications} = useContext(NotificationContext);// Usamos el contexto para obtener las notificaciones

    const handleSearch = (criteria: LineSearchCriteria) => {//handleSearch deberia realizar la busqueda en la API
        console.log('Búsqueda realizada:', criteria);
        // Aquí implementarías la lógica real de búsqueda
        // Por ahora simulamos resultados
        setSearchResults([// Ingresamos datos de ejemplo
            { id: '1', code: '104', destination: 'Aduana', company: 'CUCTSA' },
            { id: '2', code: '105', destination: 'Paso Carrasco', company: 'CUCTSA' },
            { id: '3', code: '200', destination: 'Centro', company: 'COETC' }
        ]);
    };

    const handleClearSearch = () => {
        setSearchResults([]);// Limpiamos los resultados de búsqueda
    };

    return (
        <div>
            <div style={{ display: 'flex', height: 'calc(100vh - 80px)', width: '100%' }}>
                <div style={{ 
                    width: '300px', 
                    padding: '1rem', 
                    borderRight: '1px solid #686868ff',
                    overflowY: 'auto',
                    backgroundColor: '#ccccccff'
                }}>
                    <LineFilter onSearch={handleSearch} />
                    <RealTimeInfo />
                    <NotificationList notifications={notifications}/>
                    {/* Mostrar resultados de búsqueda */}
                    {searchResults.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            <h4>Resultados de búsqueda:</h4>
                            <button 
                                onClick={handleClearSearch}
                                style={{ marginBottom: '0.5rem' }}
                            >
                                Limpiar búsqueda
                            </button>
                            {searchResults.map(result => (
                                <div key={result.id} style={{ 
                                    padding: '0.5rem', 
                                    border: '1px solid #7a7a7aff', 
                                    marginBottom: '0.5rem',
                                    borderRadius: '4px'
                                }}>
                                    <strong>{result.code}</strong> - {result.destination}
                                    <br />
                                    <small>{result.company}</small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div style={{ 
                    flex: 1,
                    backgroundColor: '#e6b8b7ff'
                }}>
                    <TransportMap searchResults={searchResults} />
                </div>
            </div>
        </div>
    );
};

export default Home;