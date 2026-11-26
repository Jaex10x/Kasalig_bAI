package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import java.util.Locale;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.ClassRecordKind;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.EnrollmentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.CourseService;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.CourseService.Caller;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.LearningDataService;
import tools.jackson.databind.ObjectMapper;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TokenService;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

/**
 * The data behind the learning pages (src/store/learningStore.js in the frontend).
 *
 *   GET    /api/learning/students/{id}            attempts + practice state   (the student, teachers, admins)
 *   POST   /api/learning/students/{id}/attempts   save graded attempt(s)      (the student)
 *   PUT    /api/learning/students/{id}/state      save practice state         (the student)
 *   POST   /api/learning/students/{id}/reset      clear history               (the student)
 *   GET    /api/learning/class                    quizzes, resources, ...     (everyone; students see less)
 *   PUT    /api/learning/class/{kind}/{id}        save a class record         (teachers, admins)
 *   DELETE /api/learning/class/{kind}/{id}
 *   GET    /api/learning/school                   sections and subjects       (everyone)
 *   PUT    /api/learning/school/{kind}/{id}       save a section or subject   (admins)
 *   DELETE /api/learning/school/{kind}/{id}
 *   GET    /api/learning/roster                   every student + attempts    (teachers, admins)
 *
 * Role rules for whole paths are in SecurityConfig; "only your own data" is checked here.
 */
@RestController
@RequestMapping("/api/learning")
public class LearningDataController {

    /** URL names of the class record kinds, e.g. PUT /api/learning/class/quizzes/quiz-1. */
    private static final Map<String, ClassRecordKind> CLASS_KINDS = Map.of(
            "quizzes", ClassRecordKind.QUIZ,
            "resources", ClassRecordKind.RESOURCE,
            "taught", ClassRecordKind.TAUGHT,
            "interventions", ClassRecordKind.INTERVENTION,
            "standings", ClassRecordKind.STANDING);

    private static final Map<String, ClassRecordKind> SCHOOL_KINDS = Map.of(
            "classes", ClassRecordKind.SCHOOL_CLASS,
            "subjects", ClassRecordKind.SUBJECT);

    @Autowired
    private LearningDataService learning;

    @Autowired
    private CourseService courses;

    @Autowired
    private ObjectMapper json;

    /* ---------- Student ---------- */

    @GetMapping("/students/{studentId}")
    public ObjectNode getStudentData(@AuthenticationPrincipal Jwt jwt, @PathVariable int studentId) {
        // A student reads only their own results; a teacher only those of students enrolled in
        // their courses; an admin anyone's.
        if (Access.hasRole(jwt, "student")) {
            Access.requireSelf(jwt, "student", studentId);
        } else {
            requireVisible(jwt, studentId);
        }
        return learning.getStudentData(studentId);
    }

    @PostMapping("/students/{studentId}/attempts")
    public Map<String, Integer> saveAttempts(@AuthenticationPrincipal Jwt jwt, @PathVariable int studentId,
            @RequestBody JsonNode body) {
        Access.requireSelf(jwt, "student", studentId);
        return Map.of("saved", learning.saveAttempts(studentId, body));
    }

    @PutMapping("/students/{studentId}/state")
    public JsonNode saveState(@AuthenticationPrincipal Jwt jwt, @PathVariable int studentId,
            @RequestBody JsonNode state) {
        Access.requireSelf(jwt, "student", studentId);
        return learning.saveState(studentId, state);
    }

    @PostMapping("/students/{studentId}/reset")
    public JsonNode resetHistory(@AuthenticationPrincipal Jwt jwt, @PathVariable int studentId,
            @RequestBody(required = false) JsonNode state) {
        Access.requireSelf(jwt, "student", studentId);
        return learning.resetHistory(studentId, state);
    }

    /* ---------- Class ---------- */

    @GetMapping("/class")
    public ObjectNode getClassData(@AuthenticationPrincipal Jwt jwt) {
        if (Access.hasRole(jwt, "student")) {
            // A student gets the published quizzes of their courses, plus the courses themselves.
            List<CourseService.CourseView> mine = courses.coursesOfStudent(Access.id(jwt));
            Set<Integer> ids = new java.util.HashSet<>();
            mine.forEach(c -> ids.add(c.id()));
            ObjectNode out = learning.getClassData(false, null, null, ids);
            out.set("myCourses", json.valueToTree(mine));
            return out;
        }
        Integer quizAuthor = Access.hasRole(jwt, "teacher") ? Access.id(jwt) : null;
        return learning.getClassData(true, visibleStudents(jwt), quizAuthor, null);
    }

