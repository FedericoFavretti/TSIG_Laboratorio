import axios from 'axios';
import type { 
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
  create: (lineData: Omit<Line, 'id'>) => axios.post('/api/lines', lineData),//Omit excluye el campo id, create crea una nueva línea
  update: (id: string, lineData: Partial<Line>) => axios.put(`/api/lines/${id}`, lineData),//Partial permite actualizar solo algunos campos, update actualiza una línea existente
  findNearby: (location: { lat: number; lng: number }, radius: number) => //findNearby encuentra líneas cercanas a una ubicación dada(latitud y longitud) dentro de un radio especificado
    axios.get(`/api/lines/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radius}`),
  search: (criteria: LineSearchCriteria) => axios.post('/api/lines/search', criteria)//search busca líneas basadas en criterios específicos(como nombre, código, etc.)
};

export const searchAPI = {
  byAddress: (criteria: AddressSearchCriteria) =>//byAddress busca ubicaciones basadas en criterios de dirección específicos(como calle, ciudad, código postal, etc.) 
    axios.post('/api/search/address', criteria),
  byIntersection: (criteria: IntersectionSearchCriteria) => //byIntersection busca ubicaciones basadas en criterios de intersección específicos(como dos calles que se cruzan)
    axios.post('/api/search/intersection', criteria),
  byCompany: (company: string) => //byCompany busca líneas o servicios asociados con una compañía específica
    axios.get(`/api/search/company/${company}`),
  inPolygon: (polygon: Array<{ lat: number; lng: number }>) => //inPolygon busca ubicaciones dentro de un polígono definido por una serie de coordenadas(latitud y longitud)
    axios.post('/api/search/polygon', { polygon })
};

export const stopAPI = {
  create: (stopData: Omit<Stop, 'id'>) => {//Omit excluye el campo id, create crea una nueva parada
    // Lógica para asociar automáticamente líneas dentro de 10m
    return axios.post('/api/stops', stopData);
  },
  findOrphaned: () => axios.get('/api/stops/orphaned')//findOrphaned encuentra paradas que no están asociadas con ninguna línea
};

export const fetchRoutes = async () => {//fetchRoutes obtiene todas las rutas disponibles
    const response = await axios.get(`${API_BASE_URL}/routes`);
    return response.data;
};

export const fetchStop = async (stopId: string): Promise<Stop> => {//fetchStop obtiene detalles de una parada específica por su ID
    const response = await axios.get(`${API_BASE_URL}/stops/${stopId}`);
    return response.data;
};

export const fetchSchedules = async () => {//fetchSchedules obtiene todos los horarios disponibles
    const response = await axios.get(`${API_BASE_URL}/schedules`);
    return response.data;
};

export const updateRoute = async (routeId: string, routeData: Partial<Route>): Promise<Route> => {//updateRoute actualiza los detalles de una ruta específica por su ID
    const response = await axios.put(`${API_BASE_URL}/routes/${routeId}`, routeData);
    return response.data;
};

export const updateStop = async (stopId: string, stopData: Partial<Stop>): Promise<Stop> => {//updateStop actualiza los detalles de una parada específica por su ID
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

export const updateSchedule = async (scheduleId: string, scheduleData: Partial<Schedule>): Promise<Schedule> => {//updateSchedule actualiza los detalles de un horario específico por su ID
    const response = await axios.put(`${API_BASE_URL}/schedules/${scheduleId}`, scheduleData);
    return response.data;
};

export async function fetchTransportData() {//fetchTransportData obtiene datos de transporte desde un endpoint específico
    const response = await fetch('http://localhost:8080/api/transport');
    return response.json();
}

export const fetchRealTimeData = async (): Promise<RealTimeData> => {//fetchRealTimeData obtiene datos en tiempo real de todos los vehículos
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
export const fetchRealTimeDataByLine = async (lineCode: string): Promise<RealTimeVehicle[]> => {//fetchRealTimeDataByLine obtiene datos en tiempo real de vehículos asociados a una línea específica
  try {
    const response = await axios.get(`${API_BASE_URL}/realtime/vehicles/${lineCode}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching real-time data for line ${lineCode}:`, error);
    return [];
  }
};

// Para obtener datos en tiempo real de una parada específica
export const fetchRealTimeDataByStop = async (stopId: string): Promise<RealTimeVehicle[]> => {//fetchRealTimeDataByStop obtiene datos en tiempo real de vehículos asociados a una parada específica
  try {
    const response = await axios.get(`${API_BASE_URL}/realtime/stop/${stopId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching real-time data for stop ${stopId}:`, error);
    return [];
  }
};