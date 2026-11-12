package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.controller.AuthException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AuthUser;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;

/** STUDENT: sign up, log in, and account CRUD. */
@Service
public class StudentService {

    /** Same rule as STUDENT_ID_PATTERN in the frontend's authApi.js, e.g. 2024-01530. */
    private static final Pattern STUDENT_ID = Pattern.compile("^\\d{2,4}-\\d{3,6}(-\\d{1,4})?$");

    @Autowired
    private StudentRepository srepo;

    @Autowired
    private PasswordHasher passwordHasher;

    // CREATE (sign up)
    // Always creates a new account from the request. Anything else in the body, such as an id or
    // a teacher, is ignored, so this endpoint cannot be used to overwrite an existing account.
    public StudentEntity postStudent(StudentEntity body) {
        String fullName = body.getFullName() == null ? "" : body.getFullName().trim();
        String email = normalize(body.getEmail());
        if (fullName.isEmpty() || email.isEmpty() || isBlank(body.getPassword())) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Full name, email and password cannot be empty.");
        }
        if (!Require.isEmail(email) && !STUDENT_ID.matcher(email).matches()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Enter a valid email or student ID.");
        }
        if (srepo.existsByEmailIgnoreCase(email)) {
            throw new AuthException(HttpStatus.CONFLICT, "An account with that email or student ID already exists.");
        }
        StudentEntity student = new StudentEntity(fullName, email, body.getYearLevel(), null);
        student.setCourse(isBlank(body.getCourse()) ? null : body.getCourse().trim());
        student.setPasswordHash(passwordHasher.hash(body.getPassword()));
        return srepo.save(student);
    }

    // LOGIN: every failure gets the same answer, so the response never reveals whether the account exists.
    public AuthUser login(String email, String password) {
        StudentEntity student = srepo.findFirstByEmailIgnoreCaseOrderByStudentIdAsc(normalize(email)).orElse(null);
        if (student == null || !passwordHasher.matches(password, student.getPasswordHash())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        return toAuthUser(student);
    }

    // The signed-in student, for /api/auth/me
    public AuthUser getAuthUser(int studentId) {
        return toAuthUser(getStudentById(studentId));
    }

    private static AuthUser toAuthUser(StudentEntity student) {
        return new AuthUser(student.getStudentId(), "student", student.getFullName(), student.getEmail(),
                student.getCourse());
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

    // A student reads their own account
    public StudentEntity getMyAccount(int studentId) {
        return getStudentById(studentId);
    }

    // UPDATE
    public StudentEntity updateStudent(int studentId, StudentEntity newDetails) {
        StudentEntity student = getStudentById(studentId);
        String email = normalize(newDetails.getEmail());
        if (email.isEmpty()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Email cannot be empty.");
        }
        if (!email.equalsIgnoreCase(student.getEmail()) && srepo.existsByEmailIgnoreCase(email)) {
            throw new AuthException(HttpStatus.CONFLICT, "Email is already in use.");
        }
        if (isBlank(newDetails.getFullName())) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Full name cannot be empty.");
        }
        student.setFullName(newDetails.getFullName().trim());
        student.setEmail(email);
        // Fields left out of the request keep their current value.
        if (newDetails.getYearLevel() != null) {
            student.setYearLevel(newDetails.getYearLevel());
        }
        if (newDetails.getCourse() != null) {
            student.setCourse(isBlank(newDetails.getCourse()) ? null : newDetails.getCourse().trim());
        }
        if (!isBlank(newDetails.getPassword())) {
            student.setPasswordHash(passwordHasher.hash(newDetails.getPassword()));
        }
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
