package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AuthUser;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginRequest;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.StudentService;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService sserv;

    // Sign up: body is { fullName, email, course, password }. The frontend calls /postStudent.
    @PostMapping({"/register", "/postStudent"})
    @ResponseStatus(HttpStatus.CREATED)
    public StudentEntity postStudent(@RequestBody StudentEntity student) {
        return sserv.postStudent(student);
    }

    // Login: body is { email, password }. Answers 401 when the credentials are wrong.
    @PostMapping("/login")
    public AuthUser login(@RequestBody LoginRequest req) {
        return sserv.login(req.email(), req.password());
    }

    // Read all students
    @GetMapping("/getAllStudents")
    public List<StudentEntity> getAllStudents() {
        return sserv.getAllStudents();
    }

    // Read a specific student
    @GetMapping("/getStudent/{studentId}")
    public StudentEntity getStudent(@PathVariable int studentId) {
        return sserv.getStudentById(studentId);
    }

    // A student reads their own account
    @GetMapping("/{studentId}")
    public StudentEntity getMyAccount(@PathVariable Integer studentId) {
        return sserv.getMyAccount(studentId);
    }

    @PutMapping("/updateStudent")
    public StudentEntity updateStudent(
        @RequestParam int studentId,
        @RequestBody StudentEntity newDetails) {
        return sserv.updateStudent(studentId, newDetails);
    }

    @DeleteMapping("/deleteStudent/{studentId}")
    public String deleteStudent(@PathVariable int studentId) {
        return sserv.deleteStudent(studentId);
    }
}
