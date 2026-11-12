package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AuthUser;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.StudentService;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TeacherService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentService sserv;

    @Autowired
    private TeacherService tserv;

    /**
     * The account the token belongs to. The frontend calls this on page load to check that a saved
     * token still works (401 when it has expired; 404 when the account was deleted).
     * Logging out needs no endpoint: the frontend forgets the token.
     */
    @GetMapping("/me")
    public AuthUser me(@AuthenticationPrincipal Jwt jwt) {
        int id = Access.id(jwt);
        return Access.hasRole(jwt, "teacher") ? tserv.getAuthUser(id) : sserv.getAuthUser(id);
    }
}
