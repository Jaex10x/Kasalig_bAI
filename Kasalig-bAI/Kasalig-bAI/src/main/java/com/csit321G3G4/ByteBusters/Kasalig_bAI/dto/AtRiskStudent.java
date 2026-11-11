package com.csit321G3G4.ByteBusters.Kasalig_bAI.dto;

/** A student flagged as falling behind in a course, with a count of their open gaps by severity. */
public record AtRiskStudent(
        int studentId,
        String fullName,
        int openGaps,
        int criticalGaps,
        int moderateGaps,
        int mildGaps) {
}
