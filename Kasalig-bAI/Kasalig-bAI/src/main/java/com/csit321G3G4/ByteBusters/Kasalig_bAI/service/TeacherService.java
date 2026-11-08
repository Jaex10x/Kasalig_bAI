package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TeacherRepository;

import java.util.List;

@Service
public class TeacherService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    public TeacherEntity getMyAccount(Integer teacherId) {
        return findTeacher(teacherId);
    }


    public List<StudentEntity> getMyStudents(int teacherId) {
        findTeacher(teacherId); 
        return studentRepository.findByTeacherTeacherId(teacherId);
    }

    public StudentEntity getMyStudent(Integer teacherId, Integer studentId) {
        return findMyStudent(teacherId, studentId);
    }


    public StudentEntity postStudent(int teacherId, StudentEntity body) {
        if (studentRepository.existsByEmailIgnoreCase(body.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        StudentEntity student = new StudentEntity(body.getFullName(), body.getEmail(), body.getYearLevel(),
                findTeacher(teacherId));
        return studentRepository.save(student);
    }


    
    public StudentEntity putStudent(int teacherId, int studentId, StudentEntity body) {
        StudentEntity student = findMyStudent(teacherId, studentId);
        if (!student.getEmail().equalsIgnoreCase(body.getEmail())
                && studentRepository.existsByEmailIgnoreCase(body.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        student.setFullName(body.getFullName());
        student.setEmail(body.getEmail());
        student.setYearLevel(body.getYearLevel());
        return studentRepository.save(student);
    }


    private TeacherEntity findTeacher(int teacherId) {
        return teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher " + teacherId + " not found"));
    }

    private StudentEntity findMyStudent(int teacherId, int studentId) {
        return studentRepository.findByStudentIdAndTeacherTeacherId(studentId, teacherId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + studentId + " not found"));
    }


    public TeacherEntity postTeacher(TeacherEntity body) {
    return teacherRepository.save(body);
}


    public List<StudentEntity> getAllStudents() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllStudents'");
    }
}

