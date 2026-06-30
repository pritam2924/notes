package com.example.demo.repository;

import com.example.demo.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, String> {

    List<Alert> findByEquipmentId(String equipmentId);

    List<Alert> findByStatus(String status);

    List<Alert> findByEquipmentIdAndStatus(String equipmentId, String status);
}
