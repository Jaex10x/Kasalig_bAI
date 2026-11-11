package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AssessmentItemEntity;

@Repository
public interface AssessmentItemRepository extends JpaRepository<AssessmentItemEntity, Integer> {

    List<AssessmentItemEntity> findByAssessmentAssessmentId(Integer assessmentId);

    boolean existsByTopicTopicId(Integer topicId);
}
