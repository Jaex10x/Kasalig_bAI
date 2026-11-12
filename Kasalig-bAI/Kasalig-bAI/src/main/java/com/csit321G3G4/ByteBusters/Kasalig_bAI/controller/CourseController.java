package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CourseEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.CourseService;

@RestController
@RequestMapping("/api/course")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/getCourses")
    public List<CourseEntity> getCourses(@RequestParam(required = false) Integer teacherId) {
        return courseService.getCourses(teacherId);
    }

    @GetMapping("/getCourse/{courseId}")
    public CourseEntity getCourse(@PathVariable int courseId) {
        return courseService.getCourse(courseId);
    }

    @PostMapping("/postCourse")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseEntity postCourse(@RequestBody CourseEntity body) {
        return courseService.postCourse(body);
    }

    @PutMapping("/putCourse/{courseId}")
    public CourseEntity putCourse(@PathVariable int courseId, @RequestBody CourseEntity body) {
        return courseService.putCourse(courseId, body);
    }

    @DeleteMapping("/deleteCourse/{courseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable int courseId) {
        courseService.deleteCourse(courseId);
    }
}
