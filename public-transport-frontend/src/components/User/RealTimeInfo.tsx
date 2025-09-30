import React, { useEffect, useState } from 'react';
import { fetchRealTimeData } from '../../services/api';
import { Notification } from '../../types';

const RealTimeInfo: React.FC = () => {
    const [realTimeData, setRealTimeData] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchRealTimeData();
            setRealTimeData(data);
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Fetch data every minute

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleNotification = (notification: Notification) => {
            setNotifications(prev => [...prev, notification]);
        };

        // Assuming websocket connection is established in a separate service
        const websocket = new WebSocket('ws://your-websocket-url');
        websocket.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            handleNotification(notification);
        };

        return () => websocket.close();
    }, []);

    return (
        <div>
            <h2>Real-Time Transport Information</h2>
            <ul>
                {realTimeData.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <h3>Notifications</h3>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default RealTimeInfo;