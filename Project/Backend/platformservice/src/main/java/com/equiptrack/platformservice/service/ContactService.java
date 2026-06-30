package com.equiptrack.platformservice.service;

import com.equiptrack.platformservice.entity.Contact;
import com.equiptrack.platformservice.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final EmailService emailService;

    public Contact saveContact(String email, String message) {
        Contact contact = new Contact();
        contact.setEmail(email);
        contact.setMessage(message);
        contact.setCreatedAt(LocalDateTime.now());
        
        System.out.println("Service: Attempting to save contact with email: " + email);
        try {
            Contact saved = contactRepository.save(contact);
            System.out.println("Service: Contact saved successfully with ID: " + saved.getId());
            return saved;
        } catch (Exception e) {
            System.err.println("Service: Error saving contact: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public Contact saveContact(Contact contact) {
        System.out.println("Service: Attempting to save contact with email: " + contact.getEmail());
        try {
            Contact saved = contactRepository.save(contact);
            System.out.println("Service: Contact saved successfully with ID: " + saved.getId());
            return saved;
        } catch (Exception e) {
            System.err.println("Service: Error saving contact: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    @Transactional
    public Contact sendReply(Long contactId, String email, String replyMessage) {
        Contact contact = contactRepository.findById(contactId)
            .orElseThrow(() -> new RuntimeException("Contact not found"));

        // Send email (or log)
        String subject = "Reply to your message - EquipTrack";
        String body = "Dear User,\n\n" +
                      "Thank you for contacting us. Here is our response:\n\n" +
                      replyMessage + "\n\n" +
                      "Original Message:\n" + contact.getMessage() + "\n\n" +
                      "Best regards,\n" +
                      "EquipTrack Team";

        emailService.sendEmail(email, subject, body);

        // Mark as replied and persist the reply message immediately
        contact.setReplied(true);
        contact.setRepliedAt(LocalDateTime.now());
        contact.setReplyMessage(replyMessage);
        Contact updated = contactRepository.saveAndFlush(contact);

        // Log saved reply for verification (also visible when spring.jpa.show-sql=true)
        System.out.println("Reply saved for contact id=" + updated.getId() + " replyMessage='" + updated.getReplyMessage() + "'");
        System.out.println("Reply sent successfully to: " + email);

        return updated;
    }
}
