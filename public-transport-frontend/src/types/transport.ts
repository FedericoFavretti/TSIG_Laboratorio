//import { Route, Stop, Schedule } from '../../types/transport';

// Tipo para una Ruta
export interface Route {
    id: string;
    name: string;
    details: string;
}

// Tipo para una Parada
export interface Stop {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
}

// Tipo para un Horario
export interface Schedule {
    id: string;
    line: string;
    routeId: string;
    stopId: string;
    time: string; // o Date si lo manejas como objeto Date
}