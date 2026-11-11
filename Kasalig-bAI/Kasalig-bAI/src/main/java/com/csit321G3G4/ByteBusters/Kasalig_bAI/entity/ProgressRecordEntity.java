package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import java.time.LocalDateTime;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.*;

/** A snapshot of a student's mastery of one topic. A new row is added per attempt, so the rows form the history. */
@Entity
@Table(name = "progress_record")
public class ProgressRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int progressId;
    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private StudentEntity student;
    @ManyToOne(optional = false)
    @JoinColumn(name = "topic_id")
    private TopicEntity topic;
    /** Percentage from 0 to 100. */
    private float masteryLevel;
    @Column(nullable = false)
    private LocalDateTime recordedAt;

    public ProgressRecordEntity() {
    }

    public ProgressRecordEntity(StudentEntity student, TopicEntity topic, float masteryLevel, LocalDateTime recordedAt) {
        this.student = student;
        this.topic = topic;
        this.masteryLevel = masteryLevel;
        this.recordedAt = recordedAt;
    }

    public int getProgressId() { return progressId; }
    public void setProgressId(int progressId) { this.progressId = progressId; }
    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }
    public TopicEntity getTopic() { return topic; }
    public void setTopic(TopicEntity topic) { this.topic = topic; }
    public float getMasteryLevel() { return masteryLevel; }
    public void setMasteryLevel(float masteryLevel) { this.masteryLevel = masteryLevel; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
