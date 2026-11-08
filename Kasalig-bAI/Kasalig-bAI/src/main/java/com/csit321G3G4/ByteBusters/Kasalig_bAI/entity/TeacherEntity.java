package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import jakarta.persistence.*;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.TeacherEntity;

@Entity
@Table(name = "teacher")
public class TeacherEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int teacherId;
    private String fullName;
    private String email;

    public TeacherEntity() {
    }

    public TeacherEntity( String fullName, String email) {
        this.fullName = fullName;
        this.email = email;
    }

    public int getTeacherId() { return teacherId; }
    public void setId(int teacherId) { this.teacherId = teacherId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
