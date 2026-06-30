package cts.equipment.repository;

import cts.equipment.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, String> {
    
    Optional<Vendor> findByVendorId(String vendorId);
    
    Optional<Vendor> findByContactEmail(String contactEmail);
    
    boolean existsByVendorId(String vendorId);
    
    boolean existsByContactEmail(String contactEmail);
}