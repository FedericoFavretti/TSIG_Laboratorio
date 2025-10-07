package com.transport.resources;

import com.transport.utils.JsonUtils;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.*;
import java.util.*;

@Path("/search")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SearchResource extends BaseResource {

    @POST
    @Path("/address")
    public Response searchByAddress(String jsonBody) {
        try {
            Map<String, Object> criteria = JsonUtils.fromJsonToMap(jsonBody);
            String street = (String) criteria.get("street");
            String number = (String) criteria.get("number");
            
            if (street == null || street.trim().isEmpty()) {
                return buildBadRequestResponse("Calle es requerida para búsqueda por dirección");
            }
            
            String query = "SELECT id, name, ST_X(location) as longitude, " +
                          "ST_Y(location) as latitude, address, is_active, lines " +
                          "FROM stops WHERE address ILIKE ? ORDER BY name LIMIT 50";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                String searchTerm = number != null ? street + " " + number + "%" : street + "%";
                stmt.setString(1, searchTerm);
                
                List<Map<String, Object>> results = new ArrayList<>();
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        results.add(extractStopFromResultSet(rs));
                    }
                }
                return buildSuccessResponse(results);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }

    @POST
    @Path("/intersection")
    public Response searchByIntersection(String jsonBody) {
        try {
            Map<String, Object> criteria = JsonUtils.fromJsonToMap(jsonBody);
            String street1 = (String) criteria.get("street1");
            String street2 = (String) criteria.get("street2");
            
            if (street1 == null || street2 == null) {
                return buildBadRequestResponse("Ambas calles son requeridas para búsqueda por intersección");
            }
            
            String query = "SELECT id, name, ST_X(location) as longitude, " +
                          "ST_Y(location) as latitude, address, is_active, lines " +
                          "FROM stops WHERE (address ILIKE ? OR address ILIKE ?) " +
                          "ORDER BY name LIMIT 50";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                stmt.setString(1, "%" + street1 + "%");
                stmt.setString(2, "%" + street2 + "%");
                
                List<Map<String, Object>> results = new ArrayList<>();
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Map<String, Object> stop = extractStopFromResultSet(rs);
                        // Filtrar solo las que contienen ambas calles
                        String address = (String) stop.get("address");
                        if (address != null && 
                            address.toLowerCase().contains(street1.toLowerCase()) && 
                            address.toLowerCase().contains(street2.toLowerCase())) {
                            results.add(stop);
                        }
                    }
                }
                return buildSuccessResponse(results);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return buildInternalErrorResponse("Error interno del servidor");
        }
    }

    @GET
    @Path("/company/{company}")
    public Response searchByCompany(@PathParam("company") String company) {
        try {
            String query = "SELECT id, code, origin, destination, company, is_active, " +
                          "ST_AsGeoJSON(route) as route_geojson, stops " +
                          "FROM lines WHERE company ILIKE ? ORDER BY code";
            
            try (Connection conn = getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                
                stmt.setString(1, "%" + company + "%");
                
                List<Map<String, Object>> results = new ArrayList<>();
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Map<String, Object> line = new HashMap<>();
                        line.put("id", rs.getString("id"));
                        line.put("code", rs.getString("code"));
                        line.put("origin", rs.getString("origin"));
                        line.put("destination", rs.getString("destination"));
                        line.put("company", rs.getString("company"));
                        line.put("isActive", rs.getBoolean("is_active"));
                        line.put("route", rs.getString("route_geojson"));
                        line.put("stops", rs.getArray("stops"));
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

    @POST
    @Path("/polygon")
    public Response searchByPolygon(String jsonBody) {
        try {
            Map<String, Object> criteria = JsonUtils.fromJsonToMap(jsonBody);
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> polygon = (List<Map<String, Object>>) criteria.get("polygon");
            
            if (polygon == null || polygon.size() < 3) {
                return buildBadRequestResponse("Polígono inválido - se necesitan al menos 3 puntos");
            }
            
            // Construir WKT del polígono
            StringBuilder polygonWKT = new StringBuilder();
            for (Map<String, Object> coord : polygon) {
                double lng = ((Number) coord.get("lng")).doubleValue();
                double lat = ((Number) coord.get("lat")).doubleValue();
                polygonWKT.append(lng).append(" ").append(lat).append(", ");
            }
            // Cerrar el polígono repitiendo el primer punto
            Map<String, Object> firstCoord = polygon.get(0);
            double firstLng = ((Number) firstCoord.get("lng")).doubleValue();
            double firstLat = ((Number) firstCoord.get("lat")).doubleValue();
            polygonWKT.append(firstLng).append(" ").append(firstLat);
            
            String query = "SELECT id, name, ST_X(location) as longitude, " +
                          "ST_Y(location) as latitude, address, is_active, lines " +
                          "FROM stops WHERE ST_Within(location, ST_GeomFromText('POLYGON((" + polygonWKT + "))', 4326)) " +
                          "ORDER BY name";
            
            try (Connection conn = getConnection();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(query)) {
                
                List<Map<String, Object>> results = new ArrayList<>();
                while (rs.next()) {
                    results.add(extractStopFromResultSet(rs));
                }
                return buildSuccessResponse(results);
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
}