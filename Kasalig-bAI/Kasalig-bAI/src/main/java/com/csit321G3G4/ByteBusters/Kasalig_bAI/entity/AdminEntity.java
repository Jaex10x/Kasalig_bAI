package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class AdminEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int adminId;
    private String fullName;
    private String email;

    public AdminEntity() {
    }

    public AdminEntity(String fullName, String email) {
        this.fullName = fullName;
        this.email = email;
    }

    public int getAdminId() { return adminId; }
    public void setId(int adminId) { this.adminId = adminId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}