package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import java.time.LocalDateTime;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;

/** A learning resource suggested to a student because of one of their learning gaps. */
@Entity
@Table(name = "recommendation", uniqueConstraints = @UniqueConstraint(columnNames = { "gap_id", "resource_id" }))
public class RecommendationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recommendationId;
    @ManyToOne(optional = false)
    @JoinColumn(name = "gap_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private LearningGapEntity gap;
    @ManyToOne(optional = false)
    @JoinColumn(name = "resource_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private LearningResourceEntity resource;
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 20)
    private RecommendationStatus status;
    @Column(nullable = false)
    private LocalDateTime createdAt;

    public RecommendationEntity() {
    }

    public RecommendationEntity(LearningGapEntity gap, LearningResourceEntity resource, RecommendationStatus status,
            LocalDateTime createdAt) {
        this.gap = gap;
        this.resource = resource;
        this.status = status;
        this.createdAt = createdAt;
    }

    public int getRecommendationId() { return recommendationId; }
    public void setRecommendationId(int recommendationId) { this.recommendationId = recommendationId; }
    public LearningGapEntity getGap() { return gap; }
    public void setGap(LearningGapEntity gap) { this.gap = gap; }
    public LearningResourceEntity getResource() { return resource; }
    public void setResource(LearningResourceEntity resource) { this.resource = resource; }
    public RecommendationStatus getStatus() { return status; }
    public void setStatus(RecommendationStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
