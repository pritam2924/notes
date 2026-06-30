package cts.equipment.repository;

import cts.equipment.entity.EquipmentLifecycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EquipmentLifecycleRepository extends JpaRepository<EquipmentLifecycle, Long> {
    List<EquipmentLifecycle> findByEquipmentIdOrderByStatusChangedAtDesc(String equipmentId);
}