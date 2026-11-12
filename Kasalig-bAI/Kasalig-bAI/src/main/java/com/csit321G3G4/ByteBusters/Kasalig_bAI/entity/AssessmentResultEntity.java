package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import java.time.LocalDateTime;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.*;

/**
 * A student's score on one assessment item. All rows saved by the same submission share one
 * takenAt, so (student, assessment, takenAt) identifies an attempt.
 */
@Entity
@Table(name = "assessment_result")
public class AssessmentResultEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int resultId;
    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private StudentEntity student;
    @ManyToOne(optional = false)
    @JoinColumn(name = "item_id")
    private AssessmentItemEntity item;
    private float score;
    @Column(nullable = false)
    private LocalDateTime takenAt;

    public AssessmentResultEntity() {
    }

    public AssessmentResultEntity(StudentEntity student, AssessmentItemEntity item, float score, LocalDateTime takenAt) {
        this.student = student;
        this.item = item;
        this.score = score;
        this.takenAt = takenAt;
    }

    public int getResultId() { return resultId; }
    public void setResultId(int resultId) { this.resultId = resultId; }
    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }
    public AssessmentItemEntity getItem() { return item; }
    public void setItem(AssessmentItemEntity item) { this.item = item; }
    public float getScore() { return score; }
    public void setScore(float score) { this.score = score; }
    public LocalDateTime getTakenAt() { return takenAt; }
    public void setTakenAt(LocalDateTime takenAt) { this.takenAt = takenAt; }
}
