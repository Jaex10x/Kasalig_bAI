package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties.Apiversion.Use;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** STUDENT: read her own account. Also holds the "create a login for a student" logic shared by admin and teacher. */
@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public StudentEntity getMyAccount(int studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + studentId + " not found"));
    }

    public StudentEntity save(StudentEntity student) {
        return studentRepository.save(student);
    }

}
