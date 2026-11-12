package com.csit321G3G4.ByteBusters.Kasalig_bAI.dto;

/**
 * Body of a successful login.
 *
 * @param token     send as "Authorization: Bearer <token>" on every later request
 * @param expiresAt when the token stops working, in milliseconds since 1970 (like JavaScript's Date.now())
 * @param user      the signed-in account
 */
public record LoginResponse(String token, long expiresAt, AuthUser user) {
}
