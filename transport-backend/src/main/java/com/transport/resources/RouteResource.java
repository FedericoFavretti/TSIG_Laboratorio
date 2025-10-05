package com.transport.resources;

import com.transport.utils.JsonUtils;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.*;
import java.util.*;

@Path("/routes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RouteResource extends BaseResource {

    @GET
    public Response getAllRoutes() {
        try {
            String query = "SELECT * FROM routes";
            
            try (Connection conn = getConnection();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(query)) {
                
                List<Map<String, Object>> routes = new ArrayList<>();
                while (rs.next()) {
                    routes.add(extractRouteFromResultSet(rs));
                }
                return buildSuccessResponse(routes);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }

    @GET
    @Path("/{id}")
    public Response getRouteById(@PathParam("id") String id) {
        try {
            String query = "SELECT * FROM routes WHERE id = ?";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                stmt.setInt(1, Integer.parseInt(id));
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        return buildSuccessResponse(extractRouteFromResultSet(rs));
                    } else {
                        return buildNotFoundResponse("Ruta no encontrada");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }

    @PUT
    @Path("/{id}")
    public Response updateRoute(@PathParam("id") String id, String jsonBody) {
        try {
            Map<String, Object> updates = JsonUtils.fromJsonToMap(jsonBody);
            
            List<String> setClauses = new ArrayList<>();
            List<Object> values = new ArrayList<>();
            
            if (updates.containsKey("name")) {
                setClauses.add("name = ?");
                values.add(updates.get("name"));
            }
            if (updates.containsKey("details")) {
                setClauses.add("details = ?");
                values.add(updates.get("details"));
            }
            
            if (setClauses.isEmpty()) {
                return buildBadRequestResponse("No hay campos válidos para actualizar");
            }
            
            setClauses.add("updated_at = CURRENT_TIMESTAMP");
            values.add(id);
            
            String query = "UPDATE routes SET " + String.join(", ", setClauses) + 
                          " WHERE id = ? RETURNING *";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                for (int i = 0; i < values.size(); i++) {
                    stmt.setObject(i + 1, values.get(i));
                }
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Map<String, Object> result = extractRouteFromResultSet(rs);
                        return buildSuccessResponse(result);
                    } else {
                        return buildNotFoundResponse("Ruta no encontrada");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }
    
    private Map<String, Object> extractRouteFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> route = new HashMap<>();
        route.put("id", rs.getString("id"));
        route.put("name", rs.getString("name"));
        route.put("details", rs.getString("details"));
        return route;
    }
}