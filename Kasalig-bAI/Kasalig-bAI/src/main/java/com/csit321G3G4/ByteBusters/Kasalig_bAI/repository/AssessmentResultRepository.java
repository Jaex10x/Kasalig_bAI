package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AssessmentResultEntity;

@Repository
public interface AssessmentResultRepository extends JpaRepository<AssessmentResultEntity, Integer> {

    List<AssessmentResultEntity> findByStudentStudentIdOrderByTakenAtDescResultIdAsc(Integer studentId);

    List<AssessmentResultEntity> findByStudentStudentIdAndItemAssessmentAssessmentIdOrderByTakenAtDescResultIdAsc(
            Integer studentId, Integer assessmentId);

    List<AssessmentResultEntity> findByItemAssessmentAssessmentIdOrderByTakenAtDescResultIdAsc(Integer assessmentId);

    boolean existsByItemItemId(Integer itemId);

    boolean existsByItemAssessmentAssessmentId(Integer assessmentId);
}
