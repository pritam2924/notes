package com.equiptrack.platformservice.controller;

import com.equiptrack.platformservice.dto.ContactDTO;
import com.equiptrack.platformservice.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitContact(@Valid @RequestBody ContactDTO contactDTO) {
        try {
            contactService.saveContact(contactDTO.getEmail(), contactDTO.getMessage());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Thank you for your message! We'll get back to you soon."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to submit message: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<?> getAllContactMessages() {
        try {
            return ResponseEntity.ok(contactService.getAllContacts());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to fetch messages: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/reply/{contactId}")
    public ResponseEntity<?> replyToContact(@PathVariable Long contactId, @RequestBody Map<String, String> request) {
        try {
            String replyMessage = request.get("replyMessage");
            String email = request.get("email");
            
            contactService.sendReply(contactId, email, replyMessage);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Reply sent successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to send reply: " + e.getMessage()
            ));
        }
    }
}