import React, { useState, useEffect } from 'react';
import { fetchSchedules, updateSchedule } from '../../services/api';

const ScheduleEditor = () => {
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [newScheduleData, setNewScheduleData] = useState({});

    useEffect(() => {
        const loadSchedules = async () => {
            const data = await fetchSchedules();
            setSchedules(data);
        };
        loadSchedules();
    }, []);

    const handleSelectSchedule = (schedule) => {
        setSelectedSchedule(schedule);
        setNewScheduleData(schedule);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewScheduleData({ ...newScheduleData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateSchedule(newScheduleData);
        const updatedSchedules = await fetchSchedules();
        setSchedules(updatedSchedules);
        setSelectedSchedule(null);
        setNewScheduleData({});
    };

    return (
        <div>
            <h2>Schedule Editor</h2>
            <ul>
                {schedules.map((schedule) => (
                    <li key={schedule.id} onClick={() => handleSelectSchedule(schedule)}>
                        {schedule.line} - {schedule.time}
                    </li>
                ))}
            </ul>
            {selectedSchedule && (
                <form onSubmit={handleSubmit}>
                    <h3>Edit Schedule</h3>
                    <label>
                        Line:
                        <input
                            type="text"
                            name="line"
                            value={newScheduleData.line}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Time:
                        <input
                            type="text"
                            name="time"
                            value={newScheduleData.time}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Update Schedule</button>
                </form>
            )}
        </div>
    );
};

export default ScheduleEditor;