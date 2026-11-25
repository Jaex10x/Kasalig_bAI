package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import java.time.LocalDateTime;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;

/**
 * Content that teachers and admins create for the class and the school: quizzes, shared
 * resources, taught competencies, intervention notes, grades and attendance, sections and
 * subjects. The record itself is JSON in the shape the frontend uses (payload); the columns hold
 * what the server filters on and checks permissions with. (kind, clientId) is unique, and
 * clientId is the id the frontend gave the record.
 */
@Entity
@Table(name = "class_record", uniqueConstraints = @UniqueConstraint(columnNames = { "kind", "client_id" }))
public class ClassRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 20)
    private ClassRecordKind kind;

    @Column(name = "client_id", nullable = false, length = 80)
    private String clientId;

    /** The student an INTERVENTION or STANDING is about; null for every other kind. */
    @ManyToOne
    @JoinColumn(name = "student_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private StudentEntity student;

    /** For a QUIZ: whether students can see and take it. */
    private boolean published;

    /** Who last saved it: "teacher" or "admin", and their account id. */
    @Column(length = 10)
    private String authorRole;
    private Integer authorId;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String payload;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public ClassRecordEntity() {
    }

    public Long getRecordId() { return recordId; }
    public void setRecordId(Long recordId) { this.recordId = recordId; }
    public ClassRecordKind getKind() { return kind; }
    public void setKind(ClassRecordKind kind) { this.kind = kind; }
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }
    public Integer getAuthorId() { return authorId; }
    public void setAuthorId(Integer authorId) { this.authorId = authorId; }
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
