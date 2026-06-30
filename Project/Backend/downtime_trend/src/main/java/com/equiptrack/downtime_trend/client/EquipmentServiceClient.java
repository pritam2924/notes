package com.equiptrack.downtime_trend.client;

import com.equiptrack.downtime_trend.dto.EquipmentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "equipment-service")
public interface EquipmentServiceClient {
    
    @GetMapping("/api/equipment/{equipmentId}")
    EquipmentResponse getEquipmentById(@PathVariable("equipmentId") String equipmentId);
    
    @GetMapping("/api/equipment")
    List<EquipmentResponse> getAllEquipment();
}