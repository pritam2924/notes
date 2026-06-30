package com.equiptrack.platformservice.controller;

import com.equiptrack.platformservice.client.EquipmentServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    
    private final EquipmentServiceClient equipmentServiceClient;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            equipmentServiceClient.getAllEquipment();
            stats.put("equipmentServiceStatus", "UP");
        } catch (Exception e) {
            stats.put("equipmentServiceStatus", "DOWN");
        }
        
        return ResponseEntity.ok(stats);
    }

}