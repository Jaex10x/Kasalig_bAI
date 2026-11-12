package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import java.time.LocalDateTime;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;

@Entity
@Table(name = "learning_gap")
public class LearningGapEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int gapId;
    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private StudentEntity student;
    @ManyToOne(optional = false)
    @JoinColumn(name = "topic_id")
    private TopicEntity topic;
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 20)
    private GapSeverity severity;
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 20)
    private GapStatus status;
    @Column(nullable = false)
    private LocalDateTime detectedAt;

    public LearningGapEntity() {
    }

    public LearningGapEntity(StudentEntity student, TopicEntity topic, GapSeverity severity, GapStatus status,
            LocalDateTime detectedAt) {
        this.student = student;
        this.topic = topic;
        this.severity = severity;
        this.status = status;
        this.detectedAt = detectedAt;
    }

    public int getGapId() { return gapId; }
    public void setGapId(int gapId) { this.gapId = gapId; }
    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }
    public TopicEntity getTopic() { return topic; }
    public void setTopic(TopicEntity topic) { this.topic = topic; }
    public GapSeverity getSeverity() { return severity; }
    public void setSeverity(GapSeverity severity) { this.severity = severity; }
    public GapStatus getStatus() { return status; }
    public void setStatus(GapStatus status) { this.status = status; }
    public LocalDateTime getDetectedAt() { return detectedAt; }
    public void setDetectedAt(LocalDateTime detectedAt) { this.detectedAt = detectedAt; }
}