    @PutMapping("/class/{kind}/{clientId}")
    public JsonNode putClassRecord(@AuthenticationPrincipal Jwt jwt, @PathVariable String kind,
            @PathVariable String clientId, @RequestParam(required = false) Integer studentId,
            @RequestBody JsonNode body) {
        ClassRecordKind recordKind = kindOf(CLASS_KINDS, kind);
        // Notes, grades and attendance only for students enrolled in the teacher's courses.
        if (recordKind == ClassRecordKind.INTERVENTION && studentId != null) {
            requireVisible(jwt, studentId);
        } else if (recordKind == ClassRecordKind.STANDING && clientId.matches("[0-9]{1,9}")) {
            requireVisible(jwt, Integer.parseInt(clientId));
        }
        // A quiz belongs to one of the teacher's own courses.
        if (recordKind == ClassRecordKind.QUIZ && Access.hasRole(jwt, "teacher") && body != null) {
            JsonNode courseId = body.get("courseId");
            if (courseId != null && !courseId.isNull()
                    && !(courseId.canConvertToInt() && courses.isOwner(Access.id(jwt), courseId.asInt()))) {
                throw new AuthException(HttpStatus.FORBIDDEN, "You can only add quizzes to the courses you handle.");
            }
        }
        return learning.putRecord(recordKind, clientId, studentId, body, role(jwt), Access.id(jwt));
    }

    @DeleteMapping("/class/{kind}/{clientId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClassRecord(@AuthenticationPrincipal Jwt jwt, @PathVariable String kind,
            @PathVariable String clientId) {
        learning.deleteRecord(kindOf(CLASS_KINDS, kind), clientId, role(jwt), Access.id(jwt));
    }

    /* ---------- School ---------- */

    @GetMapping("/school")
    public ObjectNode getSchoolData() {
        return learning.getSchoolData();
    }

    @PutMapping("/school/{kind}/{clientId}")
    public JsonNode putSchoolRecord(@AuthenticationPrincipal Jwt jwt, @PathVariable String kind,
            @PathVariable String clientId, @RequestBody JsonNode body) {
        return learning.putRecord(kindOf(SCHOOL_KINDS, kind), clientId, null, body, role(jwt), Access.id(jwt));
    }

    @DeleteMapping("/school/{kind}/{clientId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSchoolRecord(@PathVariable String kind, @PathVariable String clientId) {
        learning.deleteRecord(kindOf(SCHOOL_KINDS, kind), clientId);
    }

    /* ---------- Roster ---------- */

    /** A teacher gets the students enrolled in their courses; an admin gets every student. */
    @GetMapping("/roster")
    public ArrayNode getRoster(@AuthenticationPrincipal Jwt jwt) {
        Caller caller = CourseController.caller(jwt);
        Map<Integer, List<ObjectNode>> coursesByStudent = new HashMap<>();
        for (EnrollmentEntity e : courses.enrollmentsVisibleTo(caller)) {
            ObjectNode c = json.createObjectNode();
            c.put("id", e.getCourse().getCourseId());
            c.put("subjectCode", e.getCourse().getSubjectCode());
            c.put("title", e.getCourse().getTitle());
            c.put("section", e.getCourse().getSection());
            coursesByStudent.computeIfAbsent(e.getStudent().getStudentId(), id -> new ArrayList<>()).add(c);
        }
        return learning.getRoster(caller.isAdmin() ? null : coursesByStudent.keySet(), coursesByStudent);
    }

    /* ---------- Helpers ---------- */

    /** Teachers: the students enrolled in their courses. Everyone else: null (no extra limit). */
    private Set<Integer> visibleStudents(Jwt jwt) {
        return Access.hasRole(jwt, "teacher") ? courses.studentIdsOf(Access.id(jwt)) : null;
    }

    private void requireVisible(Jwt jwt, int studentId) {
        if (Access.hasRole(jwt, "teacher") && !courses.canSeeStudent(CourseController.caller(jwt), studentId)) {
            throw new AuthException(HttpStatus.FORBIDDEN, "That student is not enrolled in any of your courses.");
        }
    }

    private static boolean isStaff(Jwt jwt) {
        return Access.hasRole(jwt, "teacher") || Access.hasRole(jwt, "admin");
    }

    private static String role(Jwt jwt) {
        return jwt.getClaimAsString(TokenService.ROLES_CLAIM).toLowerCase(Locale.ROOT);
    }

    private static ClassRecordKind kindOf(Map<String, ClassRecordKind> kinds, String name) {
        ClassRecordKind kind = kinds.get(name);
        if (kind == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown record type: " + name);
        }
        return kind;
    }
}
