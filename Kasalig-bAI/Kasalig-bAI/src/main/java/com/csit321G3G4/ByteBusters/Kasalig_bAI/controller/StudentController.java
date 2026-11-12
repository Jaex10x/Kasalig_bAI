package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginRequest;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginResponse;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.StudentService;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TokenService;

/** Sign-up and login are open; everything else needs a login token (see SecurityConfig). */
@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService sserv;

    @Autowired
    private TokenService tokens;

    // Sign up: body is { fullName, email, course, password }. The frontend calls /postStudent.
    @PostMapping({"/register", "/postStudent"})
    @ResponseStatus(HttpStatus.CREATED)
    public StudentEntity postStudent(@RequestBody StudentEntity student) {
        return sserv.postStudent(student);
    }

    // Login: body is { email, password }. Answers { token, expiresAt, user }, or 401 when the
    // credentials are wrong.
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        return tokens.issue(sserv.login(req.email(), req.password()));
    }

    // Read all students (teachers and admins)
    @GetMapping("/getAllStudents")
    public List<StudentEntity> getAllStudents() {
        return sserv.getAllStudents();
    }

    // Read a specific student (teachers and admins)
    @GetMapping("/getStudent/{studentId}")
    public StudentEntity getStudent(@PathVariable int studentId) {
        return sserv.getStudentById(studentId);
    }

    // A student reads their own account
    @GetMapping("/{studentId}")
    public StudentEntity getMyAccount(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer studentId) {
        Access.requireSelf(jwt, "student", studentId);
        return sserv.getMyAccount(studentId);
    }

    // A student updates their own account
    @PutMapping("/updateStudent")
    public StudentEntity updateStudent(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam int studentId,
        @RequestBody StudentEntity newDetails) {
        Access.requireSelf(jwt, "student", studentId);
        return sserv.updateStudent(studentId, newDetails);
    }

    // A student deletes their own account
    @DeleteMapping("/deleteStudent/{studentId}")
    public String deleteStudent(@AuthenticationPrincipal Jwt jwt, @PathVariable int studentId) {
        Access.requireSelf(jwt, "student", studentId);
        return sserv.deleteStudent(studentId);
    }
}
