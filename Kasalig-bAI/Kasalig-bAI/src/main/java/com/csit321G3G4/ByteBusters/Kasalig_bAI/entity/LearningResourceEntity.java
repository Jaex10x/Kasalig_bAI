package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;

/** A lesson, video, worksheet or other material that helps with one topic. */
@Entity
@Table(name = "learning_resource")
public class LearningResourceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int resourceId;
    @ManyToOne(optional = false)
    @JoinColumn(name = "topic_id")
    private TopicEntity topic;
    private String title;
    /** Free text, e.g. VIDEO, PDF, WORKSHEET, EXERCISE. */
    private String type;
    @Column(length = 1000)
    private String url;
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 20)
    private ResourceDifficulty difficulty;

    public LearningResourceEntity() {
    }

    public LearningResourceEntity(TopicEntity topic, String title, String type, String url,
            ResourceDifficulty difficulty) {
        this.topic = topic;
        this.title = title;
        this.type = type;
        this.url = url;
        this.difficulty = difficulty;
    }

    public int getResourceId() { return resourceId; }
    public void setResourceId(int resourceId) { this.resourceId = resourceId; }
    public TopicEntity getTopic() { return topic; }
    public void setTopic(TopicEntity topic) { this.topic = topic; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public ResourceDifficulty getDifficulty() { return difficulty; }
    public void setDifficulty(ResourceDifficulty difficulty) { this.difficulty = difficulty; }
}
