package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G3G4.ByteBusters.Kasalig_bAI.controller.AuthException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AuthUser;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AdminEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AdminRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.CourseRepository;
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

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PasswordHasher passwordHasher;

    public AdminEntity getAdmin(int adminId) {
        return adminRepository.findById(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin " + adminId + " not found"));
    }

    //======= Admin login =========//

    // Every failure gets the same answer, so the response never reveals whether the account exists.
    public AuthUser login(String email, String password) {
        AdminEntity admin = adminRepository.findByEmailIgnoreCase(normalize(email)).orElse(null);
        if (admin == null || !passwordHasher.matches(password, admin.getPasswordHash())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        return toAuthUser(admin);
    }

    // The signed-in admin, for /api/auth/me
    public AuthUser getAuthUser(int adminId) {
        return toAuthUser(getAdmin(adminId));
    }

    private static AuthUser toAuthUser(AdminEntity admin) {
        return new AuthUser(admin.getAdminId(), "admin", admin.getFullName(), admin.getEmail(), null);
    }

    private static String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    //======= Teachers =========//

    public List<TeacherEntity> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public TeacherEntity getTeacher(int teacherId) {
        return findTeacherById(teacherId);                       
    }

    /**
     * Creates a teacher account. Teachers cannot sign themselves up: only an admin creates them,
     * with a starting password the admin passes on. adminId is the admin creating the account.
     */
    public TeacherEntity postTeacher(TeacherEntity body, int adminId) {
        String fullName = Require.text(body.getFullName(), "Full name");
        String email = validEmail(body.getEmail());
        if (teacherRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That email is already used by another teacher.");
        }
        TeacherEntity teacher = new TeacherEntity(fullName, email);
        teacher.setAdmin(getAdmin(adminId));
        teacher.setPasswordHash(passwordHasher.hash(body.getPassword()));
        return teacherRepository.save(teacher);
    }

    /** Updates a teacher's name and email; a non-blank password resets their password. */
    @Transactional
    public TeacherEntity putTeacher(int teacherId, TeacherEntity body) {
        TeacherEntity teacher = findTeacherById(teacherId);
        String fullName = Require.text(body.getFullName(), "Full name");
        String email = validEmail(body.getEmail());
        if (!teacher.getEmail().equalsIgnoreCase(email) && teacherRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That email is already used by another teacher.");
        }
        teacher.setFullName(fullName);
        teacher.setEmail(email);
        if (body.getAdmin() != null) {
            teacher.setAdmin(findAdmin(body.getAdmin()));
        }
        if (body.getPassword() != null && !body.getPassword().isBlank()) {
            teacher.setPasswordHash(passwordHasher.hash(body.getPassword()));
        }
        return teacherRepository.save(teacher);
    }

    private static String validEmail(String raw) {
        String email = normalize(Require.text(raw, "Email"));
        if (!Require.isEmail(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid email address.");
        }
        return email;
    }

    public TeacherEntity deleteTeacher(int teacherId) {
        TeacherEntity teacher = findTeacherById(teacherId);      
        long students = studentRepository.countByTeacherTeacherId(teacherId);
        if (students > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Teacher still has " + students + " student(s). Move or delete them first.");
        }
        long courses = courseRepository.countByTeacherTeacherId(teacherId);
        if (courses > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Teacher still handles " + courses + " course(s). They need to delete them first.");
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
                normalize(body.getEmail()),
                body.getYearLevel(),
                findTeacher(body.getTeacher())
        );
        student.setPasswordHash(passwordHasher.hashIfProvided(body.getPassword()));
        return studentRepository.save(student);
    }

    public StudentEntity putStudent(int studentId, StudentEntity body) {
        StudentEntity student = findStudent(studentId);
        if (!student.getEmail().equalsIgnoreCase(body.getEmail())
                && studentRepository.existsByEmailIgnoreCase(body.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        student.setFullName(body.getFullName());
        student.setEmail(normalize(body.getEmail()));
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

    private StudentEntity findStudent(int studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + studentId + " not found"));
    }

    
    private TeacherEntity findTeacherById(int teacherId) {      
        return teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher " + teacherId + " not found"));
    }

    
    /** The managing admin is optional: a null reference leaves the teacher without one. */
    private AdminEntity findAdmin(AdminEntity ref) {
        if (ref == null) {
            return null;
        }
        return adminRepository.findById(ref.getAdminId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Admin " + ref.getAdminId() + " does not exist"));
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

