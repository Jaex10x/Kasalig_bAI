package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.ClassRecordEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.ClassRecordKind;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.QuizAttemptEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.StudentLearningStateEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.ClassRecordRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.QuizAttemptRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentLearningStateRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.StudentRepository;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

/**
 * Stores what the learning pages produce, so a student's progress follows them to any device and
 * teachers see real results:
 *  - graded quiz attempts and mastery checks (the gap report, learning path and progress history
 *    are all worked out from these by the frontend's engine);
 *  - each student's practice progress, study days and settings;
 *  - teacher and admin content (quizzes, resources, curriculum coverage, intervention notes,
 *    grades and attendance, sections, subjects).
 * Records are kept as JSON in the shape the frontend uses; this class checks their size and the
 * fields the server relies on, and who may see them is decided by the controller.
 */
@Service
public class LearningDataService {

    /** Largest JSON record accepted, in characters. A 40-question attempt is about 30 000. */
    static final int MAX_PAYLOAD_CHARS = 512 * 1024;

    /** Most attempts accepted in one request (loading the sample history sends three). */
    static final int MAX_ATTEMPTS_PER_REQUEST = 50;

    /** Ids the frontend makes up, e.g. "att-lx2k9-ab12" or "c-quad-solve". */
    private static final Pattern CLIENT_ID = Pattern.compile("^[A-Za-z0-9_.:-]{1,80}$");

    private static final Set<String> ATTEMPT_KINDS = Set.of("quiz", "check");

    /** Kinds that belong to one student; the rest are class- or school-wide. */
    private static final Set<ClassRecordKind> PER_STUDENT = Set.of(ClassRecordKind.INTERVENTION, ClassRecordKind.STANDING);

    @Autowired
    private ObjectMapper json;

    @Autowired
    private QuizAttemptRepository attempts;

    @Autowired
    private StudentLearningStateRepository states;

    @Autowired
    private ClassRecordRepository records;

    @Autowired
    private StudentRepository students;

    /* ============================== STUDENT ============================== */

    /** { attempts: [...oldest first], state: {...} } for one student. */
    @Transactional(readOnly = true)
    public ObjectNode getStudentData(int studentId) {
        requireStudent(studentId);
        ObjectNode out = json.createObjectNode();
        ArrayNode list = out.putArray("attempts");
        attempts.findByStudentStudentIdOrderByTakenAtAscAttemptIdAsc(studentId)
                .forEach(a -> list.add(read(a.getPayload())));
        out.set("state", states.findById(studentId)
                .map(s -> read(s.getPayload()))
                .orElseGet(json::createObjectNode));
        return out;
    }

    /**
     * Saves graded attempts (one object or an array). An attempt whose id was saved before is
     * replaced, so a retried request never creates a duplicate.
     *
     * @return how many attempts were saved
     */
    @Transactional
    public int saveAttempts(int studentId, JsonNode body) {
        StudentEntity student = requireStudent(studentId);
        List<JsonNode> list = new ArrayList<>();
        if (body != null && body.isArray()) {
            body.forEach(list::add);
        } else if (body != null && body.isObject()) {
            list.add(body);
        } else {
            throw bad("Send an attempt object or an array of attempts.");
        }
        if (list.isEmpty() || list.size() > MAX_ATTEMPTS_PER_REQUEST) {
            throw bad("Send between 1 and " + MAX_ATTEMPTS_PER_REQUEST + " attempts at a time.");
        }
        list.forEach(node -> saveAttempt(student, node));
        return list.size();
    }

    private void saveAttempt(StudentEntity student, JsonNode a) {
        if (!a.isObject()) {
            throw bad("Each attempt must be an object.");
        }
        String clientId = clientId(text(a, "id"), "attempt id");
        String kind = text(a, "kind");
        if (!ATTEMPT_KINDS.contains(kind)) {
            throw bad("Attempt kind must be \"quiz\" or \"check\".");
        }
        long takenAt = a.path("takenAt").asLong(0);
        if (takenAt <= 0) {
            throw bad("Attempt takenAt is required (milliseconds since 1970).");
        }
        int total = a.path("total").asInt(-1);
        int correct = a.path("correct").asInt(-1);
        int pct = a.path("pct").asInt(-1);
        if (total < 0 || correct < 0 || correct > total || pct < 0 || pct > 100) {
            throw bad("Attempt scores are out of range.");
        }
        if (!a.path("topics").isArray() || !a.path("gaps").isArray()) {
            throw bad("Attempt must include its topics and gaps.");
        }

        QuizAttemptEntity entity = attempts.findByStudentStudentIdAndClientId(student.getStudentId(), clientId)
                .orElseGet(QuizAttemptEntity::new);
        entity.setStudent(student);
        entity.setClientId(clientId);
        entity.setKind(kind);
        entity.setQuizId(limit(text(a, "quizId"), 80));
        entity.setTopicId(limit(text(a, "topicId"), 40));
        entity.setTitle(limit(text(a, "title"), 200));
        entity.setTakenAt(takenAt);
        entity.setCorrect(correct);
        entity.setTotal(total);
        entity.setPct(pct);
        entity.setPassed("check".equals(kind) ? a.path("passed").asBoolean(false) : null);
        entity.setPayload(write(a));
        attempts.save(entity);
    }

