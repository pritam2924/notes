package cts.equipment.service;

import cts.equipment.dto.VendorRequest;
import cts.equipment.dto.VendorResponse;
import cts.equipment.entity.Vendor;
import cts.equipment.repository.VendorRepository;
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
class VendorServiceTest {

    @Mock
    private VendorRepository vendorRepository;

    @InjectMocks
    private VendorService vendorService;

    private VendorRequest request;
    private Vendor vendor;

    @BeforeEach
    void setUp() {
        request = new VendorRequest();
        request.setVendorName("Tech Vendor");
        request.setContactEmail("vendor@test.com");

        vendor = new Vendor();
        vendor.setVendorId("VND-1001");
        vendor.setVendorName("Tech Vendor");
        vendor.setContactEmail("vendor@test.com");
    }

    @Test
    void testRegisterVendor_Success() {
        when(vendorRepository.existsByContactEmail("vendor@test.com")).thenReturn(false);
        when(vendorRepository.findAll()).thenReturn(Collections.emptyList());
        when(vendorRepository.save(any(Vendor.class))).thenReturn(vendor);

        VendorResponse response = vendorService.registerVendor(request);

        assertNotNull(response);
        assertEquals("Tech Vendor", response.getVendorName());
        assertEquals("vendor@test.com", response.getContactEmail());
        verify(vendorRepository, times(1)).save(any(Vendor.class));
    }

    @Test
    void testRegisterVendor_DuplicateEmail() {
        when(vendorRepository.existsByContactEmail("vendor@test.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> vendorService.registerVendor(request));
        verify(vendorRepository, never()).save(any(Vendor.class));
    }

    @Test
    void testGetAllVendors_ReturnsMultiple() {
        Vendor vendor2 = new Vendor();
        vendor2.setVendorId("VND-1002");
        vendor2.setVendorName("Another Vendor");

        when(vendorRepository.findAll()).thenReturn(Arrays.asList(vendor, vendor2));

        List<VendorResponse> responses = vendorService.getAllVendors();

        assertNotNull(responses);
        assertEquals(2, responses.size());
    }

    @Test
    void testGetAllVendors_ReturnsEmpty() {
        when(vendorRepository.findAll()).thenReturn(Collections.emptyList());

        List<VendorResponse> responses = vendorService.getAllVendors();

        assertNotNull(responses);
        assertTrue(responses.isEmpty());
    }

    @Test
    void testGetVendorById_Found() {
        when(vendorRepository.findByVendorId("VND-1001")).thenReturn(Optional.of(vendor));

        VendorResponse response = vendorService.getVendorById("VND-1001");

        assertNotNull(response);
        assertEquals("VND-1001", response.getVendorId());
        assertEquals("Tech Vendor", response.getVendorName());
    }

    @Test
    void testGetVendorById_NotFound() {
        when(vendorRepository.findByVendorId("VND-999")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> vendorService.getVendorById("VND-999"));
    }
}
