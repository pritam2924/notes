package com.cts.equiptrack.maintenance.client;

import com.cts.equiptrack.maintenance.dto.SparePartResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "SPARE-SERVICE")
public interface SparePartServiceClient {
    
    @GetMapping("/api/spare-parts/equipment/{equipmentId}")
    List<SparePartResponse> getSparePartsByEquipment(@PathVariable("equipmentId") String equipmentId);
    
    @GetMapping("/api/spare-parts/{sparePartId}")
    SparePartResponse getSparePartById(@PathVariable("sparePartId") String sparePartId);
}