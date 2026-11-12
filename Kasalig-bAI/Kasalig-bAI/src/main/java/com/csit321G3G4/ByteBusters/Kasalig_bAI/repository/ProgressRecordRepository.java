package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.ProgressRecordEntity;

@Repository
public interface ProgressRecordRepository extends JpaRepository<ProgressRecordEntity, Integer> {

    List<ProgressRecordEntity> findByStudentStudentIdOrderByRecordedAtDescProgressIdDesc(Integer studentId);

    List<ProgressRecordEntity> findByStudentStudentIdAndTopicTopicIdOrderByRecordedAtDescProgressIdDesc(
            Integer studentId, Integer topicId);

    /** Oldest first, so a caller replaying the rows ends up holding the latest value per student and topic. */
    List<ProgressRecordEntity> findByTopicCourseCourseIdOrderByRecordedAtAscProgressIdAsc(Integer courseId);

    boolean existsByTopicTopicId(Integer topicId);
}
