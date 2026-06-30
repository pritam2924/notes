package com.equiptrack.platformservice.dto;

import com.equiptrack.platformservice.entity.User;
import java.time.LocalDateTime;

public class UserResponseDTO {
    
    // id removed; use userID as primary identifier
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String userID;
    private User.Status status;
    private LocalDateTime registrationDate;

    // Constructors
    public UserResponseDTO() {}

    public UserResponseDTO(User user) {
        this.userID = user.getUserID();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        
        this.status = user.getStatus();
        this.registrationDate = user.getRegistrationDate();
    }

    // Getters and Setters

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getUserID() { return userID; }
    public void setUserID(String userID) { this.userID = userID; }

    public User.Status getStatus() { return status; }
    public void setStatus(User.Status status) { this.status = status; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
}