package com.transport.resources;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.*;
import java.util.*;

@Path("/lines")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LineResource extends BaseResource {

    @GET
    public Response getAllLines() {
        try {
            String query = "SELECT * FROM lines";
            
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
            String query = "SELECT * FROM lines WHERE id = ?";
            
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

    private Map<String, Object> extractLineFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> line = new HashMap<>();
        line.put("id", rs.getString("id"));
        line.put("code", rs.getString("code"));
        line.put("origin", rs.getString("origin"));
        line.put("destination", rs.getString("destination"));
        line.put("company", rs.getString("company"));
        line.put("isActive", rs.getBoolean("is_active"));
        return line;
    }
}