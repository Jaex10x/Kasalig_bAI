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
    /** The admin who manages this teacher. Null for a teacher who registered on their own. */
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private AdminEntity admin;

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
    public AdminEntity getAdmin() { return admin; }
    public void setAdmin(AdminEntity admin) { this.admin = admin; }
}
