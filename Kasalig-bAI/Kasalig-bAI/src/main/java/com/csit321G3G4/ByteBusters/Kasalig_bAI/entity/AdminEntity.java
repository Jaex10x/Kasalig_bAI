package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class AdminEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int adminId;
    private String fullName;
    @Column(unique = true)
    private String email;
    /** BCrypt hash of the password. Never sent to clients. Admins are created by AdminBootstrap, not by sign-up. */
    @JsonIgnore
    private String passwordHash;

    public AdminEntity() {
    }

    public AdminEntity(String fullName, String email) {
        this.fullName = fullName;
        this.email = email;
    }

    public int getAdminId() { return adminId; }
    public void setAdminId(int adminId) { this.adminId = adminId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
}
