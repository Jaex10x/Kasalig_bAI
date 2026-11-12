package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.CourseHeatmap;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.ProgressRecordEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.ProgressRecordService;

/** Read-only: progress records are written by the analysis that runs when an assessment is submitted. */
@RestController
@RequestMapping("/api/progress")
public class ProgressRecordController {

    @Autowired
    private ProgressRecordService progressService;

    @GetMapping("/getStudentProgress/{studentId}")
    public List<ProgressRecordEntity> getStudentProgress(@PathVariable int studentId,
                                                         @RequestParam(required = false) Integer topicId) {
        return progressService.getStudentProgress(studentId, topicId);
    }

    @GetMapping("/getStudentMastery/{studentId}")
    public List<ProgressRecordEntity> getStudentMastery(@PathVariable int studentId) {
        return progressService.getStudentMastery(studentId);
    }

    @GetMapping("/getCourseHeatmap/{courseId}")
    public CourseHeatmap getCourseHeatmap(@PathVariable int courseId) {
        return progressService.getCourseHeatmap(courseId);
    }
}
