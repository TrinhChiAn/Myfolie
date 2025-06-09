package com.bluecyber.MyFolio_BE.service;

import com.bluecyber.MyFolio_BE.dto.UserProfileRequest;
import com.bluecyber.MyFolio_BE.dto.ChangePasswordRequest;
import com.bluecyber.MyFolio_BE.entity.User;
import com.bluecyber.MyFolio_BE.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String UPLOAD_DIRECTORY = "uploads/profile-images/";
    private final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif"};

    public User getCurrentUser() {
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User updateProfile(UserProfileRequest request) {
        var user = getCurrentUser();
        user.setName(request.getName());
        user.setJobTitle(request.getJobTitle());
        user.setBio(request.getBio());
        return userRepository.save(user);
    }

    public User deleteProfileImage() {
        try {
            var user = getCurrentUser();
            if (user.getProfileImage() != null) {
                Path filePath = Paths.get(UPLOAD_DIRECTORY, user.getProfileImage());
                Files.deleteIfExists(filePath);
                user.setProfileImage(null);
                return userRepository.save(user);
            }
            return user;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not delete file", e);
        }
    }

    public User updateProfileImage(MultipartFile file) {
        try {
            var user = getCurrentUser();

            // Handle file removal
            if (file == null || file.isEmpty()) {
                if (user.getProfileImage() != null) {
                    Path oldFilePath = Paths.get(UPLOAD_DIRECTORY, user.getProfileImage());
                    Files.deleteIfExists(oldFilePath);
                    user.setProfileImage(null);
                    return userRepository.save(user);
                }
                return user;
            }

            // Validate file size
            if (file.getSize() > MAX_FILE_SIZE) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File size must be less than 10MB");
            }

            // Validate file extension
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase() : "";
            if (!Arrays.asList(ALLOWED_EXTENSIONS).contains(extension)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only JPG, PNG and GIF files are allowed");
            }

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIRECTORY);
            if (!Files.exists(uploadPath)) {
                System.out.println("Creating directory: " + uploadPath.toAbsolutePath());
                Files.createDirectories(uploadPath);
            }

            // Delete old file if exists
            if (user.getProfileImage() != null) {
                Path oldFilePath = uploadPath.resolve(user.getProfileImage());
                System.out.println("Deleting old file: " + oldFilePath.toAbsolutePath());
                Files.deleteIfExists(oldFilePath);
            }

            // Generate unique filename and save file
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);
            System.out.println("Saving new file to: " + filePath.toAbsolutePath());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update user profile image path
            user.setProfileImage(filename);
            System.out.println("Updating user profile with image: " + filename);
            return userRepository.save(user);

        } catch (IOException e) {
            System.err.println("Error handling file upload: " + e.getMessage());
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store file", e);
        }
    }

    public void changePassword(ChangePasswordRequest request) {
        var user = getCurrentUser();

        // Validate current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        // Validate new password matches confirmation
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password and confirmation do not match");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
} 