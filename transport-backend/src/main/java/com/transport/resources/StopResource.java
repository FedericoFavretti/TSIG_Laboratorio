package com.transport.resources;

import com.transport.utils.JsonUtils;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.*;
import java.util.*;

@Path("/stops")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class StopResource extends BaseResource {
    
    @POST
    public Response createStop(String jsonBody) {
        try {
            Map<String, Object> stopData = JsonUtils.fromJsonToMap(jsonBody);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> location = (Map<String, Object>) stopData.get("location");
            double latitude = ((Number) location.get("latitude")).doubleValue();
            double longitude = ((Number) location.get("longitude")).doubleValue();
            
            String query = "INSERT INTO stops (name, location, address, is_active, lines) " +
                         "VALUES (?, ST_SetSRID(ST_MakePoint(?, ?), 4326), ?, ?, ?::text[]) " +
                         "RETURNING id, name, ST_X(location) as longitude, " +
                         "ST_Y(location) as latitude, address, is_active, lines";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                stmt.setString(1, (String) stopData.get("name"));
                stmt.setDouble(2, longitude);
                stmt.setDouble(3, latitude);
                stmt.setString(4, (String) stopData.get("address"));
                stmt.setBoolean(5, (Boolean) stopData.getOrDefault("isActive", true));
                
                @SuppressWarnings("unchecked")
                List<String> lines = (List<String>) stopData.getOrDefault("lines", new ArrayList<>());
                Array linesArray = conn.createArrayOf("text", lines.toArray());
                stmt.setArray(6, linesArray);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Map<String, Object> result = extractStopFromResultSet(rs);
                        
                        // Asociar líneas cercanas automáticamente
                        associateNearbyLines(rs.getString("id"), latitude, longitude);
                        
                        return buildCreatedResponse(result);
                    } else {
                        return buildBadRequestResponse("Error creando parada");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }
    
    @GET
    public Response getAllStops() {
        try {
            String query = "SELECT id, name, ST_X(location) as longitude, " +
                          "ST_Y(location) as latitude, address, is_active, lines " +
                          "FROM stops";
            
            try (Connection conn = getConnection();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(query)) {
                
                List<Map<String, Object>> stops = new ArrayList<>();
                while (rs.next()) {
                    stops.add(extractStopFromResultSet(rs));
                }
                return buildSuccessResponse(stops);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }
    
    @GET
    @Path("/{id}")
    public Response getStopById(@PathParam("id") String id) {
        try {
            String query = "SELECT id, name, ST_X(location) as longitude, " +
                          "ST_Y(location) as latitude, address, is_active, lines " +
                          "FROM stops WHERE id = ?";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                stmt.setInt(1, Integer.parseInt(id));
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        return buildSuccessResponse(extractStopFromResultSet(rs));
                    } else {
                        return buildNotFoundResponse("Parada no encontrada");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }
    
    @GET
    @Path("/orphaned")
    public Response getOrphanedStops() {
        try {
            String query = "SELECT id, name, ST_X(location) as longitude, " +
                          "ST_Y(location) as latitude, address, is_active, lines, " +
                          "created_at as orphaned_since " +
                          "FROM stops " +
                          "WHERE array_length(lines, 1) IS NULL OR array_length(lines, 1) = 0 " +
                          "ORDER BY created_at DESC";
            
            try (Connection conn = getConnection();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(query)) {
                
                List<Map<String, Object>> stops = new ArrayList<>();
                while (rs.next()) {
                    Map<String, Object> stop = extractStopFromResultSet(rs);
                    stop.put("orphanedSince", rs.getTimestamp("orphaned_since"));
                    stops.add(stop);
                }
                return buildSuccessResponse(stops);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }
    
    @PUT
    @Path("/{id}")
    public Response updateStop(@PathParam("id") String id, String jsonBody) {
        try {
            Map<String, Object> updates = JsonUtils.fromJsonToMap(jsonBody);
            
            List<String> setClauses = new ArrayList<>();
            List<Object> values = new ArrayList<>();
            
            if (updates.containsKey("name")) {
                setClauses.add("name = ?");
                values.add(updates.get("name"));
            }
            if (updates.containsKey("address")) {
                setClauses.add("address = ?");
                values.add(updates.get("address"));
            }
            if (updates.containsKey("isActive")) {
                setClauses.add("is_active = ?");
                values.add(updates.get("isActive"));
            }
            if (updates.containsKey("lines")) {
                setClauses.add("lines = ?::text[]");
                @SuppressWarnings("unchecked")
                List<String> lines = (List<String>) updates.get("lines");
                try (Connection conn = getConnection()) {
                    values.add(conn.createArrayOf("text", lines.toArray()));
                }
            }
            if (updates.containsKey("location")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> location = (Map<String, Object>) updates.get("location");
                double latitude = ((Number) location.get("latitude")).doubleValue();
                double longitude = ((Number) location.get("longitude")).doubleValue();
                setClauses.add("location = ST_SetSRID(ST_MakePoint(?, ?), 4326)");
                values.add(longitude);
                values.add(latitude);
            }
            
            if (setClauses.isEmpty()) {
                return buildBadRequestResponse("No hay campos válidos para actualizar");
            }
            
            setClauses.add("updated_at = CURRENT_TIMESTAMP");
            values.add(id);
            
            String query = "UPDATE stops SET " + String.join(", ", setClauses) + 
                          " WHERE id = ? RETURNING id, name, ST_X(location) as longitude, " +
                          "ST_Y(location) as latitude, address, is_active, lines";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                for (int i = 0; i < values.size(); i++) {
                    stmt.setObject(i + 1, values.get(i));
                }
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Map<String, Object> result = extractStopFromResultSet(rs);
                        return buildSuccessResponse(result);
                    } else {
                        return buildNotFoundResponse("Parada no encontrada");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }
    
    private Map<String, Object> extractStopFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> stop = new HashMap<>();
        stop.put("id", rs.getString("id"));
        stop.put("name", rs.getString("name"));
        stop.put("location", Map.of(
            "latitude", rs.getDouble("latitude"),
            "longitude", rs.getDouble("longitude")
        ));
        stop.put("address", rs.getString("address"));
        stop.put("isActive", rs.getBoolean("is_active"));
        stop.put("lines", rs.getArray("lines"));
        return stop;
    }
    
    private void associateNearbyLines(String stopId, double latitude, double longitude) {
        try (Connection conn = getConnection()) {
            String query = "UPDATE lines " +
                         "SET stops = array_append(stops, ?), updated_at = CURRENT_TIMESTAMP " +
                         "WHERE ST_DWithin(route::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, 10) " +
                         "AND (stops IS NULL OR NOT ? = ANY(stops))";
            
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, stopId);
                stmt.setDouble(2, longitude);
                stmt.setDouble(3, latitude);
                stmt.setString(4, stopId);
                stmt.executeUpdate();
            }
        } catch (Exception e) {
            System.err.println("Error asociando líneas cercanas: " + e.getMessage());
        }
    }
}