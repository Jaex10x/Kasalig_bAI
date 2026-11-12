package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AuthUser;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginRequest;
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

    @Autowired
    private PasswordHasher passwordHasher;

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
        student.setPasswordHash(passwordHasher.hashIfProvided(body.getPassword()));
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


    /**
     * Teacher sign-up. Always creates a new account from the name, email and password in the
     * request. Anything else in the body, such as an id or an admin, is ignored, so this endpoint
     * cannot be used to overwrite an existing account.
     */
    public TeacherEntity postTeacher(TeacherEntity body) {
        String fullName = Require.text(body.getFullName(), "fullName");
        String email = Require.text(body.getEmail(), "email");
        if (!Require.isEmail(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid email address.");
        }
        if (teacherRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with that email already exists.");
        }
        TeacherEntity teacher = new TeacherEntity(fullName, email);
        teacher.setPasswordHash(passwordHasher.hash(body.getPassword()));
        return teacherRepository.save(teacher);
    }

    /**
     * Checks a teacher's email and password. Every failure gets the same answer, so the response
     * never reveals whether the account exists.
     */
    public AuthUser login(LoginRequest request) {
        TeacherEntity teacher = request.email() == null ? null
                : teacherRepository.findFirstByEmailIgnoreCaseOrderByTeacherIdAsc(request.email().trim()).orElse(null);
        if (teacher == null || !passwordHasher.matches(request.password(), teacher.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect email or password.");
        }
        return new AuthUser(teacher.getTeacherId(), "teacher", teacher.getFullName(), teacher.getEmail(), null);
    }


    public List<StudentEntity> getAllStudents() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllStudents'");
    }
}

