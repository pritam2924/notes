package cts.equipment.service;

import cts.equipment.dto.EquipmentRequest;
import cts.equipment.dto.EquipmentResponse;
import cts.equipment.entity.Equipment;
import cts.equipment.entity.EquipmentLifecycle;
import cts.equipment.entity.Vendor;
import cts.equipment.repository.EquipmentRepository;
import cts.equipment.repository.EquipmentLifecycleRepository;
import cts.equipment.repository.VendorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EquipmentServiceTest {

    @Mock
    private EquipmentRepository equipmentRepository;

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private EquipmentLifecycleRepository lifecycleRepository;

    @InjectMocks
    private EquipmentService equipmentService;

    private EquipmentRequest request;
    private Equipment equipment;
    private Vendor vendor;

    @BeforeEach
    void setUp() {
        vendor = new Vendor();
        vendor.setVendorId("VND-1001");
        vendor.setVendorName("Tech Vendor");
        vendor.setContactEmail("vendor@test.com");

        request = new EquipmentRequest();
        request.setEquipmentName("CNC Machine");
        request.setCategory("Mechanical");
        request.setInstallationDate(LocalDate.of(2024, 1, 1));
        request.setEquipmentStatus("ACTIVE");
        request.setModel("CNC-5000");
        request.setWeightKg(2500.0);
        request.setPowerKW(15.5);
        request.setCapacity("500 units/hour");
        request.setVendorId("VND-1001");

        equipment = new Equipment();
        equipment.setEquipmentId("EQ-MECH-2024-1001");
        equipment.setEquipmentName("CNC Machine");
        equipment.setCategory("Mechanical");
        equipment.setInstallationDate(LocalDate.of(2024, 1, 1));
        equipment.setEquipmentStatus("ACTIVE");
        equipment.setModel("CNC-5000");
        equipment.setWeightKg(2500.0);
        equipment.setPowerKW(15.5);
        equipment.setCapacity("500 units/hour");
        equipment.setVendorId("VND-1001");
        equipment.setVendorName("Tech Vendor");
        equipment.setContactEmail("vendor@test.com");
    }

    @Test
    void testRegisterEquipment_Success() {
        when(vendorRepository.findByVendorId("VND-1001")).thenReturn(Optional.of(vendor));
        when(equipmentRepository.findAll()).thenReturn(Collections.emptyList());
        when(equipmentRepository.save(any(Equipment.class))).thenReturn(equipment);
        when(lifecycleRepository.save(any(EquipmentLifecycle.class))).thenReturn(new EquipmentLifecycle());

        EquipmentResponse response = equipmentService.registerEquipment(request);

        assertNotNull(response);
        assertEquals("CNC Machine", response.getEquipmentName());
        assertEquals("Mechanical", response.getCategory());
        verify(equipmentRepository, times(1)).save(any(Equipment.class));
        verify(lifecycleRepository, times(1)).save(any(EquipmentLifecycle.class));
    }

    @Test
    void testRegisterEquipment_WithoutVendor() {
        request.setVendorId(null);
        when(equipmentRepository.findAll()).thenReturn(Collections.emptyList());
        when(equipmentRepository.save(any(Equipment.class))).thenReturn(equipment);
        when(lifecycleRepository.save(any(EquipmentLifecycle.class))).thenReturn(new EquipmentLifecycle());

        EquipmentResponse response = equipmentService.registerEquipment(request);

        assertNotNull(response);
        verify(vendorRepository, never()).findByVendorId(any());
    }

    @Test
    void testRegisterEquipment_VendorNotFound() {
        when(vendorRepository.findByVendorId("VND-1001")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> equipmentService.registerEquipment(request));
    }

    @Test
    void testGetAllEquipment_ReturnsMultiple() {
        Equipment equipment2 = new Equipment();
        equipment2.setEquipmentId("EQ-ELEC-2024-1002");
        equipment2.setEquipmentName("Generator");

        when(equipmentRepository.findAll()).thenReturn(Arrays.asList(equipment, equipment2));

        List<EquipmentResponse> responses = equipmentService.getAllEquipment();

        assertNotNull(responses);
        assertEquals(2, responses.size());
    }

    @Test
    void testGetEquipmentById_Found() {
        when(equipmentRepository.findByEquipmentId("EQ-MECH-2024-1001")).thenReturn(Optional.of(equipment));

        EquipmentResponse response = equipmentService.getEquipmentById("EQ-MECH-2024-1001");

        assertNotNull(response);
        assertEquals("EQ-MECH-2024-1001", response.getEquipmentId());
    }

    @Test
    void testGetEquipmentById_NotFound() {
        when(equipmentRepository.findByEquipmentId("EQ-999")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> equipmentService.getEquipmentById("EQ-999"));
    }

    @Test
    void testUpdateEquipmentStatus_Success() {
        when(equipmentRepository.findByEquipmentId("EQ-MECH-2024-1001")).thenReturn(Optional.of(equipment));
        when(equipmentRepository.save(any(Equipment.class))).thenReturn(equipment);
        when(lifecycleRepository.save(any(EquipmentLifecycle.class))).thenReturn(new EquipmentLifecycle());

        EquipmentResponse response = equipmentService.updateEquipmentStatus("EQ-MECH-2024-1001", "MAINTENANCE");

        assertNotNull(response);
        verify(lifecycleRepository, times(1)).save(any(EquipmentLifecycle.class));
    }

    @Test
    void testGetEquipmentLifecycle_ReturnsHistory() {
        EquipmentLifecycle lifecycle = new EquipmentLifecycle();
        lifecycle.setEquipmentId("EQ-MECH-2024-1001");
        lifecycle.setStatus("ACTIVE");

        when(lifecycleRepository.findByEquipmentIdOrderByStatusChangedAtDesc("EQ-MECH-2024-1001"))
                .thenReturn(Arrays.asList(lifecycle));

        List<EquipmentLifecycle> history = equipmentService.getEquipmentLifecycle("EQ-MECH-2024-1001");

        assertNotNull(history);
        assertEquals(1, history.size());
    }
}
