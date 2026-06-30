package com.equiptrack.platformservice.service;

import com.equiptrack.platformservice.entity.User;
import com.equiptrack.platformservice.repository.UserRepository;
import com.equiptrack.platformservice.exception.ResourceNotFoundException;
import com.equiptrack.platformservice.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtTokenUtil jwtTokenUtil;

    public User registerUser(String firstName, String lastName, String email, String phoneNumber, String password, String userId) {
        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        // Check if userId already exists
        if (userRepository.existsByUserID(userId)) {
            throw new RuntimeException("User ID already exists");
        }

    User user = new User(firstName, lastName, email, phoneNumber);
    user.setPassword(password);
    user.setUserID(userId);

    User saved = userRepository.save(user);

    return saved;
    }

    public List<User> getPendingUsers() {
        return userRepository.findByStatus(User.Status.PENDING);
    }

    public List<User> getUsersByStatus(User.Status status) {
        return userRepository.findByStatus(status);
    }

    public User approveUser(String userId) {
        logger.debug("Approving user with ID: {}", userId);
        User user = userRepository.findByUserID(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setStatus(User.Status.APPROVED);
        User savedUser = userRepository.save(user);
        logger.info("User approved successfully: {}", userId);

        sendCredentialsEmail(user.getEmail(), user.getUserID(), user.getPassword());
        return savedUser;
    }

    public User rejectUser(String userId) {
        logger.debug("Rejecting user with ID: {}", userId);
        User user = userRepository.findByUserID(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setStatus(User.Status.REJECTED);
        User savedUser = userRepository.save(user);
        logger.info("User rejected: {}", userId);
        return savedUser;
    }

    public String generateUniqueUserID(String firstName, String lastName) {
        String base = (firstName.substring(0, 1) + lastName).toLowerCase();
        String userId;
        int counter = 0;

        do {
            String suffix = counter == 0 ? "" : String.valueOf(counter);
            String timestamp = String.valueOf(System.currentTimeMillis() % 10000);
            userId = base + timestamp + suffix;
            counter++;
        } while (userRepository.existsByUserID(userId));

        return userId;
    }

    private String generateUserID(String firstName, String lastName) {
        String base = (firstName.substring(0, 1) + lastName).toLowerCase();
        String timestamp = String.valueOf(System.currentTimeMillis() % 10000);
        return base + timestamp;
    }

    private String generatePassword() {
        return "password@123";
    }


    
    public Map<String, Object> authenticateUser(String userID, String password) {
        // Admin login
        if ("2501001".equals(userID) && "admin@123".equals(password)) {
            User adminUser = new User();
            adminUser.setUserID("2501001");
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setEmail("admin@equiptrack.com");
            adminUser.setPhoneNumber("1234567890");
            
            String token = jwtTokenUtil.generateToken("2501001", "ADMIN");
            
            return Map.of(
                "success", true,
                "userType", "ADMIN",
                "message", "Admin login successful",
                "redirectTo", "admin-dashboard",
                "user", adminUser,
                "token", token
            );
        }
        
        // User login
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            if (userID.equals(user.getUserID()) && password.equals(user.getPassword())) {
                if (user.getStatus() == User.Status.APPROVED) {
                    String token = jwtTokenUtil.generateToken(user.getUserID(), "USER");
                    
                    return Map.of(
                        "success", true,
                        "userType", "USER",
                        "message", "Login successful",
                        "redirectTo", "operator-dashboard",
                        "user", user,
                        "token", token
                    );
                } else {
                    throw new RuntimeException("Account not approved yet");
                }
            }
        }
        
        throw new RuntimeException("Invalid credentials");
    }

    private void sendCredentialsEmail(String email, String userID, String password) {
        String subject = "Your EquipTrack Account Approved";
        String body = "Dear User,\n\n" +
                      "Your registration has been approved!\n\n" +
                      "Your login credentials:\n" +
                      "User ID: " + userID + "\n" +
                      "Password: " + password + "\n\n" +
                      "Please login and change your password.\n\n" +
                      "Best regards,\n" +
                      "EquipTrack Team";

        emailService.sendEmail(email, subject, body);
    }

    public User updateUser(String userId, Map<String, String> updates) {
        User user = userRepository.findByUserID(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (updates.containsKey("firstName")) {
            user.setFirstName(updates.get("firstName"));
        }
        if (updates.containsKey("lastName")) {
            user.setLastName(updates.get("lastName"));
        }
        if (updates.containsKey("email")) {
            user.setEmail(updates.get("email"));
        }
        if (updates.containsKey("phoneNumber")) {
            user.setPhoneNumber(updates.get("phoneNumber"));
        }
        
        return userRepository.save(user);
    }

    public void changePassword(String userId, String currentPassword, String newPassword) {
        User user = userRepository.findByUserID(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!currentPassword.equals(user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPassword(newPassword);
        userRepository.save(user);
    }

    public User getUserByUserId(String userId) {
        return userRepository.findByUserID(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    public User verifyEmailForPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email not found"));
        
        if (user.getStatus() != User.Status.APPROVED) {
            throw new RuntimeException("Account is not approved");
        }
        
        return user;
    }

    public void resetPassword(String userId, String newPassword) {
        User user = userRepository.findByUserID(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPassword(newPassword);
        userRepository.save(user);
    }

    public User getUserByUserIdOrAdmin(String userId) {
        if ("2501001".equals(userId)) {
            User adminUser = new User();
            adminUser.setUserID("2501001");
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setEmail("admin@equiptrack.com");
            adminUser.setPhoneNumber("1234567890");
            adminUser.setRole(User.Role.ADMIN);
            adminUser.setStatus(User.Status.APPROVED);
            return adminUser;
        }
        return userRepository.findByUserID(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }
}