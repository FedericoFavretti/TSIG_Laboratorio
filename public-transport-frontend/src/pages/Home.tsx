import React from 'react';
import Header from '../components/common/Header';
import TransportMap from '../components/Map/TransportMap';
import NotificationList from '../components/Notifications/NotificationList';

const Home: React.FC = () => {
    return (
        <div>
            <Header />
            <h1>Welcome to the Public Transport Information Tool</h1>
            <p>Find real-time information about routes, stops, and schedules.</p>
            <TransportMap />
            <NotificationList />
        </div>
    );
};

export default Home;