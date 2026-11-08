package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TeacherService;

import java.security.Principal;
import java.util.List;

/** TEACHER: read own account; Create, Read, Update her own students. */
@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;


    @PostMapping("/postTeacher")
    public TeacherEntity postTeacher(@RequestBody TeacherEntity body) {
        return teacherService.postTeacher(body);
    }
    @GetMapping
    public TeacherEntity getMyAccount(@PathVariable Integer teacherId) {
        return teacherService.getMyAccount(teacherId);
    }

    @GetMapping("/getStudents")
    public List<StudentEntity> getMyStudents(@PathVariable Integer teacherId) {
        return teacherService.getMyStudents(teacherId);
    }

    @GetMapping("/students/{studentId}")
    public StudentEntity getMyStudent(@PathVariable Integer teacherId, @PathVariable Integer studentId) {
        return teacherService.getMyStudent(teacherId, studentId);
    }

    @PostMapping("/postStudents")
    public StudentEntity posttudent(@PathVariable int teacherId, @RequestBody StudentEntity body) {
        return teacherService.postStudent(teacherId, body);
    }

    @PutMapping("/putStudents/{studentId}")
    public StudentEntity putStudent(@PathVariable Integer teacherId, @PathVariable Integer studentId,
                                        @RequestBody StudentEntity body) {
        return teacherService.putStudent(teacherId, studentId, body);
    }
}

