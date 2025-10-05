package com.transport.resources;

import com.transport.utils.DatabaseConfig;
import jakarta.ws.rs.core.Response;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public abstract class BaseResource {
    
    protected Connection getConnection() throws SQLException {
        return DatabaseConfig.getConnection();
    }
    
    protected Response buildSuccessResponse(Object data) {
        return Response.ok(data).build();
    }
    
    protected Response buildCreatedResponse(Object data) {
        return Response.status(Response.Status.CREATED).entity(data).build();
    }
    
    protected Response buildErrorResponse(int status, String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", message);
        error.put("status", status);
        return Response.status(status).entity(error).build();
    }
    
    protected Response buildNotFoundResponse(String message) {
        return buildErrorResponse(Response.Status.NOT_FOUND.getStatusCode(), message);
    }
    
    protected Response buildBadRequestResponse(String message) {
        return buildErrorResponse(Response.Status.BAD_REQUEST.getStatusCode(), message);
    }
    
    protected Response buildInternalErrorResponse(String message) {
        return buildErrorResponse(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), message);
    }
}