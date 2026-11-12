package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AuthUser;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginRequest;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TeacherService;
import java.util.List;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    //=====Teacher creates own account========
    @PostMapping("/postTeacher")
    public TeacherEntity postTeacher(@RequestBody TeacherEntity body) {
        return teacherService.postTeacher(body);
    }

    /** Body is { email, password }. Answers 401 when the credentials are wrong. */
    @PostMapping("/login")
    public AuthUser login(@RequestBody LoginRequest request) {
        return teacherService.login(request);
    }

    @GetMapping("/{teacherId}")
    public TeacherEntity getMyAccount(@PathVariable Integer teacherId) {
        return teacherService.getMyAccount(teacherId);
    }
    //========Teachers manages students account====
    @GetMapping("/getAllStudents")
    public List<StudentEntity> getAllStudents() {
        return teacherService.getAllStudents();
    }

    @GetMapping("/getStudents/{studentId}")
    public StudentEntity getMyStudent(@PathVariable int teacherId, @PathVariable Integer studentId) {
        return teacherService.getMyStudent(teacherId, studentId);
    }

    @PostMapping("/postStudents")
    public StudentEntity posttudent(@RequestParam  int teacherId, @RequestBody StudentEntity body) {
        return teacherService.postStudent(teacherId, body);
    }

    @PutMapping("/putStudent/{studentId}")
    public StudentEntity putStudent(@RequestParam int teacherId, @RequestParam  int studentId,
                                        @RequestBody StudentEntity body) {
        return teacherService.putStudent(teacherId, studentId, body);
    }
}

