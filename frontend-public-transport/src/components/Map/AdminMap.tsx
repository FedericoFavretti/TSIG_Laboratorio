import React, { useState } from 'react';
import TransportMap from './TransportMap';

const AdminMap: React.FC = () => {
    const [selectedTool, setSelectedTool] = useState<'line' | 'stop' | null>(null);
    const [draftLine, setDraftLine] = useState<Array<{ lat: number; lng: number }>>([]);
    const [newStopData, setNewStopData] = useState<{ name: string; address: string }>({
        name: '',
        address: ''
    });

    const handleMapClick = (coordinates: { lat: number; lng: number }) => {
        if (selectedTool === 'stop') {
            console.log('Agregar parada en:', coordinates);
            // Abrir modal para ingresar datos de la parada
            const stopName = prompt('Nombre de la parada:');
            if (stopName) {
                const address = prompt('Dirección (opcional):') || '';
                // Aquí llamarías a la API para crear la parada
                console.log('Creando parada:', { name: stopName, address, coordinates });
                alert(`Parada "${stopName}" creada en: ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`);
            }
        } else if (selectedTool === 'line') {
            console.log('Agregar punto de línea en:', coordinates);
            setDraftLine(prev => [...prev, coordinates]);
            
            if (draftLine.length >= 1) {
                const confirmLine = window.confirm(
                    `Punto ${draftLine.length + 1} agregado. ¿Desea finalizar el trazado de la línea?`
                );
                if (confirmLine) {
                    const lineCode = prompt('Código de la línea (ej: 104-este):');
                    const origin = prompt('Origen:');
                    const destination = prompt('Destino:');
                    const company = prompt('Empresa:');
                    
                    if (lineCode && origin && destination && company) {
                        // Aquí llamarías a la API para crear la línea
                        console.log('Creando línea:', { 
                            code: lineCode, 
                            origin, 
                            destination, 
                            company,
                            route: [...draftLine, coordinates] 
                        });
                        alert(`Línea "${lineCode}" creada con ${draftLine.length + 1} puntos`);
                        setDraftLine([]);
                        setSelectedTool(null);
                    }
                }
            }
        }
    };

    const clearDraftLine = () => {
        setDraftLine([]);
        setSelectedTool(null);
    };

    const handleCreateStop = (coordinates: { lat: number; lng: number }) => {
        if (newStopData.name.trim()) {
            // Lógica para crear parada
            console.log('Creando parada:', { ...newStopData, coordinates });
            alert(`Parada "${newStopData.name}" creada exitosamente`);
            setNewStopData({ name: '', address: '' });
            setSelectedTool(null);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Mapa de Administración</h2>
            
            {/* Barra de herramientas */}
            <div style={{ 
                marginBottom: '1rem', 
                padding: '1rem', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                border: '1px solid #ddd'
            }}>
                <h3>Herramientas de Administración</h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => setSelectedTool('stop')}
                        style={{ 
                            padding: '0.5rem 1rem',
                            backgroundColor: selectedTool === 'stop' ? '#28a745' : '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        🚏 Agregar Parada
                    </button>
                    <button 
                        onClick={() => setSelectedTool('line')}
                        style={{ 
                            padding: '0.5rem 1rem',
                            backgroundColor: selectedTool === 'line' ? '#007bff' : '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        🛣️ Dibujar Línea
                    </button>
                    
                    {draftLine.length > 0 && (
                        <button 
                            onClick={clearDraftLine}
                            style={{ 
                                padding: '0.5rem 1rem',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            ❌ Cancelar Línea ({draftLine.length} puntos)
                        </button>
                    )}
                </div>
                
                {selectedTool && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                        <p style={{ margin: 0 }}>
                            <strong>Modo: {selectedTool === 'stop' ? 'Agregar Parada' : 'Dibujar Línea'}</strong> - 
                            Haz clic en el mapa para {selectedTool === 'stop' ? 'colocar una parada' : 'agregar puntos a la línea'}
                        </p>
                        {selectedTool === 'line' && draftLine.length > 0 && (
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                                Puntos agregados: {draftLine.length}. Haz clic para agregar más puntos o finaliza con el diálogo.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Mapa */}
            <div style={{ 
                height: '70vh', 
                border: '2px solid #007bff',
                borderRadius: '4px',
                position: 'relative'
            }}>
                <TransportMap 
                    isAdmin={true}
                    onMapClick={handleMapClick}
                    draftPoints={draftLine}
                />
            </div>

            {/* Panel de información */}
            <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: '#e7f3ff', 
                borderRadius: '4px',
                border: '1px solid #b3d9ff'
            }}>
                <h4>Instrucciones para Administradores:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    <li><strong>Agregar Parada:</strong> Selecciona la herramienta y haz clic en el mapa. Ingresa nombre y dirección.</li>
                    <li><strong>Dibujar Línea:</strong> Selecciona la herramienta y haz clic para agregar puntos. Finaliza con el diálogo.</li>
                    <li><strong>Las paradas</strong> se asocian automáticamente con líneas que pasen a menos de 10 metros.</li>
                    <li><strong>Las líneas huérfanas</strong> se mostrarán con advertencias hasta ser asociadas.</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminMap;