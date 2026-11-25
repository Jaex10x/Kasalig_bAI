package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentLearningStateEntity;

@Repository
public interface StudentLearningStateRepository extends JpaRepository<StudentLearningStateEntity, Integer> {
}
