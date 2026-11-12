package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import java.time.LocalDate;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.*;

@Entity
@Table(name = "enrollment", uniqueConstraints = @UniqueConstraint(columnNames = { "student_id", "course_id" }))
public class EnrollmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int enrollmentId;
    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private StudentEntity student;
    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private CourseEntity course;
    private LocalDate enrolledOn;

    public EnrollmentEntity() {
    }

    public EnrollmentEntity(StudentEntity student, CourseEntity course, LocalDate enrolledOn) {
        this.student = student;
        this.course = course;
        this.enrolledOn = enrolledOn;
    }

    public int getEnrollmentId() { return enrollmentId; }
    public void setEnrollmentId(int enrollmentId) { this.enrollmentId = enrollmentId; }
    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }
    public CourseEntity getCourse() { return course; }
    public void setCourse(CourseEntity course) { this.course = course; }
    public LocalDate getEnrolledOn() { return enrolledOn; }
    public void setEnrolledOn(LocalDate enrolledOn) { this.enrolledOn = enrolledOn; }
}
