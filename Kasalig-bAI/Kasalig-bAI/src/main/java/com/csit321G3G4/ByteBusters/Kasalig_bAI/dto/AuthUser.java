package com.csit321G3G4.ByteBusters.Kasalig_bAI.dto;

/**
 * The signed-in account, as returned by a successful login. Students, teachers and admins share
 * this shape so the frontend can keep one kind of session user.
 *
 * @param id      the studentId, teacherId or adminId, depending on role
 * @param role    "student", "teacher" or "admin"
 * @param program a student's degree program; null for a teacher or admin
 */
public record AuthUser(int id, String role, String fullName, String email, String program) {
}
