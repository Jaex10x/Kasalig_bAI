package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

import jakarta.persistence.*;

/**
 * A class a teacher handles: one subject of the curriculum (e.g. CSIT221 Data Structures and
 * Algorithms, 3 units, 2nd year, 1st semester) for one section (e.g. BSIT-2A). Students are
 * added to it through EnrollmentEntity, by the teacher or, when selfEnroll is on, by themselves.
 * A teacher only works with the students enrolled in their own courses.
 */
@Entity
@Table(name = "course")
public class CourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int courseId;

    /** The curriculum subject code, e.g. "CSIT221". Optional for a course outside the curriculum. */
    @Column(length = 20)
    private String subjectCode;

    /** The subject description, e.g. "Data Structures and Algorithms". */
    @Column(nullable = false)
    private String title;

    /** The section (class group), e.g. "BSIT-2A". Optional. */
    @Column(length = 80)
    private String section;

    /** Year level the subject is taken in, e.g. 2. Optional. (Stored in the older grade_level column.) */
    @Column(name = "grade_level")
    private Integer yearLevel;

    /** 1 or 2 for the 1st or 2nd semester, 3 for summer. Optional. */
    private Integer semester;

    /** Credit units, e.g. 3.0. Optional. */
    private Float units;

    /** Whether students can enroll themselves. Null (older rows) counts as open. */
    private Boolean selfEnroll;

    /** The teacher who handles the course. */
    @ManyToOne(optional = false)
    @JoinColumn(name = "teacher_id")
    private TeacherEntity teacher;

    public CourseEntity() {
    }

    public int getCourseId() { return courseId; }
    public void setCourseId(int courseId) { this.courseId = courseId; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public Float getUnits() { return units; }
    public void setUnits(Float units) { this.units = units; }
    public boolean isOpenForSelfEnroll() { return !Boolean.FALSE.equals(selfEnroll); }
    public void setSelfEnroll(Boolean selfEnroll) { this.selfEnroll = selfEnroll; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public Integer getYearLevel() { return yearLevel; }
    public void setYearLevel(Integer yearLevel) { this.yearLevel = yearLevel; }
    public TeacherEntity getTeacher() { return teacher; }
    public void setTeacher(TeacherEntity teacher) { this.teacher = teacher; }
}
