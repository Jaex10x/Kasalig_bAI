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

    //======= Teachers =========//

    public List<TeacherEntity> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public TeacherEntity getTeacher(int teacherId) {
        return findTeacherById(teacherId);                       
    }

    public TeacherEntity postTeacher(TeacherEntity body) {
        if (teacherRepository.existsByEmailIgnoreCase(body.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        TeacherEntity teacher = new TeacherEntity(body.getFullName(), body.getEmail());
        return teacherRepository.save(teacher);
    }

    @Transactional
    public TeacherEntity putTeacher(int teacherId, TeacherEntity body) {
        TeacherEntity teacher = findTeacherById(teacherId);     
        if (!teacher.getEmail().equalsIgnoreCase(body.getEmail())
                && teacherRepository.existsByEmailIgnoreCase(body.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        teacher.setFullName(body.getFullName());
        teacher.setEmail(body.getEmail());
        return teacherRepository.save(teacher);
    }

    public TeacherEntity deleteTeacher(int teacherId) {
        TeacherEntity teacher = findTeacherById(teacherId);      
        long students = studentRepository.countByTeacherTeacherId(teacherId);
        if (students > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Teacher still has " + students + " student(s). Move or delete them first.");
        }
        teacherRepository.delete(teacher);
        return teacher;
    }

    //======== Students =========//

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

    //======== Helpers =========//

    private StudentEntity findStudent(int id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + id + " not found"));
    }

    
    private TeacherEntity findTeacherById(int teacherId) {      
        return teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher " + teacherId + " not found"));
    }

    
    private TeacherEntity findTeacher(TeacherEntity ref) {
        if (ref == null) {                                       
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "teacher.teacherId is required");
        }
        return teacherRepository.findById(ref.getTeacherId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Teacher " + ref.getTeacherId() + " does not exist"));
    }
}

