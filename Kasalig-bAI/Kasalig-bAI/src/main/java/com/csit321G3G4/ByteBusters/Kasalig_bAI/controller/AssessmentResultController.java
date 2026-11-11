package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AssessmentSubmission;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.GapAnalysisReport;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AssessmentResultEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.AssessmentResultService;

@RestController
@RequestMapping("/api/result")
public class AssessmentResultController {

    @Autowired
    private AssessmentResultService resultService;

    /** Records a student's attempt and returns the gap analysis it produced. */
    @PostMapping("/submitAssessment")
    @ResponseStatus(HttpStatus.CREATED)
    public GapAnalysisReport submitAssessment(@RequestBody AssessmentSubmission body) {
        return resultService.submitAssessment(body);
    }

    @GetMapping("/getStudentResults/{studentId}")
    public List<AssessmentResultEntity> getStudentResults(@PathVariable int studentId,
                                                          @RequestParam(required = false) Integer assessmentId) {
        return resultService.getStudentResults(studentId, assessmentId);
    }

    @GetMapping("/getAssessmentResults/{assessmentId}")
    public List<AssessmentResultEntity> getAssessmentResults(@PathVariable int assessmentId) {
        return resultService.getAssessmentResults(assessmentId);
    }
}
