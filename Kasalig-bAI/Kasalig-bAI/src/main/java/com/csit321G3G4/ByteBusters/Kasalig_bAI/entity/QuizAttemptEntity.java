package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.*;

/**
 * One graded quiz or mastery check, exactly as the frontend's gap-detection engine produced it
 * (src/lib/engine.js, gradeAttempt). The whole graded attempt, with every answer, its gap type
 * and the reasons, is kept as JSON in payload; the columns hold what the server filters and
 * sorts on. clientId is the id the frontend gave the attempt, so saving it again is harmless.
 */
@Entity
@Table(name = "quiz_attempt", uniqueConstraints = @UniqueConstraint(columnNames = { "student_id", "client_id" }))
public class QuizAttemptEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attemptId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private StudentEntity student;

    @Column(name = "client_id", nullable = false, length = 80)
    private String clientId;

    /** "quiz" or "check" (a mastery check). */
    @Column(nullable = false, length = 10)
    private String kind;

    /** The quiz taken ("diagnostic" or a teacher quiz id); null for a mastery check. */
    @Column(length = 80)
    private String quizId;

    /** The topic of a mastery check; null for a quiz. */
    @Column(length = 40)
    private String topicId;

    @Column(length = 200)
    private String title;

    /** When it was taken, in milliseconds since 1970 (like JavaScript's Date.now()). */
    @Column(nullable = false)
    private long takenAt;

    private int correct;
    private int total;
    private int pct;

    /** Whether a mastery check was passed; null for a quiz. */
    private Boolean passed;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String payload;

    public QuizAttemptEntity() {
    }

    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }
    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public String getKind() { return kind; }
    public void setKind(String kind) { this.kind = kind; }
    public String getQuizId() { return quizId; }
    public void setQuizId(String quizId) { this.quizId = quizId; }
    public String getTopicId() { return topicId; }
    public void setTopicId(String topicId) { this.topicId = topicId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public long getTakenAt() { return takenAt; }
    public void setTakenAt(long takenAt) { this.takenAt = takenAt; }
    public int getCorrect() { return correct; }
    public void setCorrect(int correct) { this.correct = correct; }
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
    public int getPct() { return pct; }
    public void setPct(int pct) { this.pct = pct; }
    public Boolean getPassed() { return passed; }
    public void setPassed(Boolean passed) { this.passed = passed; }
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
}
