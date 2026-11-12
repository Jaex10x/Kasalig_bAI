package com.csit321G3G4.ByteBusters.Kasalig_bAI.dto;

/** Request body of the login endpoints. For a student, email may also hold a student ID. */
public record LoginRequest(String email, String password) {
}
