package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TeacherService;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private TeacherService tserv;

    @PostMapping("/api/teacher/postTeacher")
    public TeacherEntity postTeacher(@RequestBody TeacherEntity teacher) {
        return tserv.postTeacher(teacher);
    }

    @GetMapping("/api/teacher/getAllTeachers")
    public List<TeacherEntity> getAllTeachers() {
        return tserv.getAllTeachers();
    }

    // @GetMapping("/getTeacher/{id}")
    // public TeacherEntity getTeacher(@PathVariable int id) {
    //     return tserv.getTeacherById(id);
    // }

    @PutMapping("/api/teacher/updateTeacher")
    public TeacherEntity updateTeacher(@RequestParam int teacherId, @RequestBody TeacherEntity newDetails) {
        return tserv.updateTeacher(teacherId, newDetails);
    }

    @DeleteMapping("/api/teacher/deleteTeacher/{teacherId}")
    public String deleteTeacher(@PathVariable int teacherId) {
        return tserv.deleteTeacher(teacherId);
    }
}