package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.CourseService;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.CourseService.Caller;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.CourseService.CourseRequest;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.CourseService.CourseView;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.CourseService.EnrolledStudent;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TokenService;

/**
 * The courses a teacher handles and the students enrolled in them (teachers and admins only; see
 * SecurityConfig). A teacher can only manage their own courses.
 *
 *   GET    /api/courses                                   my courses (admins: all)
 *   POST   /api/courses                                   { title, section?, gradeLevel? }
 *   PUT    /api/courses/{id}
 *   DELETE /api/courses/{id}
 *   GET    /api/courses/{id}/students                     enrolled students
 *   POST   /api/courses/{id}/enrollments                  { identifier }: enroll an existing account
 *   POST   /api/courses/{id}/students                     { fullName, email, program, password }: new account + enroll
 *   DELETE /api/courses/{id}/students/{studentId}         remove from the course
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public List<CourseView> listCourses(@AuthenticationPrincipal Jwt jwt) {
        return courseService.listCourses(caller(jwt));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseView createCourse(@AuthenticationPrincipal Jwt jwt, @RequestBody CourseRequest body) {
        return courseService.createCourse(body, caller(jwt));
    }

    @PutMapping("/{courseId}")
    public CourseView updateCourse(@AuthenticationPrincipal Jwt jwt, @PathVariable int courseId,
            @RequestBody CourseRequest body) {
        return courseService.updateCourse(courseId, body, caller(jwt));
    }

    @DeleteMapping("/{courseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@AuthenticationPrincipal Jwt jwt, @PathVariable int courseId) {
        courseService.deleteCourse(courseId, caller(jwt));
    }

    @GetMapping("/{courseId}/students")
    public List<EnrolledStudent> listStudents(@AuthenticationPrincipal Jwt jwt, @PathVariable int courseId) {
        return courseService.listStudents(courseId, caller(jwt));
    }

    @PostMapping("/{courseId}/enrollments")
    @ResponseStatus(HttpStatus.CREATED)
    public EnrolledStudent enrollExisting(@AuthenticationPrincipal Jwt jwt, @PathVariable int courseId,
            @RequestBody Map<String, String> body) {
        return courseService.enrollExisting(courseId, body == null ? null : body.get("identifier"), caller(jwt));
    }

    @PostMapping("/{courseId}/students")
    @ResponseStatus(HttpStatus.CREATED)
    public EnrolledStudent createAndEnroll(@AuthenticationPrincipal Jwt jwt, @PathVariable int courseId,
            @RequestBody StudentEntity body) {
        return courseService.createAndEnroll(courseId, body, caller(jwt));
    }

    @DeleteMapping("/{courseId}/students/{studentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unenroll(@AuthenticationPrincipal Jwt jwt, @PathVariable int courseId, @PathVariable int studentId) {
        courseService.unenroll(courseId, studentId, caller(jwt));
    }

    static Caller caller(Jwt jwt) {
        return new Caller(jwt.getClaimAsString(TokenService.ROLES_CLAIM).toLowerCase(Locale.ROOT), Access.id(jwt));
    }
}
