package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.controller.AuthException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class StudentService {
    
    private static final List<String> COLLEGE_YEARS = List.of("1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year");

    @Autowired
    private StudentRepository srepo;

    @Autowired
    private PasswordEncoder encoder;
    // CREATE (sign up)
    public StudentEntity postStudent(StudentEntity student) {
        String email = normalize(student.getEmail());
        if(email.isEmpty() || isBlank(student.getPassword())) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Email and password cannot be empty.");
        }

        if (!email.matches("^[^@\\s]+@[^@\\s]+\\.edu(\\.[a-z]{2})?$")) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Please use your school email (e.g. student@school.edu or student@school.edu.ph).");
        }
        
        if (!COLLEGE_YEARS.contains(student.getGradeLevel())) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Sign-up is open to college students only. Please choose a year level from 1st to 5th Year.");
        }

        if (srepo.findByEmail(email) != null) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Email is already in use.");
        }
        student.setEmail(email);
        student.setPassword(encoder.encode(student.getPassword()));
        return srepo.save(student);
    }
    //LOGIN
    public StudentEntity login(String email, String password){
        StudentEntity student = srepo.findByEmail(normalize(email));
        if(student == null || !PasswordUtil.matches(encoder, password, student.getPassword())){
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        if(!PasswordUtil.isHashed(student.getPassword())){
            student.setPassword(encoder.encode(password));
            srepo.save(student);
        }
        return student;
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
        if(!isBlank(newDetails.getPassword())) {
            student.setPassword(encoder.encode(newDetails.getPassword()));
        }
        student.setGradeLevel(newDetails.getGradeLevel());
        student.setSchool(newDetails.getSchool());
        return srepo.save(student);
    }

    // DELETE
    public String deleteStudent(int studentId) {
        srepo.delete(getStudentById(studentId));
        return "Student with ID " + studentId + " has been successfully deleted.";
    }
       

    private static String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private static boolean isBlank(String str) {
        return str == null || str.isBlank();
    }
}