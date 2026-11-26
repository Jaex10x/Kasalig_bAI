package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginRequest;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginResponse;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.AdminService;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TokenService;
import java.util.List;

/** Login is open; everything else needs an admin login token (see SecurityConfig). */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private TokenService tokens;

    // Login: body is { email, password }. Answers { token, expiresAt, user }, or 401 when the
    // credentials are wrong. There is no admin sign-up; see AdminBootstrap.
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        return tokens.issue(adminService.login(req.email(), req.password()));
    }

    // ============================== TEACHERS ==============================//

    @GetMapping("/getTeachers")
    public List<TeacherEntity> getAllTeachers() {
        return adminService.getAllTeachers();
    }

    @GetMapping("/getTeachers/{teacherId}")
    public TeacherEntity getTeacher(@PathVariable int teacherId) {
        return adminService.getTeacher(teacherId);
    }

    @PostMapping("/postTeachers")
    @ResponseStatus(HttpStatus.CREATED)
    public TeacherEntity postTeacher(@AuthenticationPrincipal Jwt jwt, @RequestBody TeacherEntity body) {
        return adminService.postTeacher(body, Access.id(jwt));
    }

    @PutMapping("/putTeacher/{teacherId}")
    public TeacherEntity putTeacher(@PathVariable int teacherId, @RequestBody TeacherEntity body) {
        return adminService.putTeacher(teacherId, body);
    }

    @DeleteMapping("/deleteTeachers/{teacherId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeacher(@PathVariable int teacherId) {
        adminService.deleteTeacher(teacherId);
    }

    // ============================== STUDENTS ==============================

    @GetMapping("/getStudents")
    public List<StudentEntity> getAllStudents() {
        return adminService.getAllStudents();
    }

    @GetMapping("/getStudents/{studentId}")
    public StudentEntity getStudent(@PathVariable int studentId) {
        return adminService.getStudent(studentId);
    }

    @PostMapping("/postStudent")
    public StudentEntity postStudent(@RequestBody StudentEntity body) {
        return adminService.postStudent(body);
    }

    @PutMapping("/putStudent/{studentId}")
    public StudentEntity putStudent(@PathVariable int studentId, @RequestBody StudentEntity body) {
        return adminService.putStudent(studentId, body);
    }

    @DeleteMapping("/deleteStudents/{studentId}")
    public void deleteStudent(@PathVariable int studentId) {
        adminService.deleteStudent(studentId);
    }
}