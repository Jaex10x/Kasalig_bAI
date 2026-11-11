package com.csit321G3G4.ByteBusters.Kasalig_bAI.dto;

import java.util.List;

/**
 * Request body for POST /api/result/submitAssessment: one student's attempt at one assessment.
 * items must hold a score for every item of the assessment (send 0 for a skipped question).
 */
public record AssessmentSubmission(Integer studentId, Integer assessmentId, List<ItemScore> items) {

    public record ItemScore(Integer itemId, Float score) {
    }
}
