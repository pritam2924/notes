package cts.equipment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public class VendorRequest {
    
    @NotBlank(message = "Vendor name is required")
    private String vendorName;
    
    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid email format")
    private String contactEmail;

    // Default constructor
    public VendorRequest() {}

    // Constructor with parameters
    public VendorRequest(String vendorName, String contactEmail) {
        this.vendorName = vendorName;
        this.contactEmail = contactEmail;
    }

    // Getters and Setters
    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
}