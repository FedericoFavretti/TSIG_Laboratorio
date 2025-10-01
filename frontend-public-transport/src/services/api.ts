import axios from 'axios';
import { 
  Route, 
  Stop, 
  Schedule, 
  Line, 
  LineSearchCriteria, 
  AddressSearchCriteria,
  IntersectionSearchCriteria, 
  RealTimeData, 
  RealTimeVehicle
} from '../types';


const API_BASE_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001/api';

// services/api.ts
export const lineAPI = {
  create: (lineData: Omit<Line, 'id'>) => axios.post('/api/lines', lineData),
  update: (id: string, lineData: Partial<Line>) => axios.put(`/api/lines/${id}`, lineData),
  findNearby: (location: { lat: number; lng: number }, radius: number) => 
    axios.get(`/api/lines/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radius}`),
  search: (criteria: LineSearchCriteria) => axios.post('/api/lines/search', criteria)
};

export const searchAPI = {
  byAddress: (criteria: AddressSearchCriteria) => 
    axios.post('/api/search/address', criteria),
  byIntersection: (criteria: IntersectionSearchCriteria) => 
    axios.post('/api/search/intersection', criteria),
  byCompany: (company: string) => 
    axios.get(`/api/search/company/${company}`),
  inPolygon: (polygon: Array<{ lat: number; lng: number }>) => 
    axios.post('/api/search/polygon', { polygon })
};

export const stopAPI = {
  create: (stopData: Omit<Stop, 'id'>) => {
    // Lógica para asociar automáticamente líneas dentro de 10m
    return axios.post('/api/stops', stopData);
  },
  findOrphaned: () => axios.get('/api/stops/orphaned')
};

export const fetchRoutes = async () => {
    const response = await axios.get(`${API_BASE_URL}/routes`);
    return response.data;
};

export const fetchStop = async (stopId: string): Promise<Stop> => {
    const response = await axios.get(`${API_BASE_URL}/stops/${stopId}`);
    return response.data;
};

export const fetchSchedules = async () => {
    const response = await axios.get(`${API_BASE_URL}/schedules`);
    return response.data;
};

export const updateRoute = async (routeId: string, routeData: Partial<Route>): Promise<Route> => {
    const response = await axios.put(`${API_BASE_URL}/routes/${routeId}`, routeData);
    return response.data;
};

export const updateStop = async (stopId: string, stopData: Partial<Stop>): Promise<Stop> => {
    // Convertir a formato que PostGIS espera
    const postData = {
        ...stopData,
        // Si tu backend espera un formato específico para coordenadas
        coordinates: stopData.location ? 
            `POINT(${stopData.location.longitude} ${stopData.location.latitude})` : 
            null
    };
    
    const response = await axios.put(`${API_BASE_URL}/stops/${stopId}`, postData);
    return response.data;
};

export const updateSchedule = async (scheduleId: string, scheduleData: Partial<Schedule>): Promise<Schedule> => {
    const response = await axios.put(`${API_BASE_URL}/schedules/${scheduleId}`, scheduleData);
    return response.data;
};

export async function fetchTransportData() {
    const response = await fetch('http://localhost:8080/api/transport');
    return response.json();
}

export const fetchRealTimeData = async (): Promise<RealTimeData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/realtime/vehicles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    // Retornar datos de ejemplo si hay error
    return {
      vehicles: [],
      lastUpdated: new Date(),
      totalActive: 0
    };
  }
};

// Para obtener datos en tiempo real de una línea específica
export const fetchRealTimeDataByLine = async (lineCode: string): Promise<RealTimeVehicle[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/realtime/vehicles/${lineCode}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching real-time data for line ${lineCode}:`, error);
    return [];
  }
};

// Para obtener datos en tiempo real de una parada específica
export const fetchRealTimeDataByStop = async (stopId: string): Promise<RealTimeVehicle[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/realtime/stop/${stopId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching real-time data for stop ${stopId}:`, error);
    return [];
  }
};