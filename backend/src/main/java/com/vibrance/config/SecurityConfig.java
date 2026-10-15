package com.vibrance.config;

import com.vibrance.security.CustomUserDetailsService;
import com.vibrance.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("{\"success\":false,\"message\":\"Unauthorized: Missing or invalid JWT authentication token\",\"data\":null}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write("{\"success\":false,\"message\":\"Forbidden: Insufficient privileges for this operation\",\"data\":null}");
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        // 1. Public Documentation & Auth Entrypoints
                        .requestMatchers(
                                "/api/v1/auth/login",
                                "/api/v1/auth/register",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api-docs/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // 2. Public Read for Event and Seat Catalog
                        .requestMatchers(HttpMethod.GET, "/api/v1/events/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/seats/**").permitAll()

                        // 3. Gatekeeper Operations (Staff & Admin)
                        .requestMatchers("/api/v1/scans/**").hasAnyRole("GATE_STAFF", "ADMIN")

                        // 4. Admin Management, Telemetry & Concurrency Lab
                        .requestMatchers("/api/v1/reports/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/concurrency/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/audit/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/bookings/all").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/events/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/events/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/events/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/auth/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/auth/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/auth/persona/**").hasRole("ADMIN")

                        // 5. Authenticated Student / Ticketing Operations
                        .requestMatchers("/api/v1/auth/me").authenticated()
                        .requestMatchers("/api/v1/seats/lock").authenticated()
                        .requestMatchers("/api/v1/seats/*/release").authenticated()
                        .requestMatchers("/api/v1/bookings/**").authenticated()

                        // Fallthrough
                        .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
