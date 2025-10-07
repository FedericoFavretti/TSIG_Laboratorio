package com.transport.config;

import com.transport.websocket.TransportWebSocketEndpoint;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class WebSocketConfig implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("🚀 Inicializando WebSocket para Tomcat...");
        
        TransportWebSocketEndpoint.startSimulation();
        
        System.out.println("✅ WebSocket configurado en: /ws/realtime");
        System.out.println("✅ URL completa: ws://localhost:8080/transport-backend/ws/realtime");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("🛑 WebSocket detenido");
    }
}