package cts.equipment.service;

import cts.equipment.dto.VendorRequest;
import cts.equipment.dto.VendorResponse;
import cts.equipment.entity.Vendor;
import cts.equipment.repository.VendorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VendorService {
    
    private final VendorRepository vendorRepository;
    
    public VendorService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }
    
    @Transactional
    public VendorResponse registerVendor(VendorRequest request) {
        // Check if vendor already exists by email
        if (vendorRepository.existsByContactEmail(request.getContactEmail())) {
            throw new RuntimeException("Vendor with this email already exists");
        }
        
        String vendorId = generateVendorId();
        
        Vendor vendor = new Vendor();
        vendor.setVendorId(vendorId);
        vendor.setVendorName(request.getVendorName());
        vendor.setContactEmail(request.getContactEmail());
        
        Vendor saved = vendorRepository.save(vendor);
        return mapToResponse(saved);
    }
    
    public List<VendorResponse> getAllVendors() {
        return vendorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public VendorResponse getVendorById(String vendorId) {
        Vendor vendor = vendorRepository.findByVendorId(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + vendorId));
        return mapToResponse(vendor);
    }
    
    private String generateVendorId() {
        List<Vendor> allVendors = vendorRepository.findAll();
        
        int maxSequence = 1000;
        for (Vendor vendor : allVendors) {
            String[] parts = vendor.getVendorId().split("-");
            if (parts.length == 2 && parts[0].equals("VND")) {
                try {
                    int sequence = Integer.parseInt(parts[1]);
                    if (sequence > maxSequence) {
                        maxSequence = sequence;
                    }
                } catch (NumberFormatException ignored) {}
            }
        }
        
        int nextSequence = maxSequence + 1;
        return String.format("VND-%d", nextSequence);
    }
    
    private VendorResponse mapToResponse(Vendor vendor) {
        VendorResponse response = new VendorResponse();
        response.setVendorId(vendor.getVendorId());
        response.setVendorName(vendor.getVendorName());
        response.setContactEmail(vendor.getContactEmail());
        response.setCreatedAt(vendor.getCreatedAt());
        response.setUpdatedAt(vendor.getUpdatedAt());
        return response;
    }
}