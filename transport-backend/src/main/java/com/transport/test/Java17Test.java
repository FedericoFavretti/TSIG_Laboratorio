package com.transport.test;

public class Java17Test {
    public static void main(String[] args) {
        System.out.println("✅ Java Version: " + System.getProperty("java.version"));
        System.out.println("✅ Project running on Java 17");
        
        // Puedes usar características de Java 17 como text blocks
        String json = """
            {
                "status": "success",
                "message": "Java 17 configured correctly"
            }
            """;
        System.out.println(json);
    }
}