import type { TransportNotification, WebSocketMessage } from '../types/index';

class TransportWebSocket {
  private socket: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 3000;
  private messageHandlers: ((message: TransportNotification) => void)[] = [];

  connect(url: string, onMessage: (message: TransportNotification) => void): void {
    try {
      // Verificar que la URL sea correcta
      if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
        console.error('❌ URL WebSocket inválida:', url);
        return;
      }

      console.log('🔌 Conectando WebSocket a:', url);
      this.socket = new WebSocket(url);
      this.messageHandlers.push(onMessage);

      this.socket.onopen = (event: Event) => {
        console.log('✅ WebSocket conectado exitosamente');
        this.reconnectAttempts = 0;
        
        // Suscribirse a actualizaciones automáticamente
        this.send({
          type: 'subscribe_vehicles',
          payload: { topics: ['vehicles', 'routes', 'stops'] }
        });
      };

      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const data: TransportNotification = JSON.parse(event.data);
          console.log('📨 Mensaje WebSocket recibido:', data);
          
          // Notificar a todos los handlers
          this.messageHandlers.forEach(handler => handler(data));
        } catch (error) {
          console.error('❌ Error parseando mensaje WebSocket:', error, event.data);
        }
      };

      this.socket.onclose = (event: CloseEvent) => {
        console.log('🔌 WebSocket desconectado:', event.code, event.reason);
        this.handleReconnect(url);
      };

      this.socket.onerror = (event: Event) => {
        console.error('💥 Error WebSocket:', event);
      };

    } catch (error) {
      console.error('❌ Error conectando WebSocket:', error);
      this.handleReconnect(url);
    }
  }

  private handleReconnect(url: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectInterval * this.reconnectAttempts;
      
      console.log(`🔄 Reintento ${this.reconnectAttempts}/${this.maxReconnectAttempts} en ${delay}ms...`);
      
      setTimeout(() => {
        // Reconectar con los mismos handlers
        const handlers = [...this.messageHandlers];
        this.messageHandlers = [];
        handlers.forEach(handler => this.connect(url, handler));
      }, delay);
    } else {
      console.error('🛑 Máximo de reintentos alcanzado');
      this.messageHandlers.forEach(handler => 
        handler({
          type: 'connection_error',
          title: 'Error de Conexión',
          message: 'No se pudo conectar al servidor WebSocket',
          timestamp: new Date().toISOString()
        } as TransportNotification)
      );
    }
  }

  send(message: WebSocketMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const messageWithTimestamp = {
        ...message,
        timestamp: new Date().toISOString()
      };
      
      this.socket.send(JSON.stringify(messageWithTimestamp));
      console.log('📤 Mensaje WebSocket enviado:', messageWithTimestamp);
    } else {
      console.warn('⚠️ WebSocket no conectado. Mensaje no enviado:', message);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, 'Desconexión normal');
      this.socket = null;
    }
    this.messageHandlers = [];
  }

  getConnectionState(): string {
    if (!this.socket) return 'DISCONNECTED';
    
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'CONNECTED';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'DISCONNECTED';
      default:
        return 'UNKNOWN';
    }
  }

  // Método para agregar múltiples handlers
  addMessageHandler(handler: (message: TransportNotification) => void): void {
    this.messageHandlers.push(handler);
  }

  // Método para remover handlers
  removeMessageHandler(handler: (message: TransportNotification) => void): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }
}

// Exportar una instancia singleton
export const transportWebSocket = new TransportWebSocket();

// Funciones de utilidad para tipos específicos de mensajes
export const createVehicleUpdateMessage = (
  vehicleId: string, 
  lineCode: string, 
  latitude: number, 
  longitude: number,
  speed?: number,
  direction?: number
): WebSocketMessage => ({
  type: 'vehicle_position_update',
  payload: { 
    vehicleId, 
    lineCode, 
    latitude, 
    longitude,
    speed,
    direction
  }
});

export const createRouteUpdateMessage = (routeId: string, changes: any): WebSocketMessage => ({
  type: 'route_update',
  payload: { routeId, changes }
});

export const createStopUpdateMessage = (stopId: string, changes: any): WebSocketMessage => ({
  type: 'stop_update',
  payload: { stopId, changes }
});

export const createScheduleUpdateMessage = (scheduleId: string, changes: any): WebSocketMessage => ({
  type: 'schedule_update',
  payload: { scheduleId, changes }
});

export const createSubscriptionMessage = (topics: string[]): WebSocketMessage => ({
  type: 'subscribe_vehicles',
  payload: { topics }
});