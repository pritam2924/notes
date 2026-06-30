package com.equiptrack.platformservice.controller;

import com.equiptrack.platformservice.dto.LoginDTO;
import com.equiptrack.platformservice.dto.UserRegistrationDTO;
import com.equiptrack.platformservice.entity.User;
import com.equiptrack.platformservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDTO registrationDTO) {
        try {
            userService.registerUser(
                registrationDTO.getFirstName(),
                registrationDTO.getLastName(),
                registrationDTO.getEmail(),
                registrationDTO.getPhoneNumber(),
                registrationDTO.getPassword(),
                registrationDTO.getUserId()
            );
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User registered successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Registration failed: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginDTO loginDTO) {
        try {
            Map<String, Object> result = userService.authenticateUser(loginDTO.getUserID(), loginDTO.getPassword());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Login failed: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/generate-userid")
    public ResponseEntity<?> generateUserId(@RequestBody Map<String, String> request) {
        try {
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");
            String userId = userService.generateUniqueUserID(firstName, lastName);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "userId", userId
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to generate user ID: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<User>> getUsersByStatus(@PathVariable String status) {
        try {
            User.Status userStatus = User.Status.valueOf(status.toUpperCase());
            List<User> users = userService.getUsersByStatus(userStatus);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{userId}/approve")
    public ResponseEntity<?> approveUser(@PathVariable String userId) {
        try {
            User user = userService.approveUser(userId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User approved successfully",
                "user", user
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to approve user: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/{userId}/reject")
    public ResponseEntity<?> rejectUser(@PathVariable String userId) {
        try {
            User user = userService.rejectUser(userId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User rejected successfully",
                "user", user
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to reject user: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody Map<String, String> updates) {
        try {
            User user = userService.updateUser(userId, updates);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable String userId, @RequestBody Map<String, String> passwordData) {
        try {
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");
            userService.changePassword(userId, currentPassword, newPassword);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password changed successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/operators")
    public ResponseEntity<List<User>> getAllOperators() {
        try {
            List<User> operators = userService.getUsersByStatus(User.Status.APPROVED);
            return ResponseEntity.ok(operators);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/role/{userId}")
    public ResponseEntity<String> getUserRole(@PathVariable String userId) {
        try {
            User user = userService.getUserByUserId(userId);
            return ResponseEntity.ok(user.getRole().name());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/details/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        try {
            User user = userService.getUserByUserIdOrAdmin(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            User user = userService.verifyEmailForPasswordReset(email);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "userId", user.getUserID(),
                "username", user.getFirstName() + " " + user.getLastName()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String newPassword = request.get("newPassword");
            userService.resetPassword(userId, newPassword);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password reset successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}