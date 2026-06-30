package com.example.demo.service;

import com.example.demo.client.EquipmentServiceClient;
import com.example.demo.client.PlatformServiceClient;
import com.example.demo.dto.EquipmentResponse;
import com.example.demo.dto.RequisitionRequest;
import com.example.demo.dto.RequisitionResponse;
import com.example.demo.entity.Requisition;
import com.example.demo.entity.SparePart;
import com.example.demo.repository.RequisitionRepository;
import com.example.demo.repository.SparePartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RequisitionServiceTest {

    @Mock
    private RequisitionRepository requisitionRepository;

    @Mock
    private SparePartRepository sparePartRepository;

    @Mock
    private EquipmentServiceClient equipmentServiceClient;

    @Mock
    private PlatformServiceClient platformServiceClient;

    @InjectMocks
    private RequisitionService requisitionService;

    private RequisitionRequest request;
    private Requisition requisition;
    private SparePart sparePart;

    @BeforeEach
    void setUp() {
        request = new RequisitionRequest();
        request.setSparePartId("SP_001");
        request.setEquipmentId("EQ_001");
        request.setRequestedQuantity(5);
        request.setRequestedBy("operator1");
        request.setNotes("Urgent requirement");

        requisition = new Requisition();
        requisition.setId(1L);
        requisition.setSparePartId("SP_001");
        requisition.setEquipmentId("EQ_001");
        requisition.setRequestedQuantity(5);
        requisition.setRequestedBy("operator1");
        requisition.setStatus("PENDING");

        sparePart = new SparePart();
        sparePart.setSparePartId("SP_001");
        sparePart.setSparePartName("Brake Pad");
        sparePart.setStockQuantity(50);
        sparePart.setMinimumStockLevel(10);
    }

    @Test
    void testCreateRequisition_Success() {
        when(requisitionRepository.save(any(Requisition.class))).thenReturn(requisition);

        RequisitionResponse response = requisitionService.createRequisition(request);

        assertNotNull(response);
        assertEquals("SP_001", response.getSparePartId());
        assertEquals("PENDING", response.getStatus());
        verify(requisitionRepository, times(1)).save(any(Requisition.class));
    }

    @Test
    void testCreateRequisition_EquipmentValidationSuccess() {
        EquipmentResponse equipmentResponse = new EquipmentResponse();
        equipmentResponse.setEquipmentId("EQ_001");
        equipmentResponse.setEquipmentName("Excavator");
        
        when(equipmentServiceClient.getEquipmentById("EQ_001")).thenReturn(equipmentResponse);
        when(requisitionRepository.save(any(Requisition.class))).thenReturn(requisition);

        RequisitionResponse response = requisitionService.createRequisition(request);

        assertNotNull(response);
        assertEquals("PENDING", response.getStatus());
        assertEquals("SP_001", response.getSparePartId());
    }

    @Test
    void testCreateRequisition_EquipmentValidationFails_ContinuesAnyway() {
        when(equipmentServiceClient.getEquipmentById(anyString())).thenThrow(new RuntimeException("Service down"));
        when(requisitionRepository.save(any(Requisition.class))).thenReturn(requisition);

        RequisitionResponse response = requisitionService.createRequisition(request);

        assertNotNull(response);
        assertEquals("PENDING", response.getStatus());
    }

    @Test
    void testCreateRequisition_EquipmentServiceDown_ContinuesAnyway() {
        when(equipmentServiceClient.getEquipmentById(anyString())).thenThrow(new RuntimeException("Connection timeout"));
        when(requisitionRepository.save(any(Requisition.class))).thenReturn(requisition);

        assertDoesNotThrow(() -> requisitionService.createRequisition(request));
    }

    @Test
    void testGetAllRequisitions_ReturnsAll() {
        Requisition req2 = new Requisition();
        req2.setId(2L);
        req2.setStatus("APPROVED");

        when(requisitionRepository.findAll()).thenReturn(Arrays.asList(requisition, req2));

        List<RequisitionResponse> responses = requisitionService.getAllRequisitions();

        assertNotNull(responses);
        assertEquals(2, responses.size());
    }

    @Test
    void testGetPendingRequisitions_ReturnsOnlyPending() {
        when(requisitionRepository.findByStatus("PENDING")).thenReturn(Arrays.asList(requisition));

        List<RequisitionResponse> responses = requisitionService.getPendingRequisitions();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("PENDING", responses.get(0).getStatus());
    }

    @Test
    void testApproveRequisition_Success() {
        when(requisitionRepository.findById(1L)).thenReturn(Optional.of(requisition));
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));
        when(platformServiceClient.getUserRole("admin")).thenReturn("ADMIN");
        when(requisitionRepository.save(any(Requisition.class))).thenReturn(requisition);
        when(sparePartRepository.save(any(SparePart.class))).thenReturn(sparePart);

        RequisitionResponse response = requisitionService.approveRequisition(1L, "Approved", "admin");

        assertNotNull(response);
        verify(sparePartRepository, times(1)).save(any(SparePart.class));
    }

    @Test
    void testApproveRequisition_AdminRoleVerified() {
        when(requisitionRepository.findById(1L)).thenReturn(Optional.of(requisition));
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));
        when(platformServiceClient.getUserRole("admin")).thenReturn("ADMIN");
        when(requisitionRepository.save(any(Requisition.class))).thenReturn(requisition);
        when(sparePartRepository.save(any(SparePart.class))).thenReturn(sparePart);

        assertDoesNotThrow(() -> requisitionService.approveRequisition(1L, "Approved", "admin"));
        verify(platformServiceClient, times(1)).getUserRole("admin");
    }

    @Test
    void testApproveRequisition_UserServiceDown_ContinuesAnyway() {
        when(requisitionRepository.findById(1L)).thenReturn(Optional.of(requisition));
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));
        when(platformServiceClient.getUserRole(anyString())).thenThrow(new RuntimeException("Service down"));
        when(requisitionRepository.save(any(Requisition.class))).thenReturn(requisition);
        when(sparePartRepository.save(any(SparePart.class))).thenReturn(sparePart);

        assertDoesNotThrow(() -> requisitionService.approveRequisition(1L, "Approved", "admin"));
    }

    @Test
    void testApproveRequisition_InventoryReducedCorrectly() {
        when(requisitionRepository.findById(1L)).thenReturn(Optional.of(requisition));
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));
        when(platformServiceClient.getUserRole("admin")).thenReturn("ADMIN");
        when(requisitionRepository.save(any(Requisition.class))).thenReturn(requisition);
        when(sparePartRepository.save(any(SparePart.class))).thenReturn(sparePart);

        requisitionService.approveRequisition(1L, "Approved", "admin");

        verify(sparePartRepository).save(argThat(sp -> sp.getStockQuantity() == 45));
    }

    @Test
    void testApproveRequisition_InsufficientStock_ThrowsException() {
        sparePart.setStockQuantity(3);
        when(requisitionRepository.findById(1L)).thenReturn(Optional.of(requisition));
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));
        when(platformServiceClient.getUserRole("admin")).thenReturn("ADMIN");

        assertThrows(RuntimeException.class, () -> {
            requisitionService.approveRequisition(1L, "Approved", "admin");
        });
    }

    @Test
    void testApproveRequisition_SparePartNotFound_ThrowsException() {
        when(requisitionRepository.findById(1L)).thenReturn(Optional.of(requisition));
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.empty());
        when(platformServiceClient.getUserRole("admin")).thenReturn("ADMIN");

        assertThrows(RuntimeException.class, () -> {
            requisitionService.approveRequisition(1L, "Approved", "admin");
        });
    }

    @Test
    void testApproveRequisition_RequisitionNotFound_ThrowsException() {
        when(requisitionRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            requisitionService.approveRequisition(999L, "Approved", "admin");
        });
    }

    @Test
    void testRejectRequisition_Success() {
        when(requisitionRepository.findById(1L)).thenReturn(Optional.of(requisition));
        when(platformServiceClient.getUserRole("admin")).thenReturn("ADMIN");
        when(requisitionRepository.save(any(Requisition.class))).thenReturn(requisition);

        RequisitionResponse response = requisitionService.rejectRequisition(1L, "Not needed", "admin");

        assertNotNull(response);
        verify(requisitionRepository, times(1)).save(any(Requisition.class));
    }

    @Test
    void testRejectRequisition_AdminRoleVerified() {
        when(requisitionRepository.findById(1L)).thenReturn(Optional.of(requisition));
        when(platformServiceClient.getUserRole("admin")).thenReturn("ADMIN");
        when(requisitionRepository.save(any(Requisition.class))).thenReturn(requisition);

        assertDoesNotThrow(() -> requisitionService.rejectRequisition(1L, "Not needed", "admin"));
        verify(platformServiceClient, times(1)).getUserRole("admin");
    }

    @Test
    void testRejectRequisition_UserServiceDown_ContinuesAnyway() {
        when(requisitionRepository.findById(1L)).thenReturn(Optional.of(requisition));
        when(platformServiceClient.getUserRole(anyString())).thenThrow(new RuntimeException("Service down"));
        when(requisitionRepository.save(any(Requisition.class))).thenReturn(requisition);

        assertDoesNotThrow(() -> requisitionService.rejectRequisition(1L, "Not needed", "admin"));
    }

    @Test
    void testRejectRequisition_RequisitionNotFound_ThrowsException() {
        when(requisitionRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            requisitionService.rejectRequisition(999L, "Not needed", "admin");
        });
    }

    @Test
    void testMapToResponse_PopulatesSparePartName() {
        when(requisitionRepository.findAll()).thenReturn(Arrays.asList(requisition));
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));

        List<RequisitionResponse> responses = requisitionService.getAllRequisitions();

        assertNotNull(responses);
        assertEquals("Brake Pad", responses.get(0).getSparePartName());
    }
}
