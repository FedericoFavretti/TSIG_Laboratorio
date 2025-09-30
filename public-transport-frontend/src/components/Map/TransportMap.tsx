import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { fetchTransportData } from '../../services/api';
import 'leaflet/dist/leaflet.css';

const TransportMap = () => {
    const [stops, setStops] = useState([]);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        const loadTransportData = async () => {
            const data = await fetchTransportData();
            setStops(data.stops);
            setRoutes(data.routes);
        };

        loadTransportData();
    }, []);

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {stops.map(stop => (
                <Marker key={stop.id} position={[stop.latitude, stop.longitude]}>
                    <Popup>
                        <strong>{stop.name}</strong><br />
                        Routes: {stop.routes.join(', ')}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default TransportMap;