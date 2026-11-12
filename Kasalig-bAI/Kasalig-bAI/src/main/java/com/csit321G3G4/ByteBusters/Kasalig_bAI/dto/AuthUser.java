package com.csit321G3G4.ByteBusters.Kasalig_bAI.dto;

/**
 * The signed-in account, as returned by a successful login. Students and teachers share this
 * shape so the frontend can keep one kind of session user.
 *
 * @param id     the studentId or teacherId, depending on role
 * @param role   "student" or "teacher"
 * @param course a student's degree program; null for a teacher
 */
public record AuthUser(int id, String role, String fullName, String email, String course) {
}
