package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginRequest;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TeacherService;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private TeacherService tserv;

    @PostMapping({"/register", "/postTeacher"})
    @ResponseStatus(HttpStatus.CREATED)
    public TeacherEntity postTeacher(@RequestBody TeacherEntity teacher) {
        return tserv.postTeacher(teacher);
    }

    @PostMapping("/login")
    public TeacherEntity login(@RequestBody LoginRequest req){
        return tserv.login(req.email(), req.password());
    }

    @GetMapping("/getAllTeachers")
    public List<TeacherEntity> getAllTeachers() {
        return tserv.getAllTeachers();
    }

    @GetMapping("/getTeacher/{teacherId}")
    public TeacherEntity getTeacher(@PathVariable int teacherId) {
        return tserv.getTeacherById(teacherId);
    }

    @PutMapping("/updateTeacher")
    public TeacherEntity updateTeacher(@RequestParam int teacherId, @RequestBody TeacherEntity newDetails) {
        return tserv.updateTeacher(teacherId, newDetails);
    }

    @DeleteMapping("/deleteTeacher/{teacherId}")
    public String deleteTeacher(@PathVariable int teacherId) {
        return tserv.deleteTeacher(teacherId);
    }
}