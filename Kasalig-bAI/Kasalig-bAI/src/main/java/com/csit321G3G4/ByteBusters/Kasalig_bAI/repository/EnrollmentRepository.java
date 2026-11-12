package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.EnrollmentEntity;

@Repository
public interface EnrollmentRepository extends JpaRepository<EnrollmentEntity, Integer> {

    List<EnrollmentEntity> findByCourseCourseId(Integer courseId);

    List<EnrollmentEntity> findByStudentStudentId(Integer studentId);

    boolean existsByStudentStudentIdAndCourseCourseId(Integer studentId, Integer courseId);

    long countByCourseCourseId(Integer courseId);
}
