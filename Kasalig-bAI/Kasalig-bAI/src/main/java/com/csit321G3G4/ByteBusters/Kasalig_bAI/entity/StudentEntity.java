package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tblstudent")
public class StudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int studentId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String gradeLevel;
    private String school;

    public StudentEntity() {}

    public int getStudentId() { 
        return studentId; 
    }
    public void setStudentId(int studentId) { 
        this.studentId = studentId; 
    }

    public String getFirstName() { 
        return firstName; 
    }
    public void setFirstName(String firstName) { 
        this.firstName = firstName; 
    }

    public String getLastName() { 
        return lastName; 
    }
    public void setLastName(String lastName) { 
        this.lastName = lastName; 
    }

    public String getEmail() { 
        return email; 
    }
    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getPassword() { 
        return password; 
    }
    public void setPassword(String password) { 
        this.password = password; 
    }

    public String getGradeLevel() { 
        return gradeLevel; 
    }
    public void setGradeLevel(String gradeLevel) { 
        this.gradeLevel = gradeLevel; 
    }

    public String getSchool() { 
        return school; 
    }
    public void setSchool(String school) { 
        this.school = school; 
    }
}