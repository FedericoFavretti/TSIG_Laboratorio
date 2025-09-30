import React, { useState, useEffect } from 'react';
import { updateRoute, fetchRoutes } from '../../services/api';

const RouteEditor = () => {
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [routeName, setRouteName] = useState('');
    const [routeDetails, setRouteDetails] = useState('');

    useEffect(() => {
        const loadRoutes = async () => {
            const fetchedRoutes = await fetchRoutes();
            setRoutes(fetchedRoutes);
        };
        loadRoutes();
    }, []);

    const handleSelectRoute = (route) => {
        setSelectedRoute(route);
        setRouteName(route.name);
        setRouteDetails(route.details);
    };

    const handleUpdateRoute = async (e) => {
        e.preventDefault();
        if (selectedRoute) {
            await updateRoute(selectedRoute.id, { name: routeName, details: routeDetails });
            alert('Route updated successfully!');
            setSelectedRoute(null);
            setRouteName('');
            setRouteDetails('');
            const updatedRoutes = await fetchRoutes();
            setRoutes(updatedRoutes);
        }
    };

    return (
        <div>
            <h2>Route Editor</h2>
            <select onChange={(e) => handleSelectRoute(JSON.parse(e.target.value))}>
                <option value="">Select a route</option>
                {routes.map((route) => (
                    <option key={route.id} value={JSON.stringify(route)}>
                        {route.name}
                    </option>
                ))}
            </select>
            {selectedRoute && (
                <form onSubmit={handleUpdateRoute}>
                    <div>
                        <label>Route Name:</label>
                        <input
                            type="text"
                            value={routeName}
                            onChange={(e) => setRouteName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Route Details:</label>
                        <textarea
                            value={routeDetails}
                            onChange={(e) => setRouteDetails(e.target.value)}
                        />
                    </div>
                    <button type="submit">Update Route</button>
                </form>
            )}
        </div>
    );
};

export default RouteEditor;