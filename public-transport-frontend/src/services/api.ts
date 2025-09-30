import axios from 'axios';

const API_BASE_URL = 'https://api.publictransport.com'; // Replace with your actual API base URL

export const fetchRoutes = async () => {
    const response = await axios.get(`${API_BASE_URL}/routes`);
    return response.data;
};

export const fetchStops = async () => {
    const response = await axios.get(`${API_BASE_URL}/stops`);
    return response.data;
};

export const fetchSchedules = async () => {
    const response = await axios.get(`${API_BASE_URL}/schedules`);
    return response.data;
};

export const updateRoute = async (routeId, routeData) => {
    const response = await axios.put(`${API_BASE_URL}/routes/${routeId}`, routeData);
    return response.data;
};

export const updateStop = async (stopId, stopData) => {
    const response = await axios.put(`${API_BASE_URL}/stops/${stopId}`, stopData);
    return response.data;
};

export const updateSchedule = async (scheduleId, scheduleData) => {
    const response = await axios.put(`${API_BASE_URL}/schedules/${scheduleId}`, scheduleData);
    return response.data;
};