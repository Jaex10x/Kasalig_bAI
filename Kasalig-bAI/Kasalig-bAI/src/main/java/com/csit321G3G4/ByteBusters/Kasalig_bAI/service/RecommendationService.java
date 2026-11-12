package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.GapSeverity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.GapStatus;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.LearningGapEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.LearningResourceEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.RecommendationEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.RecommendationStatus;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.ResourceDifficulty;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.LearningGapRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.LearningResourceRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.RecommendationRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;

@Service
public class RecommendationService {

    /** Learning-path order: the most severe gap first, and within a gap the easiest resource first. */
    private static final Comparator<RecommendationEntity> LEARNING_PATH_ORDER = Comparator
            .comparing((RecommendationEntity r) -> r.getGap().getSeverity(), Comparator.reverseOrder())
            .thenComparing(r -> r.getResource().getDifficulty())
            .thenComparingInt(RecommendationEntity::getRecommendationId);

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private LearningResourceRepository resourceRepository;

    @Autowired
    private LearningGapRepository gapRepository;

    @Autowired
    private StudentRepository studentRepository;

    /**
     * Makes sure the gap recommends every resource of its topic that suits its current severity,
     * without duplicating or removing what was recommended before. If the topic has no resource at
     * a suitable difficulty, all of the topic's resources are recommended instead.
     *
     * @return all of the gap's recommendations, in learning-path order
     */
    public List<RecommendationEntity> refreshForGap(LearningGapEntity gap) {
        List<LearningResourceEntity> resources = resourceRepository.findByTopicTopicId(gap.getTopic().getTopicId());
        Set<ResourceDifficulty> suitable = difficultiesFor(gap.getSeverity());
        List<LearningResourceEntity> matching = resources.stream()
                .filter(resource -> suitable.contains(resource.getDifficulty()))
                .toList();
        LocalDateTime now = LocalDateTime.now();
        for (LearningResourceEntity resource : matching.isEmpty() ? resources : matching) {
            if (!recommendationRepository.existsByGapGapIdAndResourceResourceId(gap.getGapId(), resource.getResourceId())) {
                recommendationRepository.save(new RecommendationEntity(gap, resource, RecommendationStatus.PENDING, now));
            }
        }
        return inLearningPathOrder(recommendationRepository.findByGapGapId(gap.getGapId()));
    }

    /** The wider the gap, the easier the material: start from the basics and work up. */
    private static Set<ResourceDifficulty> difficultiesFor(GapSeverity severity) {
        return switch (severity) {
            case CRITICAL -> EnumSet.of(ResourceDifficulty.EASY);
            case MODERATE -> EnumSet.of(ResourceDifficulty.EASY, ResourceDifficulty.MEDIUM);
            case MILD -> EnumSet.of(ResourceDifficulty.MEDIUM, ResourceDifficulty.HARD);
        };
    }

    /** With activeOnly, returns just what the student still has to do: PENDING recommendations of OPEN gaps. */
    public List<RecommendationEntity> getStudentRecommendations(int studentId, boolean activeOnly) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + studentId + " not found");
        }
        return inLearningPathOrder(activeOnly
                ? recommendationRepository.findByGap_Student_StudentIdAndGap_StatusAndStatus(
                        studentId, GapStatus.OPEN, RecommendationStatus.PENDING)
                : recommendationRepository.findByGapStudentStudentId(studentId));
    }

    public List<RecommendationEntity> getGapRecommendations(int gapId) {
        if (!gapRepository.existsById(gapId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Gap " + gapId + " not found");
        }
        return inLearningPathOrder(recommendationRepository.findByGapGapId(gapId));
    }

    /** Marks a recommendation as COMPLETED, DISMISSED or back to PENDING. */
    public RecommendationEntity putRecommendationStatus(int recommendationId, RecommendationStatus status) {
        RecommendationEntity recommendation = recommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Recommendation " + recommendationId + " not found"));
        recommendation.setStatus(status);
        return recommendationRepository.save(recommendation);
    }

    private static List<RecommendationEntity> inLearningPathOrder(List<RecommendationEntity> recommendations) {
        return recommendations.stream().sorted(LEARNING_PATH_ORDER).toList();
    }
}
