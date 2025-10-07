package com.transport.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@ServerEndpoint("/ws/realtime")
public class TransportWebSocketEndpoint {
    
    private static final Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println("✅ WebSocket conectado - ID: " + session.getId() + 
                         " - Total: " + sessions.size());
        
        sendToSession(session, createMessage("connection_established", 
            "Conectado al sistema de transporte en tiempo real"));
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        try {
            System.out.println("📨 Mensaje recibido de " + session.getId() + ": " + message);
            
            if (message.contains("vehicle_position_update")) {
                String simulatedResponse = createMessage("vehicle_position_update", 
                    "{\"vehicleId\":\"BUS_001\",\"lineCode\":\"L1\",\"latitude\":-34.6037,\"longitude\":-58.3816,\"speed\":45.5}");
                
                broadcastToAll(simulatedResponse);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error procesando mensaje: " + e.getMessage());
            sendToSession(session, createMessage("error", "Error: " + e.getMessage()));
        }
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        System.out.println("❌ WebSocket desconectado - ID: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("💥 Error WebSocket - ID: " + session.getId() + 
                          " - Error: " + throwable.getMessage());
    }

    private void sendToSession(Session session, String message) {
        try {
            if (session.isOpen()) {
                session.getBasicRemote().sendText(message);
            }
        } catch (IOException e) {
            System.err.println("Error enviando mensaje: " + e.getMessage());
        }
    }

    public static void broadcastToAll(String message) {
        synchronized (sessions) {
            for (Session session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.getBasicRemote().sendText(message);
                    } catch (IOException e) {
                        System.err.println("Error en broadcast: " + e.getMessage());
                    }
                }
            }
        }
    }

    private String createMessage(String type, Object payload) {
        try {
            String payloadStr;
            if (payload instanceof String) {
                payloadStr = (String) payload;
            } else {
                payloadStr = objectMapper.writeValueAsString(payload);
            }
            
            return String.format(
                "{\"type\":\"%s\",\"payload\":%s,\"timestamp\":\"%s\"}",
                type,
                payloadStr,
                java.time.Instant.now()
            );
        } catch (JsonProcessingException e) {
            return "{\"type\":\"error\",\"payload\":\"Error creating message\",\"timestamp\":\"" + 
                   java.time.Instant.now() + "\"}";
        }
    }

    public static void startSimulation() {
        Thread simulationThread = new Thread(() -> {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    if (!sessions.isEmpty()) {
                        simulateVehicleMovement();
                    }
                    Thread.sleep(15000);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        simulationThread.setDaemon(true);
        simulationThread.start();
        System.out.println("🚀 Simulación WebSocket iniciada");
    }

    private static void simulateVehicleMovement() {
        try {
            String[] vehicles = {"BUS_001", "BUS_002", "BUS_003"};
            String[] lines = {"L1", "L2", "L3"};
            
            for (String vehicle : vehicles) {
                String line = lines[(int)(Math.random() * lines.length)];
                double lat = -34.6037 + (Math.random() - 0.5) * 0.01;
                double lng = -58.3816 + (Math.random() - 0.5) * 0.01;
                
                String vehicleData = String.format(
                    "{\"vehicleId\":\"%s\",\"lineCode\":\"%s\",\"latitude\":%f,\"longitude\":%f,\"speed\":%.1f,\"direction\":%d}",
                    vehicle, line, lat, lng, 30 + Math.random() * 20, (int)(Math.random() * 360)
                );
                
                String message = String.format(
                    "{\"type\":\"vehicle_position_update\",\"payload\":%s,\"timestamp\":\"%s\"}",
                    vehicleData,
                    java.time.Instant.now()
                );
                
                broadcastToAll(message);
            }
            
            System.out.println("📡 Datos simulados enviados a " + sessions.size() + " clientes");
            
        } catch (Exception e) {
            System.err.println("Error en simulación: " + e.getMessage());
        }
    }
}