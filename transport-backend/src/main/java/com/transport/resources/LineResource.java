package com.transport.resources;

import com.transport.utils.JsonUtils;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.*;
import java.util.*;

@Path("/lines")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LineResource extends BaseResource {
    
    @POST
    public Response createLine(String jsonBody) {
        try {
            Map<String, Object> lineData = JsonUtils.fromJsonToMap(jsonBody);
            
            String query = "INSERT INTO lines (code, origin, destination, company, is_active, route, stops) " +
                         "VALUES (?, ?, ?, ?, ?, ST_GeomFromGeoJSON(?), ?::text[]) " +
                         "RETURNING id, code, origin, destination, company, is_active, " +
                         "ST_AsGeoJSON(route) as route_geojson, stops";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                stmt.setString(1, (String) lineData.get("code"));
                stmt.setString(2, (String) lineData.get("origin"));
                stmt.setString(3, (String) lineData.get("destination"));
                stmt.setString(4, (String) lineData.get("company"));
                stmt.setBoolean(5, (Boolean) lineData.getOrDefault("isActive", true));
                stmt.setString(6, (String) lineData.get("route"));
                
                @SuppressWarnings("unchecked")
                List<String> stops = (List<String>) lineData.getOrDefault("stops", new ArrayList<>());
                Array stopsArray = conn.createArrayOf("text", stops.toArray());
                stmt.setArray(7, stopsArray);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Map<String, Object> result = new HashMap<>();
                        result.put("id", rs.getString("id"));
                        result.put("code", rs.getString("code"));
                        result.put("origin", rs.getString("origin"));
                        result.put("destination", rs.getString("destination"));
                        result.put("company", rs.getString("company"));
                        result.put("isActive", rs.getBoolean("is_active"));
                        result.put("route", rs.getString("route_geojson"));
                        result.put("stops", rs.getArray("stops"));
                        
                        return buildCreatedResponse(result);
                    } else {
                        return buildBadRequestResponse("Error creando línea");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor: " + e.getMessage());
        }
    }
    
    @GET
    public Response getAllLines() {
        try {
            String query = "SELECT id, code, origin, destination, company, is_active, " +
                          "ST_AsGeoJSON(route) as route_geojson, stops " +
                          "FROM lines";
            
            try (Connection conn = getConnection();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(query)) {
                
                List<Map<String, Object>> lines = new ArrayList<>();
                while (rs.next()) {
                    lines.add(extractLineFromResultSet(rs));
                }
                return buildSuccessResponse(lines);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }
    
    @GET
    @Path("/{id}")
    public Response getLineById(@PathParam("id") String id) {
        try {
            String query = "SELECT id, code, origin, destination, company, is_active, " +
                          "ST_AsGeoJSON(route) as route_geojson, stops " +
                          "FROM lines WHERE id = ?";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                stmt.setInt(1, Integer.parseInt(id));
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        return buildSuccessResponse(extractLineFromResultSet(rs));
                    } else {
                        return buildNotFoundResponse("Línea no encontrada");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }
    
    @GET
    @Path("/nearby")
    public Response findNearbyLines(
            @QueryParam("lat") double lat,
            @QueryParam("lng") double lng,
            @QueryParam("radius") @DefaultValue("1000") int radius) {
        
        try {
            String query = "SELECT id, code, origin, destination, company, is_active, " +
                          "ST_AsGeoJSON(route) as route_geojson, stops, " +
                          "ST_Distance(route::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography) as distance " +
                          "FROM lines " +
                          "WHERE ST_DWithin(route::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, ?) " +
                          "ORDER BY distance LIMIT 50";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                stmt.setDouble(1, lng);
                stmt.setDouble(2, lat);
                stmt.setDouble(3, lng);
                stmt.setDouble(4, lat);
                stmt.setInt(5, radius);
                
                List<Map<String, Object>> results = new ArrayList<>();
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Map<String, Object> line = extractLineFromResultSet(rs);
                        line.put("distance", rs.getDouble("distance"));
                        results.add(line);
                    }
                }
                return buildSuccessResponse(results);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }
    
    @PUT
    @Path("/{id}")
    public Response updateLine(@PathParam("id") String id, String jsonBody) {
        try {
            Map<String, Object> updates = JsonUtils.fromJsonToMap(jsonBody);
            
            List<String> setClauses = new ArrayList<>();
            List<Object> values = new ArrayList<>();
            
            if (updates.containsKey("code")) {
                setClauses.add("code = ?");
                values.add(updates.get("code"));
            }
            if (updates.containsKey("origin")) {
                setClauses.add("origin = ?");
                values.add(updates.get("origin"));
            }
            if (updates.containsKey("destination")) {
                setClauses.add("destination = ?");
                values.add(updates.get("destination"));
            }
            if (updates.containsKey("company")) {
                setClauses.add("company = ?");
                values.add(updates.get("company"));
            }
            if (updates.containsKey("isActive")) {
                setClauses.add("is_active = ?");
                values.add(updates.get("isActive"));
            }
            if (updates.containsKey("route")) {
                setClauses.add("route = ST_GeomFromGeoJSON(?)");
                values.add(updates.get("route"));
            }
            if (updates.containsKey("stops")) {
                setClauses.add("stops = ?::text[]");
                @SuppressWarnings("unchecked")
                List<String> stops = (List<String>) updates.get("stops");
                try (Connection conn = getConnection()) {
                    values.add(conn.createArrayOf("text", stops.toArray()));
                }
            }
            
            if (setClauses.isEmpty()) {
                return buildBadRequestResponse("No hay campos válidos para actualizar");
            }
            
            setClauses.add("updated_at = CURRENT_TIMESTAMP");
            values.add(id);
            
            String query = "UPDATE lines SET " + String.join(", ", setClauses) + 
                          " WHERE id = ? RETURNING id, code, origin, destination, company, is_active, " +
                          "ST_AsGeoJSON(route) as route_geojson, stops";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                for (int i = 0; i < values.size(); i++) {
                    stmt.setObject(i + 1, values.get(i));
                }
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Map<String, Object> result = extractLineFromResultSet(rs);
                        return buildSuccessResponse(result);
                    } else {
                        return buildNotFoundResponse("Línea no encontrada");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }
    
    private Map<String, Object> extractLineFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> line = new HashMap<>();
        line.put("id", rs.getString("id"));
        line.put("code", rs.getString("code"));
        line.put("origin", rs.getString("origin"));
        line.put("destination", rs.getString("destination"));
        line.put("company", rs.getString("company"));
        line.put("isActive", rs.getBoolean("is_active"));
        line.put("route", rs.getString("route_geojson"));
        line.put("stops", rs.getArray("stops"));
        return line;
    }
}