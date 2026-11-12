package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.GapStatus;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.LearningGapEntity;

@Repository
public interface LearningGapRepository extends JpaRepository<LearningGapEntity, Integer> {

    List<LearningGapEntity> findByStudentStudentIdOrderByDetectedAtDesc(Integer studentId);

    List<LearningGapEntity> findByStudentStudentIdAndStatusOrderByDetectedAtDesc(Integer studentId, GapStatus status);

    List<LearningGapEntity> findByTopicCourseCourseIdOrderByDetectedAtDesc(Integer courseId);

    List<LearningGapEntity> findByTopicCourseCourseIdAndStatusOrderByDetectedAtDesc(Integer courseId, GapStatus status);

    Optional<LearningGapEntity> findFirstByStudentStudentIdAndTopicTopicIdAndStatusOrderByDetectedAtDesc(
            Integer studentId, Integer topicId, GapStatus status);

    boolean existsByTopicTopicId(Integer topicId);
}
