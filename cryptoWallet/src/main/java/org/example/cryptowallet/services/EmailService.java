package org.example.cryptowallet.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendAssignmentEmail(String user, String detail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("tarabesh.akim@gmail.com");
        message.setTo("akim.tarabesh@gmail.com");
        message.setSubject("Подтверждение");
        message.setText(String.format(
                "Тут %s Текст \n\nОтлично %s",
                user, detail
        ));

        mailSender.send(message);
    }
}
