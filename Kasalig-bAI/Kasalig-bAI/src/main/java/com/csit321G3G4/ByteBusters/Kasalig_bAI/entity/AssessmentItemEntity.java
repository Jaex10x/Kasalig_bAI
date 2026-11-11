package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import jakarta.persistence.*;

/** One question of an assessment. Its topic tag is what makes gap detection possible. */
@Entity
@Table(name = "assessment_item")
public class AssessmentItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int itemId;
    @ManyToOne(optional = false)
    @JoinColumn(name = "assessment_id")
    private AssessmentEntity assessment;
    @ManyToOne(optional = false)
    @JoinColumn(name = "topic_id")
    private TopicEntity topic;
    @Column(length = 1000)
    private String question;
    private Integer maxScore;

    public AssessmentItemEntity() {
    }

    public AssessmentItemEntity(AssessmentEntity assessment, TopicEntity topic, String question, Integer maxScore) {
        this.assessment = assessment;
        this.topic = topic;
        this.question = question;
        this.maxScore = maxScore;
    }

    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }
    public AssessmentEntity getAssessment() { return assessment; }
    public void setAssessment(AssessmentEntity assessment) { this.assessment = assessment; }
    public TopicEntity getTopic() { return topic; }
    public void setTopic(TopicEntity topic) { this.topic = topic; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }
}
