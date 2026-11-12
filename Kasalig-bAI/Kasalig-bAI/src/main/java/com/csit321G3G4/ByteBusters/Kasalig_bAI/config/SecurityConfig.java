package com.csit321G3G4.ByteBusters.Kasalig_bAI.config;

import java.io.IOException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import com.csit321G3G4.ByteBusters.Kasalig_bAI.service.TokenService;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Who may call what. Every request must carry "Authorization: Bearer <token>" from a login,
 * except sign-up and login themselves. Per-account checks ("only your own account") are in the
 * controllers, via Access.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Tokens travel in a header, not a cookie, so CSRF does not apply and no server session is kept.
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/", "/error").permitAll()
                .requestMatchers(HttpMethod.POST,
                        "/api/student/register", "/api/student/postStudent", "/api/student/login",
                        "/api/teacher/register", "/api/teacher/postTeacher", "/api/teacher/login").permitAll()

                // Admins have no login yet, so these stay closed until one is added.
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Listing and looking up other people's accounts
                .requestMatchers(HttpMethod.GET, "/api/student/getAllStudents", "/api/student/getStudent/*")
                        .hasAnyRole("TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/teacher/getAllTeachers", "/api/teacher/getTeacher/*")
                        .hasAnyRole("TEACHER", "ADMIN")

                // A teacher managing students
                .requestMatchers("/api/teacher/getAllStudents", "/api/teacher/getStudents/*",
                        "/api/teacher/postStudents", "/api/teacher/putStudent/*")
                        .hasAnyRole("TEACHER", "ADMIN")

                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth -> oauth
                .jwt(jwt -> jwt.jwtAuthenticationConverter(rolesFromToken()))
                .authenticationEntryPoint((req, res, ex) ->
                        writeJson(res, 401, "Please log in again. Your session is missing or has expired."))
                .accessDeniedHandler((req, res, ex) ->
                        writeJson(res, 403, "You do not have permission to do that.")))
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) ->
                        writeJson(res, 401, "Please log in again. Your session is missing or has expired."))
                .accessDeniedHandler((req, res, e) ->
                        writeJson(res, 403, "You do not have permission to do that.")));
        return http.build();
    }

    /** The token's "roles" claim ("STUDENT", "TEACHER") becomes ROLE_STUDENT, ROLE_TEACHER. */
    private static JwtAuthenticationConverter rolesFromToken() {
        JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
        authorities.setAuthoritiesClaimName(TokenService.ROLES_CLAIM);
        authorities.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authorities);
        return converter;
    }

    /** Same { "message": ... } shape as GlobalExceptionHandler, so the frontend shows it. */
    private static void writeJson(HttpServletResponse res, int status, String message) throws IOException {
        res.setStatus(status);
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        res.getWriter().write("{\"message\":\"" + message + "\"}");
    }
}
