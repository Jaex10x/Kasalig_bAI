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
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TeacherService;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TokenService;

/** Sign-up and login are open; everything else needs a login token (see SecurityConfig). */
@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private TeacherService tserv;

    @Autowired
    private TokenService tokens;

    //=====Teacher account========
    // Sign up: body is { fullName, email, password }
    @PostMapping({"/register", "/postTeacher"})
    @ResponseStatus(HttpStatus.CREATED)
    public TeacherEntity postTeacher(@RequestBody TeacherEntity teacher) {
        return tserv.postTeacher(teacher);
    }

    // Login: body is { email, password }. Answers { token, expiresAt, user }, or 401 when the
    // credentials are wrong.
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        return tokens.issue(tserv.login(req.email(), req.password()));
    }

    @GetMapping("/getAllTeachers")
    public List<TeacherEntity> getAllTeachers() {
        return tserv.getAllTeachers();
    }

    @GetMapping("/getTeacher/{teacherId}")
    public TeacherEntity getTeacher(@PathVariable int teacherId) {
        return tserv.getTeacherById(teacherId);
    }

    // A teacher reads their own account
    @GetMapping("/{teacherId}")
    public TeacherEntity getMyAccount(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer teacherId) {
        Access.requireSelf(jwt, "teacher", teacherId);
        return tserv.getMyAccount(teacherId);
    }

    @PutMapping("/updateTeacher")
    public TeacherEntity updateTeacher(@AuthenticationPrincipal Jwt jwt, @RequestParam int teacherId,
                                       @RequestBody TeacherEntity newDetails) {
        Access.requireSelf(jwt, "teacher", teacherId);
        return tserv.updateTeacher(teacherId, newDetails);
    }

    @DeleteMapping("/deleteTeacher/{teacherId}")
    public String deleteTeacher(@AuthenticationPrincipal Jwt jwt, @PathVariable int teacherId) {
        Access.requireSelf(jwt, "teacher", teacherId);
        return tserv.deleteTeacher(teacherId);
    }

    //========Teachers manage their students' accounts====
    // teacherId must be the signed-in teacher's own id (admins may pass any).
    // Without teacherId: every student. With ?teacherId=: only that teacher's students.
    @GetMapping("/getAllStudents")
    public List<StudentEntity> getAllStudents(@AuthenticationPrincipal Jwt jwt,
                                              @RequestParam(required = false) Integer teacherId) {
        if (teacherId == null) {
            return tserv.getAllStudents();
        }
        Access.requireSelf(jwt, "teacher", teacherId);
        return tserv.getMyStudents(teacherId);
    }

    @GetMapping("/getStudents/{studentId}")
    public StudentEntity getMyStudent(@AuthenticationPrincipal Jwt jwt, @RequestParam int teacherId,
                                      @PathVariable Integer studentId) {
        Access.requireSelf(jwt, "teacher", teacherId);
        return tserv.getMyStudent(teacherId, studentId);
    }

    @PostMapping("/postStudents")
    public StudentEntity postStudent(@AuthenticationPrincipal Jwt jwt, @RequestParam int teacherId,
                                     @RequestBody StudentEntity body) {
        Access.requireSelf(jwt, "teacher", teacherId);
        return tserv.postStudent(teacherId, body);
    }

    @PutMapping("/putStudent/{studentId}")
    public StudentEntity putStudent(@AuthenticationPrincipal Jwt jwt, @RequestParam int teacherId,
                                    @PathVariable int studentId, @RequestBody StudentEntity body) {
        Access.requireSelf(jwt, "teacher", teacherId);
        return tserv.putStudent(teacherId, studentId, body);
    }
}
