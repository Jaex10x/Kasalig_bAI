package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import java.time.LocalDateTime;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.*;

/**
 * Everything about a student's studying that is not a graded attempt: adaptive-practice progress
 * per gap, the days they studied (for streaks), the explanation language and the recommendations
 * they finished. One row per student, kept as JSON in the shape the frontend uses.
 */
@Entity
@Table(name = "student_learning_state")
public class StudentLearningStateEntity {

    @Id
    @Column(name = "student_id")
    private Integer studentId;

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "student_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private StudentEntity student;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String payload;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public StudentLearningStateEntity() {
    }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }
    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
