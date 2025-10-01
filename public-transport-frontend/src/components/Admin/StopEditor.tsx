import React, { useState, useEffect } from 'react';
import { updateStop, fetchStop } from '../../services/api';
import { Stop } from '../../types';

interface StopEditorProps {
    stopId: string;
}

// Definir un tipo para el estado que asegure que location siempre tiene valores
interface StopFormData {
    name: string;
    location: {
        latitude: number;
        longitude: number;
    };
    address?: string;
    isActive: boolean;
}

const StopEditor: React.FC<StopEditorProps> = ({ stopId }) => {
    const [stopData, setStopData] = useState<StopFormData>({ 
        name: '', 
        location: { latitude: 0, longitude: 0 },
        isActive: true
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadStopData = async () => {
            try {
                const data = await fetchStop(stopId);
                // Asegurarnos de que location siempre tiene valores
                setStopData({
                    name: data.name || '',
                    location: {
                        latitude: data.location?.latitude || 0,
                        longitude: data.location?.longitude || 0
                    },
                    address: data.address || '',
                    isActive: data.isActive !== undefined ? data.isActive : true
                });
            } catch (err) {
                setError('Failed to load stop data');
            } finally {
                setLoading(false);
            }
        };

        if (stopId) {
            loadStopData();
        }
    }, [stopId]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setStopData(prev => ({ 
            ...prev, 
            name: value 
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setStopData(prev => ({ 
            ...prev, 
            address: value 
        }));
    };

    const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const latitude = parseFloat(e.target.value) || 0;
        setStopData(prev => ({ 
            ...prev, 
            location: {
                ...prev.location,
                latitude
            }
        }));
    };

    const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const longitude = parseFloat(e.target.value) || 0;
        setStopData(prev => ({ 
            ...prev, 
            location: {
                ...prev.location,
                longitude
            }
        }));
    };

    const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isActive = e.target.checked;
        setStopData(prev => ({ 
            ...prev, 
            isActive 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Convertir a formato Stop para la API
            const stopToUpdate: Partial<Stop> = {
                name: stopData.name,
                location: stopData.location,
                address: stopData.address,
                isActive: stopData.isActive
            };
            
            await updateStop(stopId, stopToUpdate);
            alert('Stop updated successfully');
        } catch (err) {
            setError('Failed to update stop');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h3>Editar Parada</h3>
            
            <div style={{ marginBottom: '1rem' }}>
                <label>
                    Nombre de la Parada:
                    <input
                        type="text"
                        name="name"
                        value={stopData.name}
                        onChange={handleNameChange}
                        required
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label>
                    Dirección (opcional):
                    <input
                        type="text"
                        name="address"
                        value={stopData.address || ''}
                        onChange={handleAddressChange}
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label>
                    Latitud:
                    <input
                        type="number"
                        step="any"
                        value={stopData.location.latitude}
                        onChange={handleLatitudeChange}
                        required
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label>
                    Longitud:
                    <input
                        type="number"
                        step="any"
                        value={stopData.location.longitude}
                        onChange={handleLongitudeChange}
                        required
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        type="checkbox"
                        checked={stopData.isActive}
                        onChange={handleActiveChange}
                    />
                    Parada activa
                </label>
            </div>

            <button 
                type="submit" 
                style={{ 
                    padding: '0.75rem 1.5rem', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Actualizar Parada
            </button>
        </form>
    );
};

export default StopEditor;