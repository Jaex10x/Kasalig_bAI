package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AtRiskStudent;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.GapStatus;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.LearningGapEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.LearningGapService;

/** Gaps are opened, updated and closed by the analysis that runs when an assessment is submitted. */
@RestController
@RequestMapping("/api/gap")
public class LearningGapController {

    @Autowired
    private LearningGapService gapService;

    @GetMapping("/getStudentGaps/{studentId}")
    public List<LearningGapEntity> getStudentGaps(@PathVariable int studentId,
                                                  @RequestParam(required = false) GapStatus status) {
        return gapService.getStudentGaps(studentId, status);
    }

    @GetMapping("/getCourseGaps/{courseId}")
    public List<LearningGapEntity> getCourseGaps(@PathVariable int courseId,
                                                 @RequestParam(required = false) GapStatus status) {
        return gapService.getCourseGaps(courseId, status);
    }

    @GetMapping("/getGap/{gapId}")
    public LearningGapEntity getGap(@PathVariable int gapId) {
        return gapService.getGap(gapId);
    }

    @PutMapping("/putGapStatus/{gapId}")
    public LearningGapEntity putGapStatus(@PathVariable int gapId, @RequestParam GapStatus status) {
        return gapService.putGapStatus(gapId, status);
    }

    @GetMapping("/getAtRiskStudents/{courseId}")
    public List<AtRiskStudent> getAtRiskStudents(@PathVariable int courseId) {
        return gapService.getAtRiskStudents(courseId);
    }
}
