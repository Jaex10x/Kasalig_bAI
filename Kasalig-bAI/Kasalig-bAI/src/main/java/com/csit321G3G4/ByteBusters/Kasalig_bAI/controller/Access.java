package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TokenService;

/** Reads who is calling from their login token, for "only your own account" checks. */
final class Access {

    private Access() {
    }

    static int id(Jwt jwt) {
        return Integer.parseInt(jwt.getSubject());
    }

    static boolean hasRole(Jwt jwt, String role) {
        return role.equalsIgnoreCase(jwt.getClaimAsString(TokenService.ROLES_CLAIM));
    }

    /** Allows the account itself (same role and id) and admins; refuses everyone else with 403. */
    static void requireSelf(Jwt jwt, String role, int accountId) {
        boolean self = hasRole(jwt, role) && id(jwt) == accountId;
        if (!self && !hasRole(jwt, "admin")) {
            throw new AuthException(HttpStatus.FORBIDDEN, "You can only access your own account.");
        }
    }
}
