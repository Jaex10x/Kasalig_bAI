package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.RecommendationEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.RecommendationStatus;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.RecommendationService;

/** Recommendations are created by the analysis that runs when an assessment is submitted. */
@RestController
@RequestMapping("/api/recommendation")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/getStudentRecommendations/{studentId}")
    public List<RecommendationEntity> getStudentRecommendations(@PathVariable int studentId,
                                                                @RequestParam(defaultValue = "false") boolean activeOnly) {
        return recommendationService.getStudentRecommendations(studentId, activeOnly);
    }

    @GetMapping("/getGapRecommendations/{gapId}")
    public List<RecommendationEntity> getGapRecommendations(@PathVariable int gapId) {
        return recommendationService.getGapRecommendations(gapId);
    }

    @PutMapping("/putRecommendationStatus/{recommendationId}")
    public RecommendationEntity putRecommendationStatus(@PathVariable int recommendationId,
                                                        @RequestParam RecommendationStatus status) {
        return recommendationService.putRecommendationStatus(recommendationId, status);
    }
}
