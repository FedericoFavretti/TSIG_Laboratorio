// types/index.ts
export interface Route {
  id: string;
  name: string;
  details: string;
}

export interface MapFilters {
    companies: string[];
    activeOnly: boolean;
    showDisabled: boolean;
    timeRange: { start: string; end: string };
    searchRadius: number;
}

export interface TimeRange {
    start: string;
    end: string;
}

export interface Stop {
    id: string;
    name: string;
    location: {
        latitude: number;
        longitude: number;
    };
    address?: string;
    isActive: boolean;
    // Agregar estas propiedades
    lines?: string[]; // IDs de las líneas que pasan por esta parada
    routes?: string[]; // Rutas asociadas (para compatibilidad)
}

export interface Schedule {
  id: string;
  line: string;
  time: string;
  routeId?: string;
  stopId?: string;
}

export interface Line {
    id: string;
    code: string;
    origin: string;
    destination: string;
    company: string;
    isActive: boolean;
    // Agregar estas propiedades
    route?: Array<{ lat: number; lng: number }>; // Coordenadas del recorrido
    stops?: string[]; // IDs de paradas en esta línea
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp?: Date;
}

export interface TransportNotification {
  id: string;
  type: 'route_change' | 'stop_disabled' | 'schedule_update' | 'line_update';
  title: string;
  message: string;
  entityId: string;
  entityType: 'route' | 'stop' | 'line' | 'schedule';
  timestamp: Date;
  read?: boolean;
}

export interface Coordinate {
    lat: number;
    lng: number;
}
// Tipos para búsquedas
export interface LineSearchCriteria {
  type: 'code' | 'company' | 'polygon' | 'nearby';
  code?: string;
  destination?: string;
  company?: string;
  polygon?: Array<{ lat: number; lng: number }>;
  location?: { lat: number; lng: number };
  radius?: number;
}

export interface AddressSearchCriteria {
  street: string;
  number?: string;
}

export interface IntersectionSearchCriteria {
  street1: string;
  street2: string;
}

// Tipos para respuestas de búsqueda
export interface SearchResult<T> {
  data: T[];
  total: number;
  filters: LineSearchCriteria;
}

// Tipos para el estado del mapa
export interface MapViewport {
  center: { lat: number; lng: number };
  zoom: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface OrphanedStop extends Stop {
  orphanedSince: Date;
  previousLines: string[];
}

// Para cambios recientes
export interface RecentChange {
  id: string;
  type: 'line' | 'stop' | 'schedule';
  action: 'created' | 'updated' | 'disabled';
  timestamp: Date;
  description: string;
  entityId: string;
  entityName: string;
}

// Para notificaciones en tiempo real
export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  relatedEntity?: {
    type: 'line' | 'stop';
    id: string;
  };
}

// Datos en tiempo real (posición de vehículos, etc.)
export interface RealTimeVehicle {
  id: string;
  line: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed?: number;
  direction?: number;
  nextStop?: string;
  occupancy?: number;
}

export interface RealTimeData {
  vehicles: RealTimeVehicle[];
  lastUpdated: Date;
  totalActive: number;
}