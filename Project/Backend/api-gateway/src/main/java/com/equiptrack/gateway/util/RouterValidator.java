package com.equiptrack.gateway.util;

import java.util.List;
import java.util.function.Predicate;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

@Component
public class RouterValidator {

    public static final List<String> openApiEndpoints = List.of(
        "/api/users/register",
        "/api/users/login",
        "/api/users/generate-userid",
        "/api/users/verify-email",
        "/api/users/reset-password",
        "/api/contact/submit",
        "/api/reports",
        "/api/analytics",
        "/api/downtime"
    );

    public Predicate<ServerHttpRequest> isSecured =
        request -> openApiEndpoints
            .stream()
            .noneMatch(uri -> request.getURI().getPath().contains(uri));
}
