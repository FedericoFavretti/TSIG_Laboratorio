package com.transport.resources;

import com.transport.utils.JsonUtils;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.*;
import java.util.*;

@Path("/realtime")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RealtimeResource extends BaseResource {

    @GET
    public Response getAllRealTimeVehicles() {
        try {
            // En una implementación real, esto vendría de una base de datos en tiempo real
            Map<String, Object> realTimeData = new HashMap<>();
            realTimeData.put("vehicles", new ArrayList<>());
            realTimeData.put("lastUpdated", new java.util.Date());
            realTimeData.put("totalActive", 0);
            
            return buildSuccessResponse(realTimeData);
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }

    @GET
    @Path("/vehicles/{lineCode}")
    public Response getRealTimeVehiclesByLine(@PathParam("lineCode") String lineCode) {
        try {
            // Simular datos en tiempo real para una línea específica
            List<Map<String, Object>> vehicles = new ArrayList<>();
            
            // En una implementación real, consultarías la base de datos
            String query = "SELECT * FROM realtime_vehicles WHERE line_code = ? ORDER BY timestamp DESC";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                stmt.setString(1, lineCode);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        vehicles.add(extractVehicleFromResultSet(rs));
                    }
                }
            } catch (SQLException e) {
                // Si la tabla no existe, retornar array vacío
                System.out.println("Tabla realtime_vehicles no disponible, retornando datos vacíos");
            }
            
            return buildSuccessResponse(vehicles);
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }

    @GET
    @Path("/stop/{stopId}")
    public Response getRealTimeVehiclesByStop(@PathParam("stopId") String stopId) {
        try {
            // Simular datos en tiempo real para una parada específica
            List<Map<String, Object>> vehicles = new ArrayList<>();
            
            try (Connection conn = getConnection()) {
                // Primero obtener la ubicación de la parada
                String stopQuery = "SELECT ST_X(location) as longitude, ST_Y(location) as latitude FROM stops WHERE id = ?";
                try (PreparedStatement stopStmt = conn.prepareStatement(stopQuery)) {
                    stopStmt.setInt(1, Integer.parseInt(stopId));
                    try (ResultSet stopRs = stopStmt.executeQuery()) {
                        if (stopRs.next()) {
                            double stopLng = stopRs.getDouble("longitude");
                            double stopLat = stopRs.getDouble("latitude");
                            
                            // Buscar vehículos cercanos (en implementación real)
                            String vehicleQuery = "SELECT *, ST_Distance(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography, " +
                                                "ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography) as distance " +
                                                "FROM realtime_vehicles " +
                                                "WHERE ST_DWithin(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography, " +
                                                "ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, 1000) " +
                                                "ORDER BY distance, timestamp DESC";
                            
                            try (PreparedStatement vehicleStmt = conn.prepareStatement(vehicleQuery)) {
                                vehicleStmt.setDouble(1, stopLng);
                                vehicleStmt.setDouble(2, stopLat);
                                vehicleStmt.setDouble(3, stopLng);
                                vehicleStmt.setDouble(4, stopLat);
                                
                                try (ResultSet vehicleRs = vehicleStmt.executeQuery()) {
                                    while (vehicleRs.next()) {
                                        Map<String, Object> vehicle = extractVehicleFromResultSet(vehicleRs);
                                        vehicle.put("distance", vehicleRs.getDouble("distance"));
                                        vehicles.add(vehicle);
                                    }
                                }
                            } catch (SQLException e) {
                                // Tabla puede no existir
                                System.out.println("Tabla realtime_vehicles no disponible");
                            }
                        } else {
                            return buildNotFoundResponse("Parada no encontrada");
                        }
                    }
                }
            }
            
            return buildSuccessResponse(vehicles);
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }

    @POST
    @Path("/vehicles")
    public Response updateRealTimeVehicle(String jsonBody) {
        try {
            Map<String, Object> vehicleData = JsonUtils.fromJsonToMap(jsonBody);
            
            String query = "INSERT INTO realtime_vehicles (vehicle_id, line_code, latitude, longitude, " +
                          "speed, direction, next_stop, occupancy) " +
                          "VALUES (?, ?, ?, ?, ?, ?, ?, ?) " +
                          "ON CONFLICT (vehicle_id) DO UPDATE SET " +
                          "line_code = EXCLUDED.line_code, " +
                          "latitude = EXCLUDED.latitude, " +
                          "longitude = EXCLUDED.longitude, " +
                          "speed = EXCLUDED.speed, " +
                          "direction = EXCLUDED.direction, " +
                          "next_stop = EXCLUDED.next_stop, " +
                          "occupancy = EXCLUDED.occupancy, " +
                          "timestamp = CURRENT_TIMESTAMP";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                stmt.setString(1, (String) vehicleData.get("vehicleId"));
                stmt.setString(2, (String) vehicleData.get("lineCode"));
                stmt.setDouble(3, ((Number) vehicleData.get("latitude")).doubleValue());
                stmt.setDouble(4, ((Number) vehicleData.get("longitude")).doubleValue());
                stmt.setObject(5, vehicleData.get("speed"));
                stmt.setObject(6, vehicleData.get("direction"));
                stmt.setString(7, (String) vehicleData.get("nextStop"));
                stmt.setObject(8, vehicleData.get("occupancy"));
                
                int affectedRows = stmt.executeUpdate();
                
                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                result.put("affectedRows", affectedRows);
                result.put("timestamp", new java.util.Date());
                
                return buildSuccessResponse(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }
    
    private Map<String, Object> extractVehicleFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> vehicle = new HashMap<>();
        vehicle.put("id", rs.getString("vehicle_id"));
        vehicle.put("line", rs.getString("line_code"));
        vehicle.put("latitude", rs.getDouble("latitude"));
        vehicle.put("longitude", rs.getDouble("longitude"));
        vehicle.put("timestamp", rs.getTimestamp("timestamp"));
        vehicle.put("speed", rs.getObject("speed"));
        vehicle.put("direction", rs.getObject("direction"));
        vehicle.put("nextStop", rs.getString("next_stop"));
        vehicle.put("occupancy", rs.getObject("occupancy"));
        return vehicle;
    }
}