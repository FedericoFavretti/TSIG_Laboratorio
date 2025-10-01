import React, { useState, useEffect } from 'react';
import { updateRoute, fetchRoutes } from '../../services/api';
import type { Route } from '../../types/index';

const RouteEditor = () => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
    const [routeName, setRouteName] = useState<string>('');
    const [routeDetails, setRouteDetails] = useState<string>('');

    useEffect(() => {
        const loadRoutes = async () => {
            const fetchedRoutes = await fetchRoutes();
            setRoutes(fetchedRoutes);
        };
        loadRoutes();
    }, []);

    const handleSelectRoute = (route: Route) => {
        setSelectedRoute(route);
        setRouteName(route.name);
        setRouteDetails(route.details);
    };

    const handleUpdateRoute = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRoute) {
            await updateRoute(selectedRoute.id, { 
                name: routeName, 
                details: routeDetails 
            });
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
            <select 
                onChange={(e) => {
                    const selected = JSON.parse(e.target.value);
                    handleSelectRoute(selected);
                }}
            >
                <option value="">Select a route</option>
                {routes.map((route: Route) => (
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