package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginRequest;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.StudentService;

@RestController
@RequestMapping("/api/student") 
public class StudentController {

    @Autowired
    private StudentService sserv;

    //Sign up: POST/api/student/postStudent
    @PostMapping({"/register", "/postStudent"})
    @ResponseStatus(HttpStatus.CREATED)
    public StudentEntity postStudent(@RequestBody StudentEntity student) {
         return sserv.postStudent(student);
    }

    //Login:
    @PostMapping("/login")
    public StudentEntity login(@RequestBody LoginRequest req){
        return sserv.login(req.email(), req.password());
    }

    //readAllStudents
    @GetMapping("/getAllStudents")
    public List<StudentEntity> getAllStudents() {
        return sserv.getAllStudents();
    }

    //read specific students
    @GetMapping("/getStudent/{studentId}")
    public StudentEntity getStudent(@PathVariable int studentId) {
        return sserv.getStudentById(studentId);
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