package cts.equipment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI equipmentOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Equipment Service API")
                        .version("1.0.0")
                        .description("Equipment Service API"));
    }
}
