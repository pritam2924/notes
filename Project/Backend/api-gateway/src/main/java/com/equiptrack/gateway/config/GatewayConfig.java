package com.equiptrack.gateway.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.equiptrack.gateway.filter.AuthenticationFilter;

@Configuration
public class GatewayConfig {

    @Autowired
    private AuthenticationFilter authenticationFilter;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Equipment Service Routes
                .route("equipment-service", r -> r.path("/api/equipment/**", "/api/vendors/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://equipment-service"))
                
                // Alerts & Performance Service Routes
                .route("alerts-performance-service", r -> r.path("/api/alerts/**", "/api/performance-metrics/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://alerts-performance-service"))
                
                // Downtime Trend Service Routes
                .route("downtime-trend", r -> r.path("/api/downtime/**", "/api/reports/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://downtime-trend"))
                
                // Maintenance Service Routes
                .route("maintenance-service", r -> r.path("/api/maintenance/**", "/api/maintenance-tasks/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://maintenance-service"))
                
                // Spare Parts Service Routes
                .route("spare-service", r -> r.path("/api/spare-parts/**", "/api/spare-parts-requests/**", "/api/stock-movements/**", "/api/requisitions/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://spare-service"))
                
                // Platform Service Routes (User Management)
                .route("platform-service", r -> r.path("/api/contact/**", "/api/dashboard/**", "/api/users/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://platform-service"))
                
                .build();
    }
}