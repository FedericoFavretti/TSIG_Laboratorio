package com.transport.resources;

import com.transport.utils.JsonUtils;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.*;
import java.util.*;

@Path("/schedules")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ScheduleResource extends BaseResource {

    @GET
    public Response getAllSchedules() {
        try {
            String query = "SELECT * FROM schedules";
            
            try (Connection conn = getConnection();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(query)) {
                
                List<Map<String, Object>> schedules = new ArrayList<>();
                while (rs.next()) {
                    schedules.add(extractScheduleFromResultSet(rs));
                }
                return buildSuccessResponse(schedules);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }

    @GET
    @Path("/{id}")
    public Response getScheduleById(@PathParam("id") String id) {
        try {
            String query = "SELECT * FROM schedules WHERE id = ?";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                stmt.setInt(1, Integer.parseInt(id));
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        return buildSuccessResponse(extractScheduleFromResultSet(rs));
                    } else {
                        return buildNotFoundResponse("Horario no encontrado");
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
    public Response updateSchedule(@PathParam("id") String id, String jsonBody) {
        try {
            Map<String, Object> updates = JsonUtils.fromJsonToMap(jsonBody);
            
            List<String> setClauses = new ArrayList<>();
            List<Object> values = new ArrayList<>();
            
            if (updates.containsKey("line")) {
                setClauses.add("line = ?");
                values.add(updates.get("line"));
            }
            if (updates.containsKey("time")) {
                setClauses.add("time = ?");
                values.add(updates.get("time"));
            }
            if (updates.containsKey("routeId")) {
                setClauses.add("route_id = ?");
                values.add(updates.get("routeId"));
            }
            if (updates.containsKey("stopId")) {
                setClauses.add("stop_id = ?");
                values.add(updates.get("stopId"));
            }
            
            if (setClauses.isEmpty()) {
                return buildBadRequestResponse("No hay campos válidos para actualizar");
            }
            
            setClauses.add("updated_at = CURRENT_TIMESTAMP");
            values.add(id);
            
            String query = "UPDATE schedules SET " + String.join(", ", setClauses) + 
                          " WHERE id = ? RETURNING *";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                for (int i = 0; i < values.size(); i++) {
                    stmt.setObject(i + 1, values.get(i));
                }
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Map<String, Object> result = extractScheduleFromResultSet(rs);
                        return buildSuccessResponse(result);
                    } else {
                        return buildNotFoundResponse("Horario no encontrado");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }
    
    private Map<String, Object> extractScheduleFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> schedule = new HashMap<>();
        schedule.put("id", rs.getString("id"));
        schedule.put("line", rs.getString("line"));
        schedule.put("time", rs.getString("time"));
        schedule.put("routeId", rs.getObject("route_id"));
        schedule.put("stopId", rs.getObject("stop_id"));
        return schedule;
    }
}