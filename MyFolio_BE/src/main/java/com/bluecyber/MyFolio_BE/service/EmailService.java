package com.bluecyber.MyFolio_BE.service;

import com.bluecyber.MyFolio_BE.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendVerificationEmail(User user) {
        try {
            String token = UUID.randomUUID().toString();
            String verificationLink = "http://66.42.51.94:8080/api/auth/verify?token=" + token;

            // Save the token first
            user.setVerificationToken(token);
            user.setVerificationTokenExpiry(System.currentTimeMillis() + 3600000); // 1 hour
            userService.saveUser(user);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Verify your email");
            helper.setText(
                    "<html><body>" +
                            "<h2>Hello " + user.getName() + ",</h2>" +
                            "<p>Please click the link below to verify your email address:</p>" +
                            "<a href='" + verificationLink + "'>Verify Email</a>" +
                            "<p>This link will expire in 1 hour.</p>" +
                            "</body></html>",
                    true
            );

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    @Async
    public void sendPasswordResetEmail(User user) {
        try {
            String token = UUID.randomUUID().toString();
            String resetLink = "http://66.42.51.94/reset-password?token=" + token;

            // Save the token first
            user.setResetPasswordToken(token);
            user.setResetPasswordTokenExpiry(System.currentTimeMillis() + 3600000); // 1 hour
            userService.saveUser(user);

            log.info("Creating password reset email for user: {}", user.getEmail());

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Reset your password");
            
            // Improved HTML template with inline styles and proper button link
            String emailContent = String.format("""
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2d3748;">Hello %s,</h2>
                        <p>Please click the button below to reset your password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <table cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 4px; background-color: #6366F1;">
                                        <a href="%s" 
                                           target="_blank"
                                           style="padding: 12px 24px;
                                                  color: #ffffff;
                                                  text-decoration: none;
                                                  display: inline-block;
                                                  font-weight: bold;
                                                  font-size: 16px;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <p style="color: #666;">This link will expire in 1 hour.</p>
                        <p style="color: #666;">If you did not request this password reset, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="font-size: 12px; color: #999;">
                            This is an automated email, please do not reply.
                        </p>
                    </div>
                </body>
                </html>
                """, user.getName(), resetLink);

            helper.setText(emailContent, true);

            log.info("Attempting to send password reset email to: {}", user.getEmail());
            mailSender.send(message);
            log.info("Password reset email sent successfully to: {}", user.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send password reset email to {}: {}", user.getEmail(), e.getMessage());
            log.error("Stack trace:", e);
            throw new RuntimeException("Failed to send password reset email. Please check your email configuration.", e);
        } catch (Exception e) {
            log.error("Unexpected error while sending password reset email to {}: {}", user.getEmail(), e.getMessage());
            log.error("Stack trace:", e);
            throw new RuntimeException("An unexpected error occurred while processing your request", e);
        }
    }
} 