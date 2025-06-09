package com.bluecyber.MyFolio_BE.repository;

import com.bluecyber.MyFolio_BE.entity.Project;
import com.bluecyber.MyFolio_BE.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUser(User user);
    List<Project> findByUserId(Long userId);
} 