package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;
import java.util.regex.Pattern;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AuthUser;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginRequest;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** STUDENT: sign up, log in and read her own account. */
@Service
public class StudentService {

    /** Same rule as STUDENT_ID_PATTERN in the frontend's authApi.js, e.g. 2024-01530. */
    private static final Pattern STUDENT_ID = Pattern.compile("^\\d{2,4}-\\d{3,6}(-\\d{1,4})?$");

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordHasher passwordHasher;

    public StudentEntity getMyAccount(int studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + studentId + " not found"));
    }

    /**
     * Student sign-up. Always creates a new account from the name, login id, course and password
     * in the request. Anything else in the body, such as an id or a teacher, is ignored, so this
     * endpoint cannot be used to overwrite an existing account.
     */
    public StudentEntity register(StudentEntity body) {
        String fullName = Require.text(body.getFullName(), "fullName");
        String loginId = Require.text(body.getEmail(), "email");
        if (!Require.isEmail(loginId) && !STUDENT_ID.matcher(loginId).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid email or student ID.");
        }
        if (studentRepository.existsByEmailIgnoreCase(loginId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "An account with that email or student ID already exists.");
        }
        StudentEntity student = new StudentEntity(fullName, loginId, body.getYearLevel(), null);
        student.setCourse(body.getCourse() == null || body.getCourse().isBlank() ? null : body.getCourse().trim());
        student.setPasswordHash(passwordHasher.hash(body.getPassword()));
        return studentRepository.save(student);
    }

    /**
     * Checks a student's login id (email or student ID) and password. Every failure gets the same
     * answer, so the response never reveals whether the account exists.
     */
    public AuthUser login(LoginRequest request) {
        StudentEntity student = request.email() == null ? null
                : studentRepository.findFirstByEmailIgnoreCaseOrderByStudentIdAsc(request.email().trim()).orElse(null);
        if (student == null || !passwordHasher.matches(request.password(), student.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect email or password.");
        }
        return new AuthUser(student.getStudentId(), "student", student.getFullName(), student.getEmail(),
                student.getCourse());
    }

}
