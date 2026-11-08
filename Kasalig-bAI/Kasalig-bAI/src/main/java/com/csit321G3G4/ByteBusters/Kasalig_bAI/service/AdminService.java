package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AdminEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AdminRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TeacherRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    public AdminEntity getAdmin(int adminId) {
        return adminRepository.findById(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin " + adminId + " not found"));
    }

    public List<StudentEntity> getAllStudents() {
        return studentRepository.findAll();
    }

    public StudentEntity getStudent(int studentId) {
        return findStudent(studentId);
    }

    
    public StudentEntity postStudent(StudentEntity body) {
        if (studentRepository.existsByEmailIgnoreCase(body.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        StudentEntity student = new StudentEntity(
                body.getFullName(), 
                body.getEmail(), 
                body.getYearLevel(),
                findTeacher(body.getTeacher())
        );
        return studentRepository.save(student);
    }

    
    @Transactional
    public StudentEntity putStudent(int id, StudentEntity body) {
        StudentEntity student = findStudent(id);
        if (!student.getEmail().equalsIgnoreCase(body.getEmail())
                && studentRepository.existsByEmailIgnoreCase(body.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        student.setFullName(body.getFullName());
        student.setEmail(body.getEmail());
        student.setYearLevel(body.getYearLevel());
        if (body.getTeacher() != null) {
            student.setTeacher(findTeacher(body.getTeacher())); 
        }
        return studentRepository.save(student);
    }

    
    public StudentEntity deleteStudent(int studentId) {
        StudentEntity student = findStudent(studentId);
        studentRepository.delete(student);
        return student;
    }

    
    private StudentEntity findStudent(int id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + id + " not found"));
    }

    private TeacherEntity findTeacher(TeacherEntity ref) {
        return teacherRepository.findById(ref.getTeacherId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Teacher " + ref.getTeacherId() + " does not exist"));
    }

    public AdminEntity getMyAccount(String name) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getMyAccount'");
    }
}
