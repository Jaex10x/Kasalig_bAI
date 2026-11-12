package com.csit321G3G4.ByteBusters.Kasalig_bAI.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.GapStatus;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.RecommendationEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.RecommendationStatus;

@Repository
public interface RecommendationRepository extends JpaRepository<RecommendationEntity, Integer> {

    List<RecommendationEntity> findByGapGapId(Integer gapId);

    List<RecommendationEntity> findByGapStudentStudentId(Integer studentId);

    /** Underscores separate the path gap.status from this entity's own status. */
    List<RecommendationEntity> findByGap_Student_StudentIdAndGap_StatusAndStatus(
            Integer studentId, GapStatus gapStatus, RecommendationStatus status);

    boolean existsByGapGapIdAndResourceResourceId(Integer gapId, Integer resourceId);
}
