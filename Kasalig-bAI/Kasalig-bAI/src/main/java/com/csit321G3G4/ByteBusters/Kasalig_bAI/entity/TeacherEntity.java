package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    /** BCrypt hash of the password. Null while the account has no login. Never sent to clients. */
    @JsonIgnore
    private String passwordHash;

    /** The raw password of a create request. Read from JSON only; never stored or sent back. */
    @Transient
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

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
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
