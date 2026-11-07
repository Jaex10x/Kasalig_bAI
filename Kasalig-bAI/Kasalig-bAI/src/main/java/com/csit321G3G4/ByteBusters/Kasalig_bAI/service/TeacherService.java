package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TeacherRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository trepo;

    public TeacherEntity postTeacher(TeacherEntity teacher) {
        return trepo.save(teacher);
    }

    public List<TeacherEntity> getAllTeachers() {
        return trepo.findAll();
    }

    public TeacherEntity getTeacherById(int id) {
        return trepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Teacher " + id + " does not exist."));
    }

    public TeacherEntity updateTeacher(int teacherId, TeacherEntity newDetails) {
         TeacherEntity teacher = trepo.findById(teacherId).orElseThrow(() -> new EntityNotFoundException("Teacher does not exist!"));
        teacher.setFirstName(newDetails.getFirstName());
        teacher.setLastName(newDetails.getLastName());
        teacher.setEmail(newDetails.getEmail());
        teacher.setPassword(newDetails.getPassword());
        teacher.setDepartment(newDetails.getDepartment());
        teacher.setSchool(newDetails.getSchool());
        return trepo.save(teacher);
    }

    public String deleteTeacher(int id) {
        if (!trepo.existsById(id)) {
            throw new NoSuchElementException("Teacher " + id + " does not exist.");
        }
        trepo.deleteById(id);
        return "Teacher with ID " + id + " has been successfully deleted.";
    }
}