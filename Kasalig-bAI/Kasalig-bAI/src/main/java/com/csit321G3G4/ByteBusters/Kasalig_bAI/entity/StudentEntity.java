package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "student")
public class StudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int studentId;
    private String fullName;
    private String email;
    private Integer yearLevel;
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private TeacherEntity teacher;
    private String username;

    @Transient
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    public StudentEntity() {
    }

    public StudentEntity(String fullName, String email, Integer yearLevel, TeacherEntity teacher) {
        this.fullName = fullName;
        this.email = email;
        this.yearLevel = yearLevel;
        this.teacher = teacher;
    }

    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getYearLevel() { return yearLevel; }
    public void setYearLevel(Integer yearLevel) { this.yearLevel = yearLevel; }
    public TeacherEntity getTeacher() { return teacher; }
    public void setTeacher(TeacherEntity teacher) { this.teacher = teacher; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}