package com.example.demo.repository;

import com.example.demo.entity.SparePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, String> {
    List<SparePart> findByEquipmentId(String equipmentId);

    @Query("SELECT s FROM SparePart s WHERE s.stockQuantity < s.minimumStockLevel")
    List<SparePart> findLowStockSpareParts();

    @Query("SELECT s FROM SparePart s WHERE s.stockQuantity < :threshold")
    List<SparePart> findCriticalStockSpareParts(@Param("threshold") Integer threshold);
}
