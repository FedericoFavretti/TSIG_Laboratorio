// types/index.ts
export interface Route {
  id: string;
  name: string;
  details: string;
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