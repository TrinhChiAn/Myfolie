package com.bluecyber.MyFolio_BE.service;

import com.bluecyber.MyFolio_BE.dto.ProjectRequest;
import com.bluecyber.MyFolio_BE.entity.Project;
import com.bluecyber.MyFolio_BE.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    public List<Project> getUserProjects(Long userId) {
        try {
            var user = userService.getUserById(userId);
            if (user == null) {
                return new ArrayList<>();
            }
            List<Project> projects = projectRepository.findByUser(user);
            return projects != null ? projects : new ArrayList<>();
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private void validateUrl(String url, String fieldName) {
        if (url != null && !url.isEmpty()) {
            try {
                new URL(url);
            } catch (MalformedURLException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    String.format("Invalid %s URL format", fieldName));
            }
        }
    }

    public Project addProject(ProjectRequest request) {
        validateUrl(request.getDemoUrl(), "demo");
        validateUrl(request.getRepositoryUrl(), "repository");

        var user = userService.getCurrentUser();
        
        var project = Project.builder()
                .name(request.getName())
                .demoUrl(request.getDemoUrl())
                .repositoryUrl(request.getRepositoryUrl())
                .description(request.getDescription())
                .user(user)
                .build();
        
        return projectRepository.save(project);
    }

    public Project updateProject(Long projectId, ProjectRequest request) {
        validateUrl(request.getDemoUrl(), "demo");
        validateUrl(request.getRepositoryUrl(), "repository");

        var project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        
        var currentUser = userService.getCurrentUser();
        if (!project.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                "You don't have permission to update this project");
        }
        
        project.setName(request.getName());
        project.setDemoUrl(request.getDemoUrl());
        project.setRepositoryUrl(request.getRepositoryUrl());
        project.setDescription(request.getDescription());
        
        return projectRepository.save(project);
    }

    public void deleteProject(Long projectId) {
        var project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        
        var currentUser = userService.getCurrentUser();
        if (!project.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                "You don't have permission to delete this project");
        }
        
        projectRepository.delete(project);
    }
} 