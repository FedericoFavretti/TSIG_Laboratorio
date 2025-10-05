package com.transport.utils;

import java.sql.*;
import java.util.Properties;

public class DatabaseConfig {
    
    private static Connection connection;
    private static final String DB_URL = System.getenv().getOrDefault("DB_URL", 
        "jdbc:postgresql://localhost:5432/transport_db");
    private static final String DB_USER = System.getenv().getOrDefault("DB_USER", "postgres");
    private static final String DB_PASSWORD = System.getenv().getOrDefault("DB_PASSWORD", "password");
    
    static {
        initializeDatabase();
    }
    
    private static void initializeDatabase() {
        try {
            // Cargar driver PostgreSQL
            Class.forName("org.postgresql.Driver");
            
            Properties props = new Properties();
            props.setProperty("user", DB_USER);
            props.setProperty("password", DB_PASSWORD);
            props.setProperty("ssl", "false");
            
            connection = DriverManager.getConnection(DB_URL, props);
            
            // Verificar PostGIS
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT postgis_version()");
            if (rs.next()) {
                System.out.println("✅ Conectado a PostgreSQL con PostGIS: " + rs.getString(1));
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error conectando a la base de datos: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            initializeDatabase();
        }
        return connection;
    }
    
    public static void closeConnection() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException e) {
            System.err.println("Error cerrando conexión: " + e.getMessage());
        }
    }
}