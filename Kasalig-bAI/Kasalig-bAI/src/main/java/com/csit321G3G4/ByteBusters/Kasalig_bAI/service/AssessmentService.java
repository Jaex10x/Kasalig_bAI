package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AssessmentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CourseEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AssessmentItemRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AssessmentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AssessmentResultRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.CourseRepository;

@Service
public class AssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private AssessmentItemRepository itemRepository;

    @Autowired
    private AssessmentResultRepository resultRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<AssessmentEntity> getAssessments(Integer courseId) {
        return courseId == null ? assessmentRepository.findAll() : assessmentRepository.findByCourseCourseId(courseId);
    }

    public AssessmentEntity getAssessment(int assessmentId) {
        return assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment " + assessmentId + " not found"));
    }

    public AssessmentEntity postAssessment(AssessmentEntity body) {
        AssessmentEntity assessment = new AssessmentEntity(
                Require.text(body.getTitle(), "title"),
                body.getHeldOn(),
                findCourse(body.getCourse()));
        return assessmentRepository.save(assessment);
    }

    /** Updates the title and date. An assessment stays in the course it was created in. */
    public AssessmentEntity putAssessment(int assessmentId, AssessmentEntity body) {
        AssessmentEntity assessment = getAssessment(assessmentId);
        assessment.setTitle(Require.text(body.getTitle(), "title"));
        if (body.getHeldOn() != null) {
            assessment.setHeldOn(body.getHeldOn());
        }
        return assessmentRepository.save(assessment);
    }

    /** Deletes the assessment together with its items, unless a student has already taken it. */
    @Transactional
    public void deleteAssessment(int assessmentId) {
        AssessmentEntity assessment = getAssessment(assessmentId);
        if (resultRepository.existsByItemAssessmentAssessmentId(assessmentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Assessment already has student results and cannot be deleted.");
        }
        itemRepository.deleteAll(itemRepository.findByAssessmentAssessmentId(assessmentId));
        assessmentRepository.delete(assessment);
    }

    private CourseEntity findCourse(CourseEntity ref) {
        Require.present(ref, "course.courseId");
        return courseRepository.findById(ref.getCourseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Course " + ref.getCourseId() + " does not exist"));
    }
}
