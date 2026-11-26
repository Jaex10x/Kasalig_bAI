package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.CourseService;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.CourseService.OfferedCourse;

/**
 * Student self-enrollment (students only; see SecurityConfig). A student always acts for
 * themselves: the student id comes from their login token, never from the request.
 *
 *   GET    /api/enroll/courses        open courses + the ones I am in, each with "enrolled"
 *   POST   /api/enroll/courses/{id}   enroll myself (the course must be open for self-enrollment)
 *   DELETE /api/enroll/courses/{id}   drop the course
 */
@RestController
@RequestMapping("/api/enroll")
public class StudentCourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/courses")
    public List<OfferedCourse> offered(@AuthenticationPrincipal Jwt jwt) {
        return courseService.offeredTo(Access.id(jwt));
    }

    @PostMapping("/courses/{courseId}")
    @ResponseStatus(HttpStatus.CREATED)
    public OfferedCourse enroll(@AuthenticationPrincipal Jwt jwt, @PathVariable int courseId) {
        return courseService.selfEnroll(courseId, Access.id(jwt));
    }

    @DeleteMapping("/courses/{courseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void drop(@AuthenticationPrincipal Jwt jwt, @PathVariable int courseId) {
        courseService.selfDrop(courseId, Access.id(jwt));
    }
}
