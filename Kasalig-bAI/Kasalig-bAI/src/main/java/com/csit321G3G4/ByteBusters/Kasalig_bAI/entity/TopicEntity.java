package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "topic")
public class TopicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int topicId;
    private String title;
    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private CourseEntity course;
    /** Null until the topic has been aligned to a curriculum standard. */
    @ManyToOne
    @JoinColumn(name = "standard_id")
    private CurriculumStandardEntity standard;

    public TopicEntity() {
    }

    public TopicEntity(String title, CourseEntity course, CurriculumStandardEntity standard) {
        this.title = title;
        this.course = course;
        this.standard = standard;
    }

    public int getTopicId() { return topicId; }
    public void setTopicId(int topicId) { this.topicId = topicId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public CourseEntity getCourse() { return course; }
    public void setCourse(CourseEntity course) { this.course = course; }
    public CurriculumStandardEntity getStandard() { return standard; }
    public void setStandard(CurriculumStandardEntity standard) { this.standard = standard; }
}
