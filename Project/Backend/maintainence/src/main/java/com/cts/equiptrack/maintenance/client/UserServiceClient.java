package com.cts.equiptrack.maintenance.client;

import com.cts.equiptrack.maintenance.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PLATFORM-SERVICE")
public interface UserServiceClient {
    
    @GetMapping("/api/users/{userId}")
    UserResponse getUserById(@PathVariable("userId") Long userId);
}