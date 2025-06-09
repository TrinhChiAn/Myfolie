package com.bluecyber.MyFolio_BE.controller;

import com.bluecyber.MyFolio_BE.dto.ProjectRequest;
import com.bluecyber.MyFolio_BE.dto.UserProfileRequest;
import com.bluecyber.MyFolio_BE.dto.ChangePasswordRequest;
import com.bluecyber.MyFolio_BE.entity.Project;
import com.bluecyber.MyFolio_BE.entity.User;
import com.bluecyber.MyFolio_BE.service.ProjectService;
import com.bluecyber.MyFolio_BE.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ProjectService projectService;

    @GetMapping("/me/id")
    public ResponseEntity<Map<String, Long>> getCurrentUserId() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(Map.of("id", currentUser.getId()));
    }

    @GetMapping("/profile/me")
    public ResponseEntity<User> getCurrentUserProfile() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody @Valid UserProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PostMapping("/profile/image")
    public ResponseEntity<User> updateProfileImage(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(userService.updateProfileImage(file));
    }

    @DeleteMapping("/profile/image")
    public ResponseEntity<User> deleteProfileImage() {
        return ResponseEntity.ok(userService.deleteProfileImage());
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/projects/me")
    public ResponseEntity<List<Project>> getCurrentUserProjects() {
        try {
            User currentUser = userService.getCurrentUser();
            List<Project> projects = projectService.getUserProjects(currentUser.getId());
            return ResponseEntity.ok(projects != null ? projects : new ArrayList<>());
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            // Return empty list instead of error to maintain consistent response type
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/projects/{userId}")
    public ResponseEntity<List<Project>> getUserProjects(@PathVariable Long userId) {
        return ResponseEntity.ok(projectService.getUserProjects(userId));
    }

    @PostMapping("/projects")
    public ResponseEntity<Project> addProject(@RequestBody @Valid ProjectRequest request) {
        return ResponseEntity.ok(projectService.addProject(request));
    }

    @PutMapping("/projects/{projectId}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long projectId,
            @RequestBody @Valid ProjectRequest request
    ) {
        return ResponseEntity.ok(projectService.updateProject(projectId, request));
    }

    @DeleteMapping("/projects/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.ok().build();
    }
} 