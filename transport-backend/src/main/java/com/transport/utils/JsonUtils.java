package com.transport.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

public class JsonUtils {
    
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    public static String toJson(Object object) throws IOException {
        return objectMapper.writeValueAsString(object);
    }
    
    public static <T> T fromJson(String json, Class<T> clazz) throws IOException {
        return objectMapper.readValue(json, clazz);
    }
    
    public static Map<String, Object> fromJsonToMap(String json) throws IOException {
        return objectMapper.readValue(json, new TypeReference<HashMap<String, Object>>() {});
    }
    
    public static void sendJsonResponse(HttpServletResponse response, Object data) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.print(toJson(data));
        out.flush();
    }
    
    public static void sendErrorResponse(HttpServletResponse response, int statusCode, String message) 
            throws IOException {
        response.setStatus(statusCode);
        Map<String, Object> error = new HashMap<>();
        error.put("error", message);
        error.put("status", statusCode);
        sendJsonResponse(response, error);
    }
}