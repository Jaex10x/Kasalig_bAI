package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AtRiskStudent;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.GapSeverity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.GapStatus;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.LearningGapEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TopicEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.CourseRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.EnrollmentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.LearningGapRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;

@Service
public class LearningGapService {

    /** Mastery (0-100) at or above this is a pass: no gap is opened, and an open gap is closed. */
    public static final float PASSING_MASTERY = 75f;

    /** Mastery below passing but at or above this is a MILD gap. */
    public static final float MILD_FLOOR = 60f;

    /** Mastery below MILD_FLOOR but at or above this is a MODERATE gap. Anything lower is CRITICAL. */
    public static final float MODERATE_FLOOR = 40f;

    /** A student is at risk with any CRITICAL open gap, or with this many open gaps of any severity. */
    public static final int AT_RISK_OPEN_GAPS = 3;

    @Autowired
    private LearningGapRepository gapRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    /**
     * Applies a new mastery reading to the student's gap on a topic. Below passing, the open gap
     * gets the new severity, or a new gap is opened. At or above passing, an open gap is closed.
     *
     * @return the gap that was opened, updated or closed, or null if the student has no gap on the topic
     */
    public LearningGapEntity evaluate(StudentEntity student, TopicEntity topic, float masteryLevel, LocalDateTime when) {
        Optional<LearningGapEntity> open = gapRepository.findFirstByStudentStudentIdAndTopicTopicIdAndStatusOrderByDetectedAtDesc(
                student.getStudentId(), topic.getTopicId(), GapStatus.OPEN);
        GapSeverity severity = severityFor(masteryLevel);
        if (severity == null) {
            if (open.isEmpty()) {
                return null;
            }
            open.get().setStatus(GapStatus.CLOSED);
            return gapRepository.save(open.get());
        }
        LearningGapEntity gap = open.orElseGet(() -> new LearningGapEntity(student, topic, severity, GapStatus.OPEN, when));
        gap.setSeverity(severity);
        return gapRepository.save(gap);
    }

    /** The severity a mastery level maps to, or null when the mastery is a pass. */
    static GapSeverity severityFor(float masteryLevel) {
        if (masteryLevel >= PASSING_MASTERY) {
            return null;
        }
        if (masteryLevel >= MILD_FLOOR) {
            return GapSeverity.MILD;
        }
        if (masteryLevel >= MODERATE_FLOOR) {
            return GapSeverity.MODERATE;
        }
        return GapSeverity.CRITICAL;
    }

    /** Newest first. Pass a status to see only OPEN or only CLOSED gaps. */
    public List<LearningGapEntity> getStudentGaps(int studentId, GapStatus status) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + studentId + " not found");
        }
        return status == null
                ? gapRepository.findByStudentStudentIdOrderByDetectedAtDesc(studentId)
                : gapRepository.findByStudentStudentIdAndStatusOrderByDetectedAtDesc(studentId, status);
    }

    /** Every gap on the course's topics, newest first. Pass a status to see only OPEN or only CLOSED gaps. */
    public List<LearningGapEntity> getCourseGaps(int courseId, GapStatus status) {
        requireCourse(courseId);
        return status == null
                ? gapRepository.findByTopicCourseCourseIdOrderByDetectedAtDesc(courseId)
                : gapRepository.findByTopicCourseCourseIdAndStatusOrderByDetectedAtDesc(courseId, status);
    }

    public LearningGapEntity getGap(int gapId) {
        return gapRepository.findById(gapId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gap " + gapId + " not found"));
    }

    /** Lets a teacher close or reopen a gap by hand. A student has at most one open gap per topic. */
    public LearningGapEntity putGapStatus(int gapId, GapStatus status) {
        LearningGapEntity gap = getGap(gapId);
        if (status == GapStatus.OPEN && gap.getStatus() != GapStatus.OPEN
                && gapRepository.findFirstByStudentStudentIdAndTopicTopicIdAndStatusOrderByDetectedAtDesc(
                        gap.getStudent().getStudentId(), gap.getTopic().getTopicId(), GapStatus.OPEN).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Student already has an open gap on this topic");
        }
        gap.setStatus(status);
        return gapRepository.save(gap);
    }

    /** Enrolled students who are falling behind in the course, worst first. */
    public List<AtRiskStudent> getAtRiskStudents(int courseId) {
        requireCourse(courseId);
        Set<Integer> enrolled = enrollmentRepository.findByCourseCourseId(courseId).stream()
                .map(enrollment -> enrollment.getStudent().getStudentId())
                .collect(Collectors.toSet());
        Map<Integer, List<LearningGapEntity>> openGapsByStudent = gapRepository
                .findByTopicCourseCourseIdAndStatusOrderByDetectedAtDesc(courseId, GapStatus.OPEN).stream()
                .filter(gap -> enrolled.contains(gap.getStudent().getStudentId()))
                .collect(Collectors.groupingBy(gap -> gap.getStudent().getStudentId(), LinkedHashMap::new, Collectors.toList()));

        List<AtRiskStudent> atRisk = new ArrayList<>();
        for (List<LearningGapEntity> gaps : openGapsByStudent.values()) {
            int critical = count(gaps, GapSeverity.CRITICAL);
            if (critical > 0 || gaps.size() >= AT_RISK_OPEN_GAPS) {
                StudentEntity student = gaps.get(0).getStudent();
                atRisk.add(new AtRiskStudent(student.getStudentId(), student.getFullName(), gaps.size(), critical,
                        count(gaps, GapSeverity.MODERATE), count(gaps, GapSeverity.MILD)));
            }
        }
        atRisk.sort(Comparator.comparingInt(AtRiskStudent::criticalGaps)
                .thenComparingInt(AtRiskStudent::openGaps)
                .reversed());
        return atRisk;
    }

    private static int count(List<LearningGapEntity> gaps, GapSeverity severity) {
        return (int) gaps.stream().filter(gap -> gap.getSeverity() == severity).count();
    }

    private void requireCourse(int courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course " + courseId + " not found");
        }
    }
}
