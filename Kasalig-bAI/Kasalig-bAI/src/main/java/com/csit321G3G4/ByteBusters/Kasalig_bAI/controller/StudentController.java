package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AuthUser;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginRequest;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.StudentService;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;


    /** Sign-up: body is { fullName, email, course, password }. */
    @PostMapping("/postStudent")
    public StudentEntity postStudentEntity(@RequestBody StudentEntity student) {
        return studentService.register(student);
    }

    /** Body is { email, password }. Answers 401 when the credentials are wrong. */
    @PostMapping("/login")
    public AuthUser login(@RequestBody LoginRequest request) {
        return studentService.login(request);
    }

    @GetMapping("/{studentId}")
    public StudentEntity getMyAccount(@PathVariable Integer studentId) {
        return studentService.getMyAccount(studentId);
    }
}

