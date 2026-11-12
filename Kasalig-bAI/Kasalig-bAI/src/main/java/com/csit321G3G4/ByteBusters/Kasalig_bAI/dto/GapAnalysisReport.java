package com.csit321G3G4.ByteBusters.Kasalig_bAI.dto;

import java.time.LocalDateTime;
import java.util.List;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.GapSeverity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.GapStatus;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.RecommendationStatus;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.ResourceDifficulty;

/** What a submitted assessment produced: the overall score plus a breakdown per topic. */
public record GapAnalysisReport(
        int studentId,
        int assessmentId,
        LocalDateTime takenAt,
        float totalScore,
        float maxScore,
        float percentage,
        List<TopicResult> topics) {

    /**
     * gapId, severity and gapStatus are null when the student has no gap on the topic. A gapStatus
     * of CLOSED means this attempt closed a gap that was open before it. recommendations is the
     * learning path for an open gap, easiest resource first, and empty otherwise.
     */
    public record TopicResult(
            int topicId,
            String topicTitle,
            float score,
            float maxScore,
            float masteryLevel,
            Integer gapId,
            GapSeverity severity,
            GapStatus gapStatus,
            List<RecommendedResource> recommendations) {
    }

    public record RecommendedResource(
            int recommendationId,
            RecommendationStatus status,
            int resourceId,
            String title,
            String type,
            String url,
            ResourceDifficulty difficulty) {
    }
}
