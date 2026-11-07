package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Integer> {
    StudentEntity findByEmail(String email);
}