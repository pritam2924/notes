package cts.equipment.repository;

import cts.equipment.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, String> {
    
    Optional<Equipment> findByEquipmentId(String equipmentId);
    
    @Query("SELECT e FROM Equipment e WHERE e.category = :category AND YEAR(e.installationDate) = :year")
    List<Equipment> findByCategoryAndInstallationYear(@Param("category") String category, @Param("year") int year);
    
    List<Equipment> findByCategory(String category);
    
    List<Equipment> findByEquipmentStatus(String status);
}