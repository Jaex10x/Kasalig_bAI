package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import jakarta.persistence.*;

/** An official curriculum competency (e.g. a DepEd MELC) that topics are aligned to. */
@Entity
@Table(name = "curriculum_standard")
public class CurriculumStandardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int standardId;
    @Column(unique = true)
    private String code;
    @Column(length = 1000)
    private String description;
    private Integer yearLevel;

    public CurriculumStandardEntity() {
    }

    public CurriculumStandardEntity(String code, String description, Integer yearLevel) {
        this.code = code;
        this.description = description;
        this.yearLevel = yearLevel;
    }

    public int getStandardId() { return standardId; }
    public void setStandardId(int standardId) { this.standardId = standardId; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getYearLevel() { return yearLevel; }
    public void setYearLevel(Integer yearLevel) { this.yearLevel = yearLevel; }
}
