import React, { useState, useEffect } from 'react';
import { updateStop, fetchStop } from '../../services/api';

const StopEditor = ({ stopId }) => {
    const [stopData, setStopData] = useState({ name: '', location: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadStopData = async () => {
            try {
                const data = await fetchStop(stopId);
                setStopData(data);
            } catch (err) {
                setError('Failed to load stop data');
            } finally {
                setLoading(false);
            }
        };

        loadStopData();
    }, [stopId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStopData({ ...stopData, [name]: value });
    };

    const handleSubmit = async (e) => {
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
                        value={stopData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={stopData.location}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <button type="submit">Update Stop</button>
        </form>
    );
};

export default StopEditor;