    /** Replaces the student's practice progress, study days and settings. */
    @Transactional
    public JsonNode saveState(int studentId, JsonNode state) {
        StudentEntity student = requireStudent(studentId);
        if (state == null || !state.isObject()) {
            throw bad("State must be an object.");
        }
        ObjectNode clean = ((ObjectNode) state).deepCopy();
        // Attempts have their own table; never keep a second copy here.
        clean.remove("attempts");

        StudentLearningStateEntity entity = states.findById(studentId).orElseGet(() -> {
            StudentLearningStateEntity created = new StudentLearningStateEntity();
            created.setStudent(student);
            return created;
        });
        entity.setPayload(write(clean));
        entity.setUpdatedAt(LocalDateTime.now());
        states.save(entity);
        return clean;
    }

    /** Deletes every attempt of the student and replaces their state ("Clear history"). */
    @Transactional
    public JsonNode resetHistory(int studentId, JsonNode state) {
        requireStudent(studentId);
        attempts.deleteByStudentStudentId(studentId);
        return saveState(studentId, state == null ? json.createObjectNode() : state);
    }

    /* ============================== CLASS ============================== */

    /**
     * The class content. Staff (teachers and admins) get everything; a student gets the published
     * quizzes and the shared resources only, never notes, grades or attendance about anyone.
     */
    @Transactional(readOnly = true)
    public ObjectNode getClassData(boolean staff) {
        ObjectNode out = json.createObjectNode();

        ArrayNode quizzes = out.putArray("quizzes");
        (staff
                ? records.findByKindOrderByCreatedAtAscRecordIdAsc(ClassRecordKind.QUIZ)
                : records.findByKindAndPublishedTrueOrderByCreatedAtAscRecordIdAsc(ClassRecordKind.QUIZ))
                .forEach(r -> quizzes.add(read(r.getPayload())));

        ArrayNode resources = out.putArray("resources");
        records.findByKindOrderByCreatedAtAscRecordIdAsc(ClassRecordKind.RESOURCE)
                .forEach(r -> resources.add(read(r.getPayload())));

        ObjectNode taught = out.putObject("taught");
        ObjectNode interventions = out.putObject("interventions");
        ObjectNode standings = out.putObject("standings");
        if (!staff) {
            return out;
        }

        records.findByKindOrderByCreatedAtAscRecordIdAsc(ClassRecordKind.TAUGHT)
                .forEach(r -> taught.put(r.getClientId(), true));

        // Newest note first, grouped by student, as the report page lists them.
        List<ClassRecordEntity> notes = records.findByKindOrderByCreatedAtAscRecordIdAsc(ClassRecordKind.INTERVENTION);
        for (int i = notes.size() - 1; i >= 0; i--) {
            ClassRecordEntity note = notes.get(i);
            String key = String.valueOf(note.getStudent().getStudentId());
            JsonNode existing = interventions.get(key);
            ArrayNode list = existing instanceof ArrayNode arr ? arr : interventions.putArray(key);
            list.add(read(note.getPayload()));
        }

        records.findByKindOrderByCreatedAtAscRecordIdAsc(ClassRecordKind.STANDING)
                .forEach(r -> standings.set(String.valueOf(r.getStudent().getStudentId()), read(r.getPayload())));
        return out;
    }

    /* ============================== SCHOOL ============================== */

    /** { classes: [...], subjects: [...] }: the sections and extra subjects the admin manages. */
    @Transactional(readOnly = true)
    public ObjectNode getSchoolData() {
        ObjectNode out = json.createObjectNode();
        ArrayNode classes = out.putArray("classes");
        records.findByKindOrderByCreatedAtAscRecordIdAsc(ClassRecordKind.SCHOOL_CLASS)
                .forEach(r -> classes.add(read(r.getPayload())));
        ArrayNode subjects = out.putArray("subjects");
        records.findByKindOrderByCreatedAtAscRecordIdAsc(ClassRecordKind.SUBJECT)
                .forEach(r -> subjects.add(read(r.getPayload())));
        return out;
    }

    /* ============================== WRITING RECORDS ============================== */

