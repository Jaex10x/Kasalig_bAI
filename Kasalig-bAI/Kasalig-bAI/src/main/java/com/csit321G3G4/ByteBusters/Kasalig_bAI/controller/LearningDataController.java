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
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.LearningDataService;
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

    /* ---------- Student ---------- */

    @GetMapping("/students/{studentId}")
    public ObjectNode getStudentData(@AuthenticationPrincipal Jwt jwt, @PathVariable int studentId) {
        // Teachers and admins may read any student's results; a student only their own.
        if (Access.hasRole(jwt, "student")) {
            Access.requireSelf(jwt, "student", studentId);
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
        return learning.getClassData(isStaff(jwt));
    }

    @PutMapping("/class/{kind}/{clientId}")
    public JsonNode putClassRecord(@AuthenticationPrincipal Jwt jwt, @PathVariable String kind,
            @PathVariable String clientId, @RequestParam(required = false) Integer studentId,
            @RequestBody JsonNode body) {
        return learning.putRecord(kindOf(CLASS_KINDS, kind), clientId, studentId, body, role(jwt), Access.id(jwt));
    }

    @DeleteMapping("/class/{kind}/{clientId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClassRecord(@PathVariable String kind, @PathVariable String clientId) {
        learning.deleteRecord(kindOf(CLASS_KINDS, kind), clientId);
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

    @GetMapping("/roster")
    public ArrayNode getRoster() {
        return learning.getRoster();
    }

    /* ---------- Helpers ---------- */

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
