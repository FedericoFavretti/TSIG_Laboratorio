import React, { useState, useEffect } from 'react';
import { updateStop, fetchStop } from '../../services/api';
import { Stop } from '../../types/index';

interface StopEditorProps {
    stopId: string;
}

const StopEditor: React.FC<StopEditorProps> = ({ stopId }) => {
    const [stopData, setStopData] = useState<Partial<Stop>>({ 
        name: '', 
        location: { latitude: 0, longitude: 0 } 
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadStopData = async () => {
            try {
                const data = await fetchStop(stopId);
                setStopData({
                    ...data,
                    location: data.location || { latitude: 0, longitude: 0 }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateStop(stopId, stopData);
            alert('Stop updated successfully');
        } catch (err) {
            setError('Failed to update stop');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Stop Name:
                    <input
                        type="text"
                        name="name"
                        value={stopData.name || ''}
                        onChange={handleNameChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Latitude:
                    <input
                        type="number"
                        step="any"
                        value={stopData.location?.latitude || 0}
                        onChange={handleLatitudeChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Longitude:
                    <input
                        type="number"
                        step="any"
                        value={stopData.location?.longitude || 0}
                        onChange={handleLongitudeChange}
                        required
                    />
                </label>
            </div>
            <button type="submit">Update Stop</button>
        </form>
    );
};

export default StopEditor;