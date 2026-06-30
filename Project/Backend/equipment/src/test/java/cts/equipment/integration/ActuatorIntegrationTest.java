package cts.equipment.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "spring.datasource.url=jdbc:h2:mem:testdb",
                "spring.jpa.hibernate.ddl-auto=create-drop",
                "management.endpoints.web.exposure.include=health,info"
        })
public class ActuatorIntegrationTest {

    @org.springframework.boot.test.web.server.LocalServerPort
    private int port;

    // use plain RestTemplate to avoid test-scoped TestRestTemplate dependency issues
    private RestTemplate restTemplate = new RestTemplate();

    @Test
    void healthEndpointReturnsUp() {
        String url = "http://localhost:" + port + "/actuator/health";
        ResponseEntity<String> resp = restTemplate.getForEntity(url, String.class);
        assertThat(resp.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(resp.getBody()).contains("status");
    }
}
