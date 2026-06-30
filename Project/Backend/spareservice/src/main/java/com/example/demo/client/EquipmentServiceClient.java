package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.example.demo.dto.EquipmentResponse;
import java.util.List;

@FeignClient(name = "equipment-service", url = "${equipment.service.url}")
public interface EquipmentServiceClient {
    
    @GetMapping("/api/equipment/{id}")
    EquipmentResponse getEquipmentById(@PathVariable("id") String id);
    
    @GetMapping("/api/equipment")
    List<EquipmentResponse> getAllEquipment();
}
