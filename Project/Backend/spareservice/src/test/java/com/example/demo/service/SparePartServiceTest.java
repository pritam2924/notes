package com.example.demo.service;

import com.example.demo.dto.SparePartRequest;
import com.example.demo.dto.SparePartResponse;
import com.example.demo.entity.SparePart;
import com.example.demo.repository.SparePartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SparePartServiceTest {

    @Mock
    private SparePartRepository sparePartRepository;

    @InjectMocks
    private SparePartService sparePartService;

    private SparePartRequest request;
    private SparePart sparePart;

    @BeforeEach
    void setUp() {
        request = new SparePartRequest();
        request.setSparePartId("SP_001");
        request.setSparePartName("Brake Pad");
        request.setDescription("High quality brake pad");
        request.setStockQuantity(50);
        request.setMinimumStockLevel(10);
        request.setUnitPrice(25.99);
        request.setEquipmentId("EQ_001");
        request.setEquipmentName("Excavator");

        sparePart = new SparePart();
        sparePart.setSparePartId("SP_001");
        sparePart.setSparePartName("Brake Pad");
        sparePart.setDescription("High quality brake pad");
        sparePart.setStockQuantity(50);
        sparePart.setMinimumStockLevel(10);
        sparePart.setUnitPrice(25.99);
        sparePart.setEquipmentId("EQ_001");
        sparePart.setEquipmentName("Excavator");
    }

    @Test
    void testCreateSparePart_Success() {
        when(sparePartRepository.save(any(SparePart.class))).thenReturn(sparePart);

        SparePartResponse response = sparePartService.createSparePart(request);

        assertNotNull(response);
        assertEquals("SP_001", response.getSparePartId());
        assertEquals("Brake Pad", response.getSparePartName());
        verify(sparePartRepository, times(1)).save(any(SparePart.class));
    }

    @Test
    void testCreateSparePart_WithAllFields() {
        when(sparePartRepository.save(any(SparePart.class))).thenReturn(sparePart);

        SparePartResponse response = sparePartService.createSparePart(request);

        assertNotNull(response);
        assertEquals(50, response.getStockQuantity());
        assertEquals(10, response.getMinimumStockLevel());
        assertEquals(25.99, response.getUnitPrice());
        assertEquals("EQ_001", response.getEquipmentId());
    }

    @Test
    void testGetAllSpareParts_ReturnsEmptyList() {
        when(sparePartRepository.findAll()).thenReturn(Collections.emptyList());

        List<SparePartResponse> responses = sparePartService.getAllSpareParts();

        assertNotNull(responses);
        assertTrue(responses.isEmpty());
        verify(sparePartRepository, times(1)).findAll();
    }

    @Test
    void testGetAllSpareParts_ReturnsMultipleParts() {
        SparePart sparePart2 = new SparePart();
        sparePart2.setSparePartId("SP_002");
        sparePart2.setSparePartName("Oil Filter");
        sparePart2.setStockQuantity(30);
        sparePart2.setMinimumStockLevel(5);

        when(sparePartRepository.findAll()).thenReturn(Arrays.asList(sparePart, sparePart2));

        List<SparePartResponse> responses = sparePartService.getAllSpareParts();

        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals("SP_001", responses.get(0).getSparePartId());
        assertEquals("SP_002", responses.get(1).getSparePartId());
    }

    @Test
    void testGetSparePartById_Found() {
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));

        SparePartResponse response = sparePartService.getSparePartById("SP_001");

        assertNotNull(response);
        assertEquals("SP_001", response.getSparePartId());
        assertEquals("Brake Pad", response.getSparePartName());
    }

    @Test
    void testGetSparePartById_NotFound_ThrowsException() {
        when(sparePartRepository.findById("SP_999")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            sparePartService.getSparePartById("SP_999");
        });
    }

    @Test
    void testGetLowStockSpareParts_ReturnsFiltered() {
        sparePart.setStockQuantity(5);
        when(sparePartRepository.findLowStockSpareParts()).thenReturn(Arrays.asList(sparePart));

        List<SparePartResponse> responses = sparePartService.getLowStockSpareParts();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertTrue(responses.get(0).isLowStock());
    }

    @Test
    void testGetSparePartsByEquipment_ReturnsFiltered() {
        when(sparePartRepository.findByEquipmentId("EQ_001")).thenReturn(Arrays.asList(sparePart));

        List<SparePartResponse> responses = sparePartService.getSparePartsByEquipment("EQ_001");

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("EQ_001", responses.get(0).getEquipmentId());
    }

    @Test
    void testUpdateSparePart_Success() {
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));
        when(sparePartRepository.save(any(SparePart.class))).thenReturn(sparePart);

        request.setStockQuantity(100);
        SparePartResponse response = sparePartService.updateSparePart("SP_001", request);

        assertNotNull(response);
        verify(sparePartRepository, times(1)).save(any(SparePart.class));
    }

    @Test
    void testUpdateSparePart_NotFound_ThrowsException() {
        when(sparePartRepository.findById("SP_999")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            sparePartService.updateSparePart("SP_999", request);
        });
    }

    @Test
    void testDeleteSparePart_Success() {
        when(sparePartRepository.existsById("SP_001")).thenReturn(true);
        doNothing().when(sparePartRepository).deleteById("SP_001");

        assertDoesNotThrow(() -> sparePartService.deleteSparePart("SP_001"));
        verify(sparePartRepository, times(1)).deleteById("SP_001");
    }

    @Test
    void testDeleteSparePart_NotFound_ThrowsException() {
        when(sparePartRepository.existsById("SP_999")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> {
            sparePartService.deleteSparePart("SP_999");
        });
    }
}