    /**
     * Creates or replaces one class or school record. The stored record's "id" is always clientId.
     * An INTERVENTION needs studentId; a STANDING is keyed by the student it is about (clientId is
     * their studentId). TAUGHT only records that the competency was taught.
     *
     * @return the record as stored
     */
    @Transactional
    public JsonNode putRecord(ClassRecordKind kind, String rawClientId, Integer studentId, JsonNode payload,
            String authorRole, int authorId) {
        String clientId = clientId(rawClientId, "id");
        if (payload == null || !payload.isObject()) {
            throw bad("The record must be a JSON object.");
        }
        ObjectNode body = ((ObjectNode) payload).deepCopy();

        StudentEntity student = null;
        if (kind == ClassRecordKind.STANDING) {
            student = requireStudent(parseStudentId(clientId));
            body = standing(body);
        } else if (kind == ClassRecordKind.INTERVENTION) {
            student = requireStudent(Require.present(studentId, "studentId"));
            body.put("id", clientId);
        } else if (kind == ClassRecordKind.TAUGHT) {
            body = json.createObjectNode();
        } else {
            body.put("id", clientId);
        }
        if (kind == ClassRecordKind.QUIZ && !body.path("questions").isArray()) {
            throw bad("A quiz must have a questions list.");
        }
        if (kind == ClassRecordKind.SETTING) {
            throw bad("That record cannot be changed.");
        }

        LocalDateTime now = LocalDateTime.now();
        ClassRecordEntity entity = records.findByKindAndClientId(kind, clientId).orElseGet(() -> {
            ClassRecordEntity created = new ClassRecordEntity();
            created.setKind(kind);
            created.setClientId(clientId);
            created.setCreatedAt(now);
            return created;
        });
        if (PER_STUDENT.contains(kind) && entity.getStudent() != null
                && entity.getStudent().getStudentId() != student.getStudentId()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That record belongs to another student.");
        }
        entity.setStudent(student);
        entity.setPublished(kind == ClassRecordKind.QUIZ && body.path("published").asBoolean(false));
        entity.setAuthorRole(authorRole);
        entity.setAuthorId(authorId);
        entity.setPayload(write(body));
        entity.setUpdatedAt(now);
        records.save(entity);
        return body;
    }

    /** Deletes a record. Deleting one that does not exist is not an error. */
    @Transactional
    public void deleteRecord(ClassRecordKind kind, String rawClientId) {
        if (kind == ClassRecordKind.SETTING) {
            throw bad("That record cannot be changed.");
        }
        records.findByKindAndClientId(kind, clientId(rawClientId, "id")).ifPresent(records::delete);
    }

    /* ============================== ROSTER ============================== */

    /**
     * Every student with their attempts (oldest first), for the teacher's class dashboard, heatmap,
     * at-risk alerts and reports. The answer-by-answer detail is left out: the teacher pages work
     * from topic scores and gaps, and it would make the response many times larger.
     */
    @Transactional(readOnly = true)
    public ArrayNode getRoster() {
        Map<Integer, ArrayNode> byStudent = new HashMap<>();
        for (QuizAttemptEntity attempt : attempts.findAllByOrderByTakenAtAscAttemptIdAsc()) {
            JsonNode node = read(attempt.getPayload());
            if (node instanceof ObjectNode obj) {
                obj.remove("items");
            }
            byStudent.computeIfAbsent(attempt.getStudent().getStudentId(), id -> json.createArrayNode()).add(node);
        }

        ArrayNode out = json.createArrayNode();
        students.findAll().stream()
                .sorted(Comparator.comparing(s -> s.getFullName() == null ? "" : s.getFullName().toLowerCase()))
                .forEach(s -> {
                    ObjectNode row = out.addObject();
                    row.put("id", s.getStudentId());
                    row.put("fullName", s.getFullName());
                    row.put("email", s.getEmail());
                    row.put("program", s.getProgram());
                    row.set("attempts", byStudent.getOrDefault(s.getStudentId(), json.createArrayNode()));
                });
        return out;
    }

    /* ============================== HELPERS ============================== */

    /** Keeps only a valid grade (0-100) and attendance (0-100%); either may be null. */
    private ObjectNode standing(ObjectNode body) {
        ObjectNode clean = json.createObjectNode();
        for (String field : List.of("grade", "attendance")) {
            JsonNode value = body.get(field);
            if (value == null || value.isNull()) {
                clean.putNull(field);
            } else if (value.isNumber() && value.asDouble() >= 0 && value.asDouble() <= 100) {
                clean.put(field, Math.round(value.asDouble() * 10) / 10.0);
            } else {
                throw bad(field + " must be a number from 0 to 100.");
            }
        }
        return clean;
    }

    private static int parseStudentId(String clientId) {
        try {
            return Integer.parseInt(clientId);
        } catch (NumberFormatException e) {
            throw bad("A standing is saved under the student's id.");
        }
    }

    private StudentEntity requireStudent(int studentId) {
        return students.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + studentId + " not found"));
    }

    private static String clientId(String value, String field) {
        if (value == null || !CLIENT_ID.matcher(value).matches()) {
            throw bad(field + " must be 1-80 letters, digits, or . _ : -");
        }
        return value;
    }

    /** A text field of a JSON object, or null when it is missing or null. */
    private static String text(JsonNode node, String field) {
        JsonNode value = node.get(field);
        if (value == null || value.isNull()) {
            return null;
        }
        if (!value.isString()) {
            throw bad(field + " must be text.");
        }
        return value.asString();
    }

    private static String limit(String value, int max) {
        return value == null || value.length() <= max ? value : value.substring(0, max);
    }

    private JsonNode read(String payload) {
        return json.readTree(payload);
    }

    private String write(JsonNode node) {
        String text = json.writeValueAsString(node);
        if (text.length() > MAX_PAYLOAD_CHARS) {
            throw new ResponseStatusException(HttpStatus.CONTENT_TOO_LARGE, "That record is too large to save.");
        }
        return text;
    }

    private static ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
