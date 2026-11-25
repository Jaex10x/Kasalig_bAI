package com.csit321G3G4.ByteBusters.Kasalig_bAI.entity;

/** What a ClassRecordEntity holds. */
public enum ClassRecordKind {
    /** A teacher-built quiz; students only see it once published. */
    QUIZ,
    /** A video, PDF, worksheet or link a teacher shared for a topic. */
    RESOURCE,
    /** A curriculum competency (MELC) the teacher marked as taught. The row existing means taught. */
    TAUGHT,
    /** A teacher's note about what they did for one student, and whether it worked. */
    INTERVENTION,
    /** One student's class standing (grade) and attendance, entered by the teacher. */
    STANDING,
    /** A section (class), managed by the admin. */
    SCHOOL_CLASS,
    /** An extra subject, managed by the admin. */
    SUBJECT,
    /** A one-off flag the server keeps for itself, such as "the sample sections were added". */
    SETTING
}
