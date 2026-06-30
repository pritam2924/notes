package com.equiptrack.platformservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(nullable = false)
    private String email;
    
    @NotBlank(message = "Message is required")
    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private Boolean replied = false;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime repliedAt;

    @Column(name = "reply_message", length = 2000)
    private String replyMessage;

    public Contact(String email, String message) {
        this.email = email;
        this.message = message;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
