export interface Route {
    id: string;
    name: string;
    stops: Stop[];
    schedule: Schedule[];
}

export interface Stop {
    id: string;
    name: string;
    location: {
        latitude: number;
        longitude: number;
    };
}

export interface Schedule {
    routeId: string;
    stopId: string;
    arrivalTime: string;
    departureTime: string;
}

export interface Notification {
    id: string;
    message: string;
    timestamp: Date;
}