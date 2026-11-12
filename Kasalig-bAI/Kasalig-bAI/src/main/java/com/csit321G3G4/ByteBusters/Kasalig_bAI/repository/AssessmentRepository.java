package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AssessmentEntity;

@Repository
public interface AssessmentRepository extends JpaRepository<AssessmentEntity, Integer> {

    List<AssessmentEntity> findByCourseCourseId(Integer courseId);

    long countByCourseCourseId(Integer courseId);
}
