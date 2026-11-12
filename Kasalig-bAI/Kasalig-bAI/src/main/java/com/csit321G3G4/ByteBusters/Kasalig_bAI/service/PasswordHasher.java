package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/** Hashes and checks account passwords. The one place that knows the password rules. */
@Component
public class PasswordHasher {

    /** Matches MIN_PASSWORD_LENGTH in the frontend's authApi.js. */
    static final int MIN_LENGTH = 8;

    /** BCrypt only reads the first 72 bytes of a password, so anything longer is rejected. */
    static final int MAX_BYTES = 72;

    @Autowired
    private PasswordEncoder encoder;

    /** Checks a new password against the rules and returns the hash to store. */
    public String hash(String rawPassword) {
        if (rawPassword == null || rawPassword.length() < MIN_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password must be at least " + MIN_LENGTH + " characters.");
        }
        if (isTooLong(rawPassword)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password must be at most " + MAX_BYTES + " characters.");
        }
        return encoder.encode(rawPassword);
    }

    /** For accounts created on someone's behalf: no password means the account has no login yet. */
    public String hashIfProvided(String rawPassword) {
        return rawPassword == null || rawPassword.isBlank() ? null : hash(rawPassword);
    }

    /** True only when the account has a password and rawPassword is that password. */
    public boolean matches(String rawPassword, String passwordHash) {
        if (rawPassword == null || passwordHash == null || isTooLong(rawPassword)) {
            return false;
        }
        return encoder.matches(rawPassword, passwordHash);
    }

    private static boolean isTooLong(String rawPassword) {
        return rawPassword.getBytes(StandardCharsets.UTF_8).length > MAX_BYTES;
    }
}
