package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AuthUser;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginRequest;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TeacherService;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private TeacherService tserv;

    //=====Teacher account========
    // Sign up: body is { fullName, email, password }
    @PostMapping({"/register", "/postTeacher"})
    @ResponseStatus(HttpStatus.CREATED)
    public TeacherEntity postTeacher(@RequestBody TeacherEntity teacher) {
        return tserv.postTeacher(teacher);
    }

    // Login: body is { email, password }. Answers 401 when the credentials are wrong.
    @PostMapping("/login")
    public AuthUser login(@RequestBody LoginRequest req) {
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

    @GetMapping("/{teacherId}")
    public TeacherEntity getMyAccount(@PathVariable Integer teacherId) {
        return tserv.getMyAccount(teacherId);
    }

    @PutMapping("/updateTeacher")
    public TeacherEntity updateTeacher(@RequestParam int teacherId, @RequestBody TeacherEntity newDetails) {
        return tserv.updateTeacher(teacherId, newDetails);
    }

    @DeleteMapping("/deleteTeacher/{teacherId}")
    public String deleteTeacher(@PathVariable int teacherId) {
        return tserv.deleteTeacher(teacherId);
    }

    //========Teachers manage their students' accounts====
    // Without teacherId: every student. With ?teacherId=: only that teacher's students.
    @GetMapping("/getAllStudents")
    public List<StudentEntity> getAllStudents(@RequestParam(required = false) Integer teacherId) {
        return teacherId == null ? tserv.getAllStudents() : tserv.getMyStudents(teacherId);
    }

    @GetMapping("/getStudents/{studentId}")
    public StudentEntity getMyStudent(@RequestParam int teacherId, @PathVariable Integer studentId) {
        return tserv.getMyStudent(teacherId, studentId);
    }

    @PostMapping("/postStudents")
    public StudentEntity postStudent(@RequestParam int teacherId, @RequestBody StudentEntity body) {
        return tserv.postStudent(teacherId, body);
    }

    @PutMapping("/putStudent/{studentId}")
    public StudentEntity putStudent(@RequestParam int teacherId, @PathVariable int studentId,
                                    @RequestBody StudentEntity body) {
        return tserv.putStudent(teacherId, studentId, body);
    }
}
