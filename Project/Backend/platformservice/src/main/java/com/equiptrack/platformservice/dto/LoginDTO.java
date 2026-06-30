package com.equiptrack.platformservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {
    
    @NotBlank(message = "User ID is required")
    private String userID;
    
    @NotBlank(message = "Password is required")
    private String password;
}