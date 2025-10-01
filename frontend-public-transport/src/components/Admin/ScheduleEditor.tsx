import React, { useState, useEffect } from 'react';
import { fetchSchedules, updateSchedule } from '../../services/api';
import type { Schedule } from '../../types/index'; // Importa el tipo

const ScheduleEditor = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [newScheduleData, setNewScheduleData] = useState<Partial<Schedule> & { id?: string }>({});

    useEffect(() => {
        const loadSchedules = async () => {
            const data = await fetchSchedules();
            setSchedules(data);
        };
        loadSchedules();
    }, []);

    const handleSelectSchedule = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
        setNewScheduleData(schedule);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewScheduleData({ 
            ...newScheduleData, 
            [name]: value 
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newScheduleData.id) {
            await updateSchedule(newScheduleData.id, newScheduleData);
            const updatedSchedules = await fetchSchedules();
            setSchedules(updatedSchedules);
            setSelectedSchedule(null);
            setNewScheduleData({});
        }
    };

    return (
        <div>
            <h2>Schedule Editor</h2>
            <ul>
                {schedules.map((schedule: Schedule) => (
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
                            value={newScheduleData.line || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Time:
                        <input
                            type="text"
                            name="time"
                            value={newScheduleData.time || ''}
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