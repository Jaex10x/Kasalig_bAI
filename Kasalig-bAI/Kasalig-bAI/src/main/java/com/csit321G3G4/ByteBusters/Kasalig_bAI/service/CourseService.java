package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.CourseEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.EnrollmentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.CourseRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.EnrollmentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.TeacherRepository;

/**
 * Courses and enrollment. A teacher creates the courses they handle and adds the students who
 * enroll: an existing account (by email or student ID) or a new account they create. A teacher
 * only ever works with the students enrolled in their own courses; an admin can see all of them.
 *
 * caller is who is asking: { role: "teacher" | "admin", id }.
 */
@Service
public class CourseService {

    /** Who is calling, from their login token. */
    public record Caller(String role, int id) {
        public boolean isAdmin() {
            return "admin".equals(role);
        }
    }

    /** A course as the frontend shows it. */
    public record CourseView(int id, String subjectCode, String title, String section, Integer yearLevel,
            Integer semester, Float units, boolean selfEnroll, int teacherId, String teacherName, long studentCount) {
    }

    /** A course in a student's course list, and whether they are enrolled in it. */
    public record OfferedCourse(CourseView course, boolean enrolled) {
    }

    /** A student enrolled in a course. */
    public record EnrolledStudent(int id, String fullName, String email, String program, LocalDate enrolledOn) {
    }

    /**
     * A course create/update request. subjectCode, title, units, yearLevel and semester come from
     * the curriculum subject the teacher picked; section is theirs. selfEnroll defaults to true.
     */
    public record CourseRequest(String subjectCode, String title, String section, Integer yearLevel,
            Integer semester, Float units, Boolean selfEnroll) {
    }

    @Autowired
    private CourseRepository courses;

    @Autowired
    private EnrollmentRepository enrollments;

    @Autowired
    private StudentRepository students;

    @Autowired
    private TeacherRepository teachers;

    @Autowired
    private StudentService studentService;

    /* ---------- Courses ---------- */

    @Transactional(readOnly = true)
    public List<CourseView> listCourses(Caller caller) {
        List<CourseEntity> list = caller.isAdmin()
                ? courses.findAllByOrderByTitleAscSectionAsc()
                : courses.findByTeacherTeacherIdOrderByTitleAscSectionAsc(caller.id());
        return list.stream().map(this::view).toList();
    }

    /** A teacher creates a course they handle. */
    @Transactional
    public CourseView createCourse(CourseRequest body, Caller caller) {
        if (caller.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Courses are created by the teacher who handles them.");
        }
        TeacherEntity teacher = teachers.findById(caller.id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));
        CourseEntity course = new CourseEntity();
        course.setTeacher(teacher);
        apply(course, body);
        return view(courses.save(course));
    }

    @Transactional
    public CourseView updateCourse(int courseId, CourseRequest body, Caller caller) {
        CourseEntity course = ownedCourse(courseId, caller);
        apply(course, body);
        return view(courses.save(course));
    }

    /** Deletes the course and its enrollment list. The student accounts and their results stay. */
    @Transactional
    public void deleteCourse(int courseId, Caller caller) {
        CourseEntity course = ownedCourse(courseId, caller);
        enrollments.deleteByCourseCourseId(courseId);
        courses.delete(course);
    }

    /* ---------- Enrollment ---------- */

    @Transactional(readOnly = true)
    public List<EnrolledStudent> listStudents(int courseId, Caller caller) {
        ownedCourse(courseId, caller);
        return enrollments.findByCourseCourseIdOrderByStudentFullNameAsc(courseId).stream()
                .map(CourseService::enrolled)
                .toList();
    }

    /** Enrolls a student who already has an account, found by their email or student ID. */
    @Transactional
    public EnrolledStudent enrollExisting(int courseId, String identifier, Caller caller) {
        CourseEntity course = ownedCourse(courseId, caller);
        String id = Require.text(identifier, "Email or student ID").toLowerCase();
        StudentEntity student = students.findFirstByEmailIgnoreCaseOrderByStudentIdAsc(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No student account uses " + id + ". Check the spelling, or create a new account for them."));
        return enroll(course, student);
    }

    /**
     * Creates a student account (same rules as signing up: name, email or student ID, program,
     * password) and enrolls it in the course.
     */
    @Transactional
    public EnrolledStudent createAndEnroll(int courseId, StudentEntity body, Caller caller) {
        CourseEntity course = ownedCourse(courseId, caller);
        StudentEntity student = studentService.postStudent(body);
        return enroll(course, student);
    }

    /** Removes a student from the course. Their account and results stay. */
    @Transactional
    public void unenroll(int courseId, int studentId, Caller caller) {
        ownedCourse(courseId, caller);
        enrollments.findByStudentStudentIdAndCourseCourseId(studentId, courseId).ifPresent(enrollments::delete);
    }

    /* ---------- Student self-enrollment ---------- */

    /**
     * For a student: every course open for self-enrollment, plus any course they are already in
     * (even a closed one, so they can still see it), each marked enrolled or not.
     */
    @Transactional(readOnly = true)
    public List<OfferedCourse> offeredTo(int studentId) {
        List<EnrollmentEntity> mine = enrollments.findByStudentStudentId(studentId);
        Set<Integer> mineIds = mine.stream().map(e -> e.getCourse().getCourseId()).collect(Collectors.toSet());
        Map<Integer, CourseEntity> all = new LinkedHashMap<>();
        courses.findOpenForSelfEnroll().forEach(c -> all.put(c.getCourseId(), c));
        mine.forEach(e -> all.putIfAbsent(e.getCourse().getCourseId(), e.getCourse()));
        return all.values().stream().map(c -> new OfferedCourse(view(c), mineIds.contains(c.getCourseId()))).toList();
    }

    /** A student enrolls themselves in a course that is open for self-enrollment. */
    @Transactional
    public OfferedCourse selfEnroll(int courseId, int studentId) {
        CourseEntity course = courses.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
        if (!course.isOpenForSelfEnroll()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "This class is not open for self-enrollment. Ask your teacher to add you.");
        }
        StudentEntity student = students.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        enroll(course, student);
        return new OfferedCourse(view(course), true);
    }

    /** A student drops a course they are enrolled in. Their account and results stay. */
    @Transactional
    public void selfDrop(int courseId, int studentId) {
        enrollments.findByStudentStudentIdAndCourseCourseId(studentId, courseId).ifPresent(enrollments::delete);
    }

    /** The courses a student is enrolled in. */
    @Transactional(readOnly = true)
    public List<CourseView> coursesOfStudent(int studentId) {
        return enrollments.findByStudentStudentId(studentId).stream().map(e -> view(e.getCourse())).toList();
    }

    /** Whether the teacher handles this course. */
    @Transactional(readOnly = true)
    public boolean isOwner(int teacherId, int courseId) {
        return courses.findById(courseId).map(c -> c.getTeacher().getTeacherId() == teacherId).orElse(false);
    }

    /* ---------- Who a teacher may see ---------- */

    /** Whether the caller may see this student's results: admins always; teachers if enrolled in their course. */
    @Transactional(readOnly = true)
    public boolean canSeeStudent(Caller caller, int studentId) {
        return caller.isAdmin() || enrollments.existsByStudentStudentIdAndCourseTeacherTeacherId(studentId, caller.id());
    }

    /** The ids of the students enrolled in the teacher's courses. */
    @Transactional(readOnly = true)
    public Set<Integer> studentIdsOf(int teacherId) {
        return enrollments.findByCourseTeacherTeacherId(teacherId).stream()
                .map(e -> e.getStudent().getStudentId())
                .collect(Collectors.toSet());
    }

    /** Every enrollment visible to the caller, for listing each student's courses. */
    @Transactional(readOnly = true)
    public List<EnrollmentEntity> enrollmentsVisibleTo(Caller caller) {
        return caller.isAdmin() ? enrollments.findAll() : enrollments.findByCourseTeacherTeacherId(caller.id());
    }

    /* ---------- Helpers ---------- */

    private EnrolledStudent enroll(CourseEntity course, StudentEntity student) {
        if (enrollments.existsByStudentStudentIdAndCourseCourseId(student.getStudentId(), course.getCourseId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    student.getFullName() + " is already enrolled in " + course.getTitle() + ".");
        }
        return enrolled(enrollments.save(new EnrollmentEntity(student, course, LocalDate.now())));
    }

    /** The course, if the caller handles it (or is an admin). */
    private CourseEntity ownedCourse(int courseId, Caller caller) {
        CourseEntity course = courses.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
        if (!caller.isAdmin() && course.getTeacher().getTeacherId() != caller.id()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage the courses you handle.");
        }
        return course;
    }

    private static void apply(CourseEntity course, CourseRequest body) {
        if (body == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course details are required");
        }
        String title = Require.text(body.title(), "Subject description");
        if (title.length() > 160) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Keep the subject description under 160 characters.");
        }
        String code = body.subjectCode() == null || body.subjectCode().isBlank() ? null : body.subjectCode().trim().toUpperCase();
        if (code != null && !code.matches("[A-Z0-9 ]{2,20}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subject code must be 2-20 letters, digits or spaces, e.g. CSIT221.");
        }
        String section = body.section() == null || body.section().isBlank() ? null : body.section().trim();
        if (section != null && section.length() > 80) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Keep the section name under 80 characters.");
        }
        Integer year = body.yearLevel();
        if (year != null && (year < 1 || year > 6)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Year level must be from 1 to 6.");
        }
        Integer semester = body.semester();
        if (semester != null && (semester < 1 || semester > 3)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Semester must be 1, 2 or 3 (summer).");
        }
        Float units = body.units();
        if (units != null && (units < 0 || units > 30)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Units must be from 0 to 30.");
        }
        course.setSubjectCode(code);
        course.setTitle(title);
        course.setSection(section);
        course.setYearLevel(year);
        course.setSemester(semester);
        course.setUnits(units);
        course.setSelfEnroll(body.selfEnroll() == null || body.selfEnroll());
    }

    private CourseView view(CourseEntity c) {
        return new CourseView(c.getCourseId(), c.getSubjectCode(), c.getTitle(), c.getSection(), c.getYearLevel(),
                c.getSemester(), c.getUnits(), c.isOpenForSelfEnroll(), c.getTeacher().getTeacherId(),
                c.getTeacher().getFullName(), enrollments.countByCourseCourseId(c.getCourseId()));
    }

    private static EnrolledStudent enrolled(EnrollmentEntity e) {
        StudentEntity s = e.getStudent();
        return new EnrolledStudent(s.getStudentId(), s.getFullName(), s.getEmail(), s.getProgram(), e.getEnrolledOn());
    }
}
