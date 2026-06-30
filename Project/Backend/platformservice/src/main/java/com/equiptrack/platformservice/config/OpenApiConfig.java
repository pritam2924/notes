package com.equiptrack.platformservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI platformServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Platform Service API")
                        .description("Equipment Tracking System - Platform Service")
                        .version("1.0.0"));
    }
}