package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.controller.AuthException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TeacherRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository trepo;

    @Autowired
    private PasswordEncoder encoder;

    //CREATE (sign up)
    public TeacherEntity postTeacher(TeacherEntity teacher) {
        String email = normalize(teacher.getEmail());
        if(email.isEmpty() || isBlank(teacher.getPassword())) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Email and password cannot be empty.");
        }
        if (trepo.findByEmail(email) != null) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Email is already in use.");
        }
        teacher.setEmail(email);
        teacher.setPassword(encoder.encode(teacher.getPassword()));
        return trepo.save(teacher);
    }

    //LOGIN
    public TeacherEntity login(String email, String password){
        TeacherEntity teacher = trepo.findByEmail(normalize(email));
        if(teacher == null || !PasswordUtil.matches(encoder, password, teacher.getPassword())){
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        if(!PasswordUtil.isHashed(teacher.getPassword())){
            teacher.setPassword(encoder.encode(teacher.getPassword()));
            trepo.save(teacher);
        }
        return teacher;

    }

    //READ ALL
    public List<TeacherEntity> getAllTeachers() {
        return trepo.findAll();
    }

    //READ ONE
    public TeacherEntity getTeacherById(int id) {
        return trepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Teacher " + id + " does not exist."));
    }

    //UPDATE
    public TeacherEntity updateTeacher(int teacherId, TeacherEntity newDetails) {
         TeacherEntity teacher = trepo.findById(teacherId).orElseThrow(() -> new EntityNotFoundException("Teacher does not exist!"));
        teacher.setFirstName(newDetails.getFirstName());
        teacher.setLastName(newDetails.getLastName());
        teacher.setEmail(newDetails.getEmail());
        if(!isBlank(newDetails.getPassword())) {
            teacher.setPassword(encoder.encode(newDetails.getPassword()));
        }
        teacher.setDepartment(newDetails.getDepartment());
        teacher.setSchool(newDetails.getSchool());
        return trepo.save(teacher);
    }


    //DELETE
    public String deleteTeacher(int id) {
        if (!trepo.existsById(id)) {
            throw new NoSuchElementException("Teacher " + id + " does not exist.");
        }
        trepo.delete(getTeacherById(id));
        return "Teacher with ID " + id + " has been successfully deleted.";
    }

    private static String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private static boolean isBlank(String str) {
        return str == null || str.isBlank();
    }
}