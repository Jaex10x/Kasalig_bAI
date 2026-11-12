package com.csit321G3G4.ByteBusters.Kasalig_bAI.service;

import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.AuthUser;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.dto.LoginResponse;

/**
 * Issues the login token. Its subject is the account id and its "roles" claim the role, which
 * is all the backend needs to know who is calling. The token is valid until app.jwt.expiration.
 */
@Service
public class TokenService {

    public static final String ROLES_CLAIM = "roles";

    private final JwtEncoder encoder;
    private final Duration lifetime;

    public TokenService(JwtEncoder encoder, @Value("${app.jwt.expiration}") Duration lifetime) {
        this.encoder = encoder;
        this.lifetime = lifetime;
    }

    public LoginResponse issue(AuthUser user) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(lifetime);
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("kasalig-bai")
                .issuedAt(now)
                .expiresAt(expiresAt)
                .subject(String.valueOf(user.id()))
                .claim(ROLES_CLAIM, user.role().toUpperCase(Locale.ROOT))
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new LoginResponse(token, expiresAt.toEpochMilli(), user);
    }
}
