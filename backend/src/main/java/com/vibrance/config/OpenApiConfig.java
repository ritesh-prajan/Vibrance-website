package com.vibrance.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI vibranceOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("Vibrance 2026 Ticketing & DBMS Concurrency Engine API")
                        .description("REST API documentation for Vibrance 2026 Cultural Fest, featuring ACID transaction isolation, two-phase locking (2PL), optimistic concurrency control (OCC), high-throughput gate scanner telemetry, and relational audit logging.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Vibrance Engineering Team")
                                .email("engineering@vibrance2026.fest"))
                        .license(new License().name("MIT License")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
