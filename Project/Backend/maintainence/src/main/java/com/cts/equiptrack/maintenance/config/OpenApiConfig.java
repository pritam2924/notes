package com.cts.equiptrack.maintenance.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI equipTrackOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("EquipTrack Maintenance API")
                        .description("REST API for Equipment Maintenance Management System")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("CTS Team")
                                .email("support@cts.com")));
    }
}