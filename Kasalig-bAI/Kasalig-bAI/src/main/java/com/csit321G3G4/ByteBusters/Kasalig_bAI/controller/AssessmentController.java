package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AssessmentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.AssessmentService;

@RestController
@RequestMapping("/api/assessment")
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    @GetMapping("/getAssessments")
    public List<AssessmentEntity> getAssessments(@RequestParam(required = false) Integer courseId) {
        return assessmentService.getAssessments(courseId);
    }

    @GetMapping("/getAssessment/{assessmentId}")
    public AssessmentEntity getAssessment(@PathVariable int assessmentId) {
        return assessmentService.getAssessment(assessmentId);
    }

    @PostMapping("/postAssessment")
    @ResponseStatus(HttpStatus.CREATED)
    public AssessmentEntity postAssessment(@RequestBody AssessmentEntity body) {
        return assessmentService.postAssessment(body);
    }

    @PutMapping("/putAssessment/{assessmentId}")
    public AssessmentEntity putAssessment(@PathVariable int assessmentId, @RequestBody AssessmentEntity body) {
        return assessmentService.putAssessment(assessmentId, body);
    }

    @DeleteMapping("/deleteAssessment/{assessmentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAssessment(@PathVariable int assessmentId) {
        assessmentService.deleteAssessment(assessmentId);
    }
}
