package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.AdminService;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

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
    public TeacherEntity postTeacher(@RequestBody TeacherEntity body) {
        return adminService.postTeacher(body);
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