package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tblteacher")
public class TeacherEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int teacherId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String department;
    private String school;

    public TeacherEntity() {}

    public int getTeacherId() { 
        return teacherId; 
    }
    public void setTeacherId(int teacherId) { 
        this.teacherId = teacherId; 
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

    public String getDepartment() { 
        return department; 
    }
    public void setDepartment(String department) { 
        this.department = department; 
    }

    public String getSchool() { 
        return school; 
    }
    public void setSchool(String school) { 
        this.school = school; 
    }
}