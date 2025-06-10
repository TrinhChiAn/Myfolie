package com.bluecyber.MyFolio_BE.controller;

import com.bluecyber.MyFolio_BE.dto.AuthenticationRequest;
import com.bluecyber.MyFolio_BE.dto.AuthenticationResponse;
import com.bluecyber.MyFolio_BE.dto.RegisterRequest;
import com.bluecyber.MyFolio_BE.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService service;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody @Valid RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody @Valid AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
            }
            
            service.initiatePasswordReset(email.trim());
            return ResponseEntity.ok()
                .body(Map.of("message", "If an account exists with this email, you will receive password reset instructions."));
        } catch (Exception e) {
            log.error("Error in forgot password: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to process password reset request. Please try again later."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token is required");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password is required");
        }
        
        service.resetPassword(token.trim(), newPassword);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            service.verifyEmail(token.trim());
            return ResponseEntity.ok()
                .body(Map.of("message", "Email verified successfully"));
        } catch (Exception e) {
            log.error("Error in email verification: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
} 