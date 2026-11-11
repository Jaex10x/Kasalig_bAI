package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.EnrollmentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.EnrollmentService;

@RestController
@RequestMapping("/api/enrollment")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping("/getCourseEnrollments/{courseId}")
    public List<EnrollmentEntity> getCourseEnrollments(@PathVariable int courseId) {
        return enrollmentService.getCourseEnrollments(courseId);
    }

    @GetMapping("/getStudentEnrollments/{studentId}")
    public List<EnrollmentEntity> getStudentEnrollments(@PathVariable int studentId) {
        return enrollmentService.getStudentEnrollments(studentId);
    }

    @PostMapping("/postEnrollment")
    @ResponseStatus(HttpStatus.CREATED)
    public EnrollmentEntity postEnrollment(@RequestBody EnrollmentEntity body) {
        return enrollmentService.postEnrollment(body);
    }

    @DeleteMapping("/deleteEnrollment/{enrollmentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEnrollment(@PathVariable int enrollmentId) {
        enrollmentService.deleteEnrollment(enrollmentId);
    }
}
