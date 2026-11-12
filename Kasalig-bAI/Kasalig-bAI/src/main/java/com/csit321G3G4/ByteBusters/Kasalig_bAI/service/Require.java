package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** Request-validation helpers shared by the services. Every failure becomes an HTTP 400. */
final class Require {

    /** Same rule as EMAIL_PATTERN in the frontend's authApi.js. */
    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private Require() {
    }

    static boolean isEmail(String value) {
        return EMAIL.matcher(value).matches();
    }

    /** Returns the trimmed value, or rejects the request when it is null or blank. */
    static String text(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " is required");
        }
        return value.trim();
    }

    static <T> T present(T value, String field) {
        if (value == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " is required");
        }
        return value;
    }
}
