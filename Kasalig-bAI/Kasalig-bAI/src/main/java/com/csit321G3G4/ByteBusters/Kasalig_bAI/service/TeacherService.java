package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.controller.AuthException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AuthUser;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TeacherRepository;

/** TEACHER: sign up, log in, account CRUD, and managing their own students. */
@Service
public class TeacherService {

    @Autowired
    private TeacherRepository trepo;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordHasher passwordHasher;

    //CREATE (sign up)
    // Always creates a new account from the name, email and password in the request. Anything else
    // in the body, such as an id or an admin, is ignored, so this cannot overwrite an existing account.
    public TeacherEntity postTeacher(TeacherEntity body) {
        String fullName = body.getFullName() == null ? "" : body.getFullName().trim();
        String email = normalize(body.getEmail());
        if (fullName.isEmpty() || email.isEmpty() || isBlank(body.getPassword())) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Full name, email and password cannot be empty.");
        }
        if (!Require.isEmail(email)) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Enter a valid email address.");
        }
        if (trepo.existsByEmailIgnoreCase(email)) {
            throw new AuthException(HttpStatus.CONFLICT, "Email is already in use.");
        }
        TeacherEntity teacher = new TeacherEntity(fullName, email);
        teacher.setPasswordHash(passwordHasher.hash(body.getPassword()));
        return trepo.save(teacher);
    }

    //LOGIN: every failure gets the same answer, so the response never reveals whether the account exists.
    public AuthUser login(String email, String password) {
        TeacherEntity teacher = trepo.findFirstByEmailIgnoreCaseOrderByTeacherIdAsc(normalize(email)).orElse(null);
        if (teacher == null || !passwordHasher.matches(password, teacher.getPasswordHash())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        return new AuthUser(teacher.getTeacherId(), "teacher", teacher.getFullName(), teacher.getEmail(), null);
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

    public TeacherEntity getMyAccount(Integer teacherId) {
        return getTeacherById(teacherId);
    }

    //UPDATE
    public TeacherEntity updateTeacher(int teacherId, TeacherEntity newDetails) {
        TeacherEntity teacher = getTeacherById(teacherId);
        String email = normalize(newDetails.getEmail());
        if (email.isEmpty()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Email cannot be empty.");
        }
        if (!email.equalsIgnoreCase(teacher.getEmail()) && trepo.existsByEmailIgnoreCase(email)) {
            throw new AuthException(HttpStatus.CONFLICT, "Email is already in use.");
        }
        teacher.setFullName(newDetails.getFullName());
        teacher.setEmail(email);
        if (!isBlank(newDetails.getPassword())) {
            teacher.setPasswordHash(passwordHasher.hash(newDetails.getPassword()));
        }
        return trepo.save(teacher);
    }

    //DELETE
    public String deleteTeacher(int id) {
        trepo.delete(getTeacherById(id));
        return "Teacher with ID " + id + " has been successfully deleted.";
    }

    //========Teachers manage their students' accounts====
    public List<StudentEntity> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<StudentEntity> getMyStudents(int teacherId) {
        getTeacherById(teacherId);
        return studentRepository.findByTeacherTeacherId(teacherId);
    }

    public StudentEntity getMyStudent(Integer teacherId, Integer studentId) {
        return findMyStudent(teacherId, studentId);
    }

    public StudentEntity postStudent(int teacherId, StudentEntity body) {
        if (studentRepository.existsByEmailIgnoreCase(body.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        StudentEntity student = new StudentEntity(body.getFullName(), normalize(body.getEmail()),
                body.getYearLevel(), getTeacherById(teacherId));
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
        student.setEmail(normalize(body.getEmail()));
        student.setYearLevel(body.getYearLevel());
        return studentRepository.save(student);
    }

    private StudentEntity findMyStudent(int teacherId, int studentId) {
        return studentRepository.findByStudentIdAndTeacherTeacherId(studentId, teacherId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + studentId + " not found"));
    }

    private static String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private static boolean isBlank(String str) {
        return str == null || str.isBlank();
    }
}
