package com.transport.config;

import com.transport.websocket.TransportWebSocketEndpoint;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class WebSocketConfig implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("🚀 Inicializando WebSocket para Tomcat...");
        
        // Iniciar simulación de datos
        TransportWebSocketEndpoint.startSimulation();
        
        System.out.println("✅ WebSocket configurado en: /ws/realtime");
        System.out.println("✅ URL completa: ws://localhost:8080/transport-backend/ws/realtime");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("🛑 WebSocket detenido");
    }
}