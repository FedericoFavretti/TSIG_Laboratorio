import React from 'react';
import RouteEditor from '../components/Admin/RouteEditor';
import StopEditor from '../components/Admin/StopEditor';
import ScheduleEditor from '../components/Admin/ScheduleEditor';
import Header from '../components/common/Header';

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <Header />
            <h1>Admin Dashboard</h1>
            <div>
                <h2>Edit Routes</h2>
                <RouteEditor />
            </div>
            <div>
                <h2>Edit Stops</h2>
                <StopEditor />
            </div>
            <div>
                <h2>Edit Schedules</h2>
                <ScheduleEditor />
            </div>
        </div>
    );
};

export default AdminDashboard;