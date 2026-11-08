package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.AdminService;
import java.util.List;

/** ADMIN: read own account; Create, Read, Update, Delete students. */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;


    @GetMapping("/getStudents")
    public List<StudentEntity> getAllStudents() {
        return adminService.getAllStudents();
    }

    @GetMapping("/getStudents/{studentId}")
    public StudentEntity getStudent(@PathVariable int studentId) {
        return adminService.getStudent(studentId);
    }

    @PostMapping("/postStudents")
    @ResponseStatus(HttpStatus.CREATED)
    public StudentEntity postStudent(@RequestBody StudentEntity body) {
        return adminService.postStudent(body);
    }

    @PutMapping("/putStudent/{studentId}")
    public StudentEntity putStudent(@PathVariable int studentId, @RequestBody StudentEntity body) {
        return adminService.putStudent(studentId, body);
    }

    @DeleteMapping("/deleteStudents/{studentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public StudentEntity deleteStudent(@PathVariable int studentId) {
       return  adminService.deleteStudent(studentId);
    }
}

