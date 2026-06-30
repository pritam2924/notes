package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.example.demo.dto.UserResponse;

@FeignClient(name = "platform-service", url = "${user.service.url}")
public interface PlatformServiceClient {
    
    @GetMapping("/api/users/{username}")
    UserResponse getUserByUsername(@PathVariable("username") String username);
    
    @GetMapping("/api/users/{username}/role")
    String getUserRole(@PathVariable("username") String username);
}