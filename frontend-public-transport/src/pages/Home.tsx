import React, { useState, useContext } from 'react';
import TransportMap from '../components/Map/TransportMap';
import LineFilter from '../components/User/LineFilter';
import RealTimeInfo from '../components/User/RealTimeInfo';
import NotificationList from '../components/Notifications/NotificationList';
import type { LineSearchCriteria } from '../types';
import { NotificationContext } from '../App';

const Home: React.FC = () => {
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const { notifications} = useContext(NotificationContext);

    const handleSearch = (criteria: LineSearchCriteria) => {
        console.log('Búsqueda realizada:', criteria);
        // Aquí implementarías la lógica real de búsqueda
        // Por ahora simulamos resultados
        setSearchResults([
            { id: '1', code: '104', destination: 'Aduana', company: 'CUCTSA' },
            { id: '2', code: '105', destination: 'Paso Carrasco', company: 'CUCTSA' },
            { id: '3', code: '200', destination: 'Centro', company: 'COETC' }
        ]);
    };

    const handleClearSearch = () => {
        setSearchResults([]);
    };

    return (
        <div>
            <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
                <div style={{ 
                    width: '300px', 
                    padding: '1rem', 
                    borderRight: '1px solid #ccc',
                    overflowY: 'auto'
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
                                    border: '1px solid #ddd', 
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
                <div style={{ flex: 1 }}>
                    <TransportMap searchResults={searchResults} />
                </div>
            </div>
        </div>
    );
};

export default Home;