package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AssessmentSubmission;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AssessmentSubmission.ItemScore;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.GapAnalysisReport;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.GapAnalysisReport.RecommendedResource;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.GapAnalysisReport.TopicResult;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AssessmentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AssessmentItemEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AssessmentResultEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.GapStatus;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.LearningGapEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.RecommendationEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TopicEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AssessmentItemRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AssessmentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AssessmentResultRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.EnrollmentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;

@Service
public class AssessmentResultService {

    @Autowired
    private AssessmentResultRepository resultRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private AssessmentItemRepository itemRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private ProgressRecordService progressRecordService;

    @Autowired
    private LearningGapService learningGapService;

    @Autowired
    private RecommendationService recommendationService;

    /**
     * Records one attempt and analyzes it. For each topic the assessment covers, the student's
     * mastery is the points earned over the points possible on that topic in this attempt. That
     * mastery is saved as a progress record, opens, updates or closes the student's learning gap
     * on the topic, and refreshes the recommendations of a gap that is still open.
     */
    @Transactional
    public GapAnalysisReport submitAssessment(AssessmentSubmission body) {
        int studentId = Require.present(body.studentId(), "studentId");
        int assessmentId = Require.present(body.assessmentId(), "assessmentId");
        StudentEntity student = findStudent(studentId);
        AssessmentEntity assessment = findAssessment(assessmentId);
        if (!enrollmentRepository.existsByStudentStudentIdAndCourseCourseId(studentId,
                assessment.getCourse().getCourseId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Student " + studentId + " is not enrolled in this assessment's course");
        }
        List<AssessmentItemEntity> items = itemRepository.findByAssessmentAssessmentId(assessmentId);
        if (items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Assessment " + assessmentId + " has no items yet");
        }
        Map<Integer, Float> scores = readScores(body.items(), items, assessmentId);
        LocalDateTime takenAt = LocalDateTime.now();

        Map<Integer, TopicTally> tallies = new LinkedHashMap<>();
        for (AssessmentItemEntity item : items) {
            float score = scores.get(item.getItemId());
            resultRepository.save(new AssessmentResultEntity(student, item, score, takenAt));
            tallies.computeIfAbsent(item.getTopic().getTopicId(), id -> new TopicTally(item.getTopic()))
                    .add(score, item.getMaxScore());
        }

        float totalScore = 0;
        float maxScore = 0;
        List<TopicResult> topics = new ArrayList<>();
        for (TopicTally tally : tallies.values()) {
            totalScore += tally.score;
            maxScore += tally.maxScore;
            float mastery = percent(tally.score, tally.maxScore);
            progressRecordService.record(student, tally.topic, mastery, takenAt);
            LearningGapEntity gap = learningGapService.evaluate(student, tally.topic, mastery, takenAt);

            List<RecommendedResource> recommendations = List.of();
            if (gap != null && gap.getStatus() == GapStatus.OPEN) {
                recommendations = recommendationService.refreshForGap(gap).stream()
                        .map(AssessmentResultService::toRecommendedResource)
                        .toList();
            }
            topics.add(new TopicResult(
                    tally.topic.getTopicId(),
                    tally.topic.getTitle(),
                    tally.score,
                    tally.maxScore,
                    mastery,
                    gap == null ? null : gap.getGapId(),
                    gap == null ? null : gap.getSeverity(),
                    gap == null ? null : gap.getStatus(),
                    recommendations));
        }
        return new GapAnalysisReport(studentId, assessmentId, takenAt, totalScore, maxScore,
                percent(totalScore, maxScore), topics);
    }

    /** Newest attempt first. Pass an assessmentId to see only that assessment's results. */
    public List<AssessmentResultEntity> getStudentResults(int studentId, Integer assessmentId) {
        findStudent(studentId);
        if (assessmentId == null) {
            return resultRepository.findByStudentStudentIdOrderByTakenAtDescResultIdAsc(studentId);
        }
        return resultRepository.findByStudentStudentIdAndItemAssessmentAssessmentIdOrderByTakenAtDescResultIdAsc(
                studentId, assessmentId);
    }

    public List<AssessmentResultEntity> getAssessmentResults(int assessmentId) {
        findAssessment(assessmentId);
        return resultRepository.findByItemAssessmentAssessmentIdOrderByTakenAtDescResultIdAsc(assessmentId);
    }

    /** Checks the submitted scores against the assessment's items and returns them keyed by item id. */
    private Map<Integer, Float> readScores(List<ItemScore> submitted, List<AssessmentItemEntity> items, int assessmentId) {
        if (submitted == null || submitted.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "items is required");
        }
        Map<Integer, AssessmentItemEntity> itemsById = new HashMap<>();
        for (AssessmentItemEntity item : items) {
            itemsById.put(item.getItemId(), item);
        }
        Map<Integer, Float> scores = new HashMap<>();
        for (ItemScore entry : submitted) {
            int itemId = Require.present(Require.present(entry, "items entry").itemId(), "items.itemId");
            float score = Require.present(entry.score(), "items.score");
            AssessmentItemEntity item = itemsById.get(itemId);
            if (item == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Item " + itemId + " does not belong to assessment " + assessmentId);
            }
            if (!(score >= 0 && score <= item.getMaxScore())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Score for item " + itemId + " must be between 0 and " + item.getMaxScore());
            }
            if (scores.put(itemId, score) != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item " + itemId + " is scored more than once");
            }
        }
        List<Integer> missing = itemsById.keySet().stream().filter(id -> !scores.containsKey(id)).sorted().toList();
        if (!missing.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing a score for item(s) " + missing);
        }
        return scores;
    }

    /** Percentage from 0 to 100, rounded to two decimals. */
    private static float percent(float score, float maxScore) {
        return Math.round(score / maxScore * 10000f) / 100f;
    }

    private static RecommendedResource toRecommendedResource(RecommendationEntity recommendation) {
        return new RecommendedResource(
                recommendation.getRecommendationId(),
                recommendation.getStatus(),
                recommendation.getResource().getResourceId(),
                recommendation.getResource().getTitle(),
                recommendation.getResource().getType(),
                recommendation.getResource().getUrl(),
                recommendation.getResource().getDifficulty());
    }

    private StudentEntity findStudent(int studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + studentId + " not found"));
    }

    private AssessmentEntity findAssessment(int assessmentId) {
        return assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment " + assessmentId + " not found"));
    }

    /** Running total of one topic's points within an attempt. */
    private static final class TopicTally {
        private final TopicEntity topic;
        private float score;
        private float maxScore;

        private TopicTally(TopicEntity topic) {
            this.topic = topic;
        }

        private void add(float score, float maxScore) {
            this.score += score;
            this.maxScore += maxScore;
        }
    }
}
