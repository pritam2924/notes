package cts.equipment.config;

import feign.Logger;
import feign.Request;
import feign.Retryer;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import cts.equipment.exception.ServiceUnavailableException;
import cts.equipment.exception.ResourceNotFoundException;

import java.util.concurrent.TimeUnit;

@Configuration
public class FeignConfig {

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.BASIC;
    }

    @Bean
    public Request.Options requestOptions() {
        return new Request.Options(5000, TimeUnit.MILLISECONDS, 10000, TimeUnit.MILLISECONDS, true);
    }

    @Bean
    public Retryer retryer() {
        return new Retryer.Default(1000, 3000, 3);
    }

    @Bean
    public ErrorDecoder errorDecoder() {
        return (methodKey, response) -> {
            HttpStatus status = HttpStatus.valueOf(response.status());
            
            switch (status) {
                case NOT_FOUND:
                    return new ResourceNotFoundException("Resource not found: " + methodKey);
                case SERVICE_UNAVAILABLE:
                case INTERNAL_SERVER_ERROR:
                    return new ServiceUnavailableException("Service unavailable: " + methodKey);
                default:
                    return new RuntimeException("Feign client error: " + status + " for " + methodKey);
            }
        };
    }
}