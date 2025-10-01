import React, { useState, useEffect } from 'react';
import { fetchRealTimeData} from '../../services/api';
import { RealTimeData, RealTimeVehicle } from '../../types';

const RealTimeInfo: React.FC = () => {
    const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadRealTimeData = async () => {
            try {
                setLoading(true);
                const data = await fetchRealTimeData();
                setRealTimeData(data);
            } catch (err) {
                setError('Error al cargar datos en tiempo real');
                console.error('Error loading real-time data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadRealTimeData();
        
        // Actualizar cada 30 segundos
        const interval = setInterval(loadRealTimeData, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const getVehicleStatus = (vehicle: RealTimeVehicle): string => {
        if (vehicle.speed && vehicle.speed < 1) return '🛑 Detenido';
        if (vehicle.speed && vehicle.speed < 10) return '🚶‍♂️ Lento';
        return '🚀 En movimiento';
    };

    const getOccupancyStatus = (occupancy?: number): string => {
        if (!occupancy) return 'N/A';
        if (occupancy < 30) return '🟢 Baja';
        if (occupancy < 70) return '🟡 Media';
        return '🔴 Alta';
    };

    if (loading) {
        return (
            <div style={{ 
                padding: '1rem', 
                textAlign: 'center',
                color: '#6c757d'
            }}>
                Cargando datos en tiempo real...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                padding: '1rem', 
                textAlign: 'center',
                color: '#dc3545'
            }}>
                {error}
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6',
            borderRadius: '4px'
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>🚍 Información en Tiempo Real</h3>
            
            {realTimeData && (
                <>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        padding: '0.5rem',
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px'
                    }}>
                        <div>
                            <strong>Vehículos activos:</strong> {realTimeData.totalActive}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                            Actualizado: {new Date(realTimeData.lastUpdated).toLocaleTimeString()}
                        </div>
                    </div>

                    {realTimeData.vehicles.length === 0 ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '1rem',
                            color: '#6c757d',
                            fontStyle: 'italic'
                        }}>
                            No hay vehículos activos en este momento
                        </div>
                    ) : (
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {realTimeData.vehicles.slice(0, 10).map((vehicle) => (
                                <div 
                                    key={vehicle.id}
                                    style={{ 
                                        padding: '0.75rem',
                                        marginBottom: '0.5rem',
                                        backgroundColor: 'white',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '0.25rem'
                                    }}>
                                        <strong>Línea {vehicle.line}</strong>
                                        <span style={{ 
                                            fontSize: '0.8rem', 
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            padding: '0.1rem 0.4rem',
                                            borderRadius: '4px'
                                        }}>
                                            {vehicle.id}
                                        </span>
                                    </div>
                                    
                                    <div style={{ fontSize: '0.8rem', color: '#495057' }}>
                                        <div>📍 {getVehicleStatus(vehicle)}</div>
                                        {vehicle.speed && (
                                            <div>📏 Velocidad: {vehicle.speed.toFixed(1)} km/h</div>
                                        )}
                                        {vehicle.nextStop && (
                                            <div>⏭️ Próxima parada: {vehicle.nextStop}</div>
                                        )}
                                        <div>👥 Ocupación: {getOccupancyStatus(vehicle.occupancy)}</div>
                                        <div style={{ 
                                            fontSize: '0.7rem', 
                                            color: '#6c757d',
                                            marginTop: '0.25rem'
                                        }}>
                                            Actualizado: {new Date(vehicle.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {realTimeData.vehicles.length > 10 && (
                                <div style={{ 
                                    textAlign: 'center', 
                                    padding: '0.5rem',
                                    fontSize: '0.8rem',
                                    color: '#6c757d'
                                }}>
                                    Y {realTimeData.vehicles.length - 10} vehículos más...
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            <div style={{ 
                marginTop: '1rem', 
                padding: '0.5rem',
                backgroundColor: '#e7f3ff',
                border: '1px solid #b3d9ff',
                borderRadius: '4px',
                fontSize: '0.8rem'
            }}>
                ℹ️ Los datos se actualizan automáticamente cada 30 segundos
            </div>
        </div>
    );
};

export default RealTimeInfo;