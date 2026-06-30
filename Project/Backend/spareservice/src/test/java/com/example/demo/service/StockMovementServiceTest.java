package com.example.demo.service;

import com.example.demo.dto.StockMovementRequest;
import com.example.demo.dto.StockMovementResponse;
import com.example.demo.entity.SparePart;
import com.example.demo.entity.StockMovement;
import com.example.demo.repository.SparePartRepository;
import com.example.demo.repository.StockMovementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StockMovementServiceTest {

    @Mock
    private StockMovementRepository stockMovementRepository;

    @Mock
    private SparePartRepository sparePartRepository;

    @InjectMocks
    private StockMovementService stockMovementService;

    private StockMovementRequest request;
    private StockMovement stockMovement;
    private SparePart sparePart;

    @BeforeEach
    void setUp() {
        request = new StockMovementRequest();
        request.setSparePartId("SP_001");
        request.setMovementType("IN");
        request.setQuantity(10);
        request.setReason("Stock replenishment");
        request.setPerformedBy("admin");

        sparePart = new SparePart();
        sparePart.setSparePartId("SP_001");
        sparePart.setSparePartName("Brake Pad");
        sparePart.setStockQuantity(50);
        sparePart.setMinimumStockLevel(10);

        stockMovement = new StockMovement();
        stockMovement.setMovementId(1L);
        stockMovement.setSparePartId("SP_001");
        stockMovement.setMovementType("IN");
        stockMovement.setQuantity(10);
        stockMovement.setReason("Stock replenishment");
        stockMovement.setPerformedBy("admin");
        stockMovement.setPreviousStock(50);
        stockMovement.setNewStock(60);
    }

    @Test
    void testCreateStockMovement_Success() {
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));
        when(stockMovementRepository.save(any(StockMovement.class))).thenReturn(stockMovement);
        when(sparePartRepository.save(any(SparePart.class))).thenReturn(sparePart);

        StockMovementResponse response = stockMovementService.recordStockMovement(request);

        assertNotNull(response);
        assertEquals("SP_001", response.getSparePartId());
        assertEquals("IN", response.getMovementType());
        assertEquals(10, response.getQuantity());
        verify(stockMovementRepository, times(1)).save(any(StockMovement.class));
    }

    @Test
    void testGetAllStockMovements_ReturnsAll() {
        SparePart sparePart2 = new SparePart();
        sparePart2.setSparePartId("SP_002");
        sparePart2.setSparePartName("Oil Filter");

        StockMovement movement2 = new StockMovement();
        movement2.setMovementId(2L);
        movement2.setSparePartId("SP_002");
        movement2.setMovementType("OUT");

        when(stockMovementRepository.findAll()).thenReturn(Arrays.asList(stockMovement, movement2));
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));
        when(sparePartRepository.findById("SP_002")).thenReturn(Optional.of(sparePart2));

        List<StockMovementResponse> responses = stockMovementService.getAllStockMovements();

        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals("SP_001", responses.get(0).getSparePartId());
        assertEquals("SP_002", responses.get(1).getSparePartId());
    }

    @Test
    void testGetStockMovementsBySparePartId_ReturnsFiltered() {
        when(stockMovementRepository.findBySparePartId("SP_001")).thenReturn(Arrays.asList(stockMovement));
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));

        List<StockMovementResponse> responses = stockMovementService.getStockMovementsBySparePart("SP_001");

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("SP_001", responses.get(0).getSparePartId());
        verify(stockMovementRepository, times(1)).findBySparePartId("SP_001");
    }

    @Test
    void testGetStockMovementById_Found() {
        when(stockMovementRepository.findById(1L)).thenReturn(Optional.of(stockMovement));
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));

        StockMovementResponse response = stockMovementService.getStockMovementById(1L);

        assertNotNull(response);
        assertEquals("SP_001", response.getSparePartId());
        assertEquals("Brake Pad", response.getSparePartName());
    }

    @Test
    void testGetStockMovementById_NotFound_ThrowsException() {
        when(stockMovementRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            stockMovementService.getStockMovementById(999L);
        });
    }

    @Test
    void testCreateStockMovement_TypeIN_UpdatesStock() {
        request.setMovementType("IN");
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));
        when(stockMovementRepository.save(any(StockMovement.class))).thenReturn(stockMovement);
        when(sparePartRepository.save(any(SparePart.class))).thenReturn(sparePart);

        StockMovementResponse response = stockMovementService.recordStockMovement(request);

        assertNotNull(response);
        assertEquals("IN", response.getMovementType());
        assertEquals(10, response.getQuantity());
        verify(sparePartRepository).save(argThat(sp -> sp.getStockQuantity() == 60));
    }

    @Test
    void testCreateStockMovement_TypeOUT_UpdatesStock() {
        request.setMovementType("OUT");
        stockMovement.setMovementType("OUT");
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));
        when(stockMovementRepository.save(any(StockMovement.class))).thenReturn(stockMovement);
        when(sparePartRepository.save(any(SparePart.class))).thenReturn(sparePart);

        StockMovementResponse response = stockMovementService.recordStockMovement(request);

        assertNotNull(response);
        assertEquals("OUT", response.getMovementType());
        verify(sparePartRepository).save(argThat(sp -> sp.getStockQuantity() == 40));
    }

    @Test
    void testCreateStockMovement_InsufficientStock_ThrowsException() {
        request.setMovementType("OUT");
        request.setQuantity(100);
        sparePart.setStockQuantity(50);
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));

        assertThrows(RuntimeException.class, () -> {
            stockMovementService.recordStockMovement(request);
        });
    }

    @Test
    void testCreateStockMovement_InvalidMovementType_ThrowsException() {
        request.setMovementType("INVALID");
        when(sparePartRepository.findById("SP_001")).thenReturn(Optional.of(sparePart));

        assertThrows(RuntimeException.class, () -> {
            stockMovementService.recordStockMovement(request);
        });
    }
}
