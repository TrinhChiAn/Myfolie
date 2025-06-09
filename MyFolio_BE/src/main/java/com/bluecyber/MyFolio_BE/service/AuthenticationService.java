package com.bluecyber.MyFolio_BE.service;

import com.bluecyber.MyFolio_BE.dto.AuthenticationRequest;
import com.bluecyber.MyFolio_BE.dto.AuthenticationResponse;
import com.bluecyber.MyFolio_BE.dto.RegisterRequest;
import com.bluecyber.MyFolio_BE.entity.User;
import com.bluecyber.MyFolio_BE.exception.EmailAlreadyExistsException;
import com.bluecyber.MyFolio_BE.exception.InvalidTokenException;
import com.bluecyber.MyFolio_BE.exception.ResourceNotFoundException;
import com.bluecyber.MyFolio_BE.repository.UserRepository;
import com.bluecyber.MyFolio_BE.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        
        repository.save(user);
        
        // Try to send verification email, but don't fail registration if it fails
        try {
            emailService.sendVerificationEmail(user);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", user.getEmail(), e.getMessage());
        }
        
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public void initiatePasswordReset(String email) {
        try {
            var user = repository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
            
            try {
                emailService.sendPasswordResetEmail(user);
            } catch (Exception e) {
                log.error("Failed to send password reset email to {}: {}", email, e.getMessage());
                throw new RuntimeException("Failed to send password reset email. Please check your email configuration.", e);
            }
        } catch (ResourceNotFoundException e) {
            // Log the error but return success to prevent email enumeration
            log.warn("Password reset requested for non-existent email: {}", email);
            // We still return normally to prevent email enumeration attacks
        }
    }

    public void resetPassword(String token, String newPassword) {
        User user = repository.findByResetPasswordToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired token"));

        if (user.getResetPasswordTokenExpiry() < System.currentTimeMillis()) {
            throw new InvalidTokenException("Token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        repository.save(user);
    }
} 