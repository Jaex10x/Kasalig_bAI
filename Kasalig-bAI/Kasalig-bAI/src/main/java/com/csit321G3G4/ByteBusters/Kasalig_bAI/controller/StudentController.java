package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.StudentService;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService sserv;

    @PostMapping("/api/student/postStudent")
    public StudentEntity postStudent(@RequestBody StudentEntity student) {
        return sserv.postStudent(student);
    }
    //readAllStudents
    @GetMapping("/api/student/getAllStudents")
    public List<StudentEntity> getAllStudents() {
        return sserv.getAllStudents();
    }
    // //read specific students
    // @GetMapping("/api/student/getStudent/{id}")
    // public StudentEntity getStudent(@PathVariable int studentID) {
    //     return sserv.getStudentById(id);
    // }

    @PutMapping("/api/student/updateStudent")
    public StudentEntity updateStudent(@RequestParam int studentId, @RequestBody StudentEntity newDetails) {
        return sserv.updateStudent(studentId, newDetails);
    }

    @DeleteMapping("/api/student/deleteStudent/{studentId}")
    public String deleteStudent(@PathVariable int studentId) {
        return sserv.deleteStudent(studentId);
    }
}