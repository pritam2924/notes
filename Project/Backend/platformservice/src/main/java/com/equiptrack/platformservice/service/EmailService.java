package com.equiptrack.platformservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private MailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);
                message.setFrom("noreply@equiptrack.com");

                mailSender.send(message);
                System.out.println("✓ Email sent successfully to: " + to);
            } else {
                // Fallback: Log email details when mail server is not configured
                System.out.println("\n========== EMAIL (Mock Mode) ==========");
                System.out.println("To: " + to);
                System.out.println("Subject: " + subject);
                System.out.println("Body:\n" + body);
                System.out.println("======================================\n");
            }
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Log the email instead of failing
            System.out.println("\n========== EMAIL (Fallback) ==========");
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Body:\n" + body);
            System.out.println("======================================\n");
        }
    }
}
