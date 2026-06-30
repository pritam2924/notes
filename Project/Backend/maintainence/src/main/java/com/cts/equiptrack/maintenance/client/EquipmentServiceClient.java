package com.cts.equiptrack.maintenance.client;

import com.cts.equiptrack.maintenance.dto.EquipmentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "EQUIPMENT-SERVICE")
public interface EquipmentServiceClient {
    
    @GetMapping("/api/equipment/{equipmentId}")
    EquipmentResponse getEquipmentById(@PathVariable("equipmentId") String equipmentId);
}