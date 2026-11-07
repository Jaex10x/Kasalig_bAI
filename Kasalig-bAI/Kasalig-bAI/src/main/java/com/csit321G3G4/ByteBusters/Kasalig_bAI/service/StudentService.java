package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class StudentService {

    @Autowired
    private StudentRepository srepo;

    // CREATE
    public StudentEntity postStudent(StudentEntity student) {
        return srepo.save(student);
    }

    // READ ALL
    public List<StudentEntity> getAllStudents() {
        return srepo.findAll();
    }

    // READ ONE
    public StudentEntity getStudentById(int id) {
        return srepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Student " + id + " does not exist."));
    }

    // UPDATE
    public StudentEntity updateStudent(int studentID, StudentEntity newDetails) {
        StudentEntity student = srepo.findById(studentID).orElseThrow(() -> new EntityNotFoundException("Student does not exist!"));
        student.setFirstName(newDetails.getFirstName());
        student.setLastName(newDetails.getLastName());
        student.setEmail(newDetails.getEmail());
        student.setPassword(newDetails.getPassword());
        student.setGradeLevel(newDetails.getGradeLevel());
        student.setSchool(newDetails.getSchool());
        return srepo.save(student);
    }

    // DELETE
    public String deleteStudent(int studentId) {
       
       StudentEntity student = srepo.findById(studentId).orElseThrow(()-> new EntityNotFoundException("Student does not exist!"));

       srepo.delete(student);


       return "Student does not found or exist!";
    }
}