import type { TransportNotification, WebSocketMessage } from '../types/index';

class TransportWebSocket {
  private socket: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 3000;

  connect(url: string, onMessage: (message: TransportNotification) => void): void {
    try {
      this.socket = new WebSocket(url);

      this.socket.onopen = (event: Event) => {
        console.log('WebSocket connected successfully');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const data: TransportNotification = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = (event: CloseEvent) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.handleReconnect(url, onMessage);
      };

      this.socket.onerror = (event: Event) => {
        console.error('WebSocket error:', event);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  private handleReconnect(url: string, onMessage: (message: TransportNotification) => void): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(url, onMessage);
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  send(message: WebSocketMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        ...message,
        timestamp: new Date()
      }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
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
}

// Exportar una instancia singleton
export const transportWebSocket = new TransportWebSocket();

// Funciones de utilidad para tipos específicos de mensajes
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