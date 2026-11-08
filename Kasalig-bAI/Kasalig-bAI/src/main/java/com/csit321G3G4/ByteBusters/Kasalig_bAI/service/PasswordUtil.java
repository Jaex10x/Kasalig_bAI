package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import org.springframework.security.crypto.password.PasswordEncoder;

final class PasswordUtil{
    private PasswordUtil() {}

    static boolean isHashed(String stored){
        return stored != null && stored.startsWith("$2");
    }

    static boolean matches(PasswordEncoder encoder, String raw, String stored){
        if(raw == null || stored == null) return false;
        return isHashed(stored) ? encoder.matches(raw, stored) : stored.equals(raw);
    }   
}