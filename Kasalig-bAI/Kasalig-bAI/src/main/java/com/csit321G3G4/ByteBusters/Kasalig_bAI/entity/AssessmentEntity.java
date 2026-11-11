package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "assessment")
public class AssessmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int assessmentId;
    private String title;
    private LocalDate heldOn;
    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private CourseEntity course;

    public AssessmentEntity() {
    }

    public AssessmentEntity(String title, LocalDate heldOn, CourseEntity course) {
        this.title = title;
        this.heldOn = heldOn;
        this.course = course;
    }

    public int getAssessmentId() { return assessmentId; }
    public void setAssessmentId(int assessmentId) { this.assessmentId = assessmentId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public LocalDate getHeldOn() { return heldOn; }
    public void setHeldOn(LocalDate heldOn) { this.heldOn = heldOn; }
    public CourseEntity getCourse() { return course; }
    public void setCourse(CourseEntity course) { this.course = course; }
}
