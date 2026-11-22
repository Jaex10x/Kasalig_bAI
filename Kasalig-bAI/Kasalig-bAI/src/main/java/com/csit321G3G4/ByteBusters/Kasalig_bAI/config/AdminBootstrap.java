package com.csit321G3G4.ByteBusters.Kasalig_bAI.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.entity.AdminEntity;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.repository.AdminRepository;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.PasswordHasher;

/**
 * Creates the first admin account at startup. There is no admin sign-up page (anyone could make
 * themselves an admin), so set ADMIN_EMAIL and ADMIN_PASSWORD before starting the backend.
 *
 * Does nothing when either is unset, or when an admin with that email already exists, so the
 * password of an existing admin is never overwritten by restarting the app.
 */
@Component
public class AdminBootstrap implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    private final AdminRepository admins;
    private final PasswordHasher passwordHasher;
    private final String email;
    private final String password;
    private final String fullName;

    public AdminBootstrap(AdminRepository admins, PasswordHasher passwordHasher,
            @Value("${app.admin.email:}") String email,
            @Value("${app.admin.password:}") String password,
            @Value("${app.admin.full-name:Administrator}") String fullName) {
        this.admins = admins;
        this.passwordHasher = passwordHasher;
        this.email = email.trim().toLowerCase();
        this.password = password;
        this.fullName = fullName;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (email.isEmpty() || password.isEmpty()) {
            if (admins.count() == 0) {
                log.info("No admin account exists. Set ADMIN_EMAIL and ADMIN_PASSWORD to create one.");
            }
            return;
        }
        if (admins.existsByEmailIgnoreCase(email)) {
            return;
        }
        AdminEntity admin = new AdminEntity(fullName, email);
        admin.setPasswordHash(passwordHasher.hash(password));
        admins.save(admin);
        log.info("Created admin account {}.", email);
    }
}
