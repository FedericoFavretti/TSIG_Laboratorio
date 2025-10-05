package com.transport.config;

import com.transport.filters.CorsFilter;
import com.transport.resources.*;
import jakarta.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;

@ApplicationPath("/api")
public class JerseyConfig extends ResourceConfig {
    
    public JerseyConfig() {
        // Registra todos los recursos JAX-RS
        register(LineResource.class);
        register(StopResource.class);
        register(RealtimeResource.class);
        register(RouteResource.class);
        register(ScheduleResource.class);
        register(SearchResource.class);
        
        // Registra filtros
        register(CorsFilter.class);
        
        // Configuración importante para evitar errores comunes
        property(ServerProperties.RESPONSE_SET_STATUS_OVER_SEND_ERROR, true);
        property(ServerProperties.WADL_FEATURE_DISABLE, true);
        
        // Paquetes a escanear (alternativa al registro manual)
        packages("com.transport.resources", "com.transport.filters");
        
        System.out.println("✅ JerseyConfig inicializado - API JAX-RS lista");
    }
}