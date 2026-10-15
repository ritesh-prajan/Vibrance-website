package com.vibrance.service;

import com.vibrance.dto.AuthDTO;
import com.vibrance.entity.User;
import com.vibrance.exception.BadRequestException;
import com.vibrance.exception.ConflictException;
import com.vibrance.exception.UnauthorizedException;
import com.vibrance.repository.UserRepository;
import com.vibrance.security.JwtTokenProvider;
import com.vibrance.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;
    private UUID sampleUserId;

    @BeforeEach
    void setUp() {
        sampleUserId = UUID.randomUUID();
        sampleUser = new User();
        sampleUser.setId(sampleUserId);
        sampleUser.setRegNumber("RA2111003010142");
        sampleUser.setName("Rahul Sharma");
        sampleUser.setEmail("rahul.sharma@vibrance.edu");
        sampleUser.setPasswordHash("$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG");
        sampleUser.setRole("student");
        sampleUser.setDepartment("SCOPE");
        sampleUser.setYearOfStudy("3rd Year");
        sampleUser.setAvatarSeed("rahul");
    }

    @Test
    @DisplayName("1. Successful Login with Valid Credentials returns JWT")
    void testSuccessfulLogin() {
        AuthDTO.LoginRequest req = new AuthDTO.LoginRequest("RA2111003010142", "password123");

        UserPrincipal principal = UserPrincipal.create(sampleUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(auth);
        when(userRepository.findById(sampleUserId)).thenReturn(Optional.of(sampleUser));
        when(tokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        AuthDTO.AuthResponse response = authService.login(req);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals("RA2111003010142", response.getUser().getRegNumber());
        assertEquals("student", response.getUser().getRole());
    }

    @Test
    @DisplayName("2. Login with Incorrect Password throws UnauthorizedException and never modifies password")
    void testLoginWithIncorrectPassword() {
        AuthDTO.LoginRequest req = new AuthDTO.LoginRequest("RA2111003010142", "wrongPassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(UnauthorizedException.class, () -> authService.login(req));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("3. Login with Unknown Account throws UnauthorizedException and never creates user")
    void testLoginWithUnknownAccount() {
        AuthDTO.LoginRequest req = new AuthDTO.LoginRequest("UNKNOWN_USER_999", "secretPass");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("User not found"));

        assertThrows(UnauthorizedException.class, () -> authService.login(req));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("4. Login with Missing Credentials throws BadRequestException")
    void testLoginWithMissingCredentials() {
        AuthDTO.LoginRequest emptyReg = new AuthDTO.LoginRequest("", "somePass");
        AuthDTO.LoginRequest emptyPass = new AuthDTO.LoginRequest("RA2111003010142", "");
        AuthDTO.LoginRequest nullPass = new AuthDTO.LoginRequest("RA2111003010142", null);

        assertThrows(BadRequestException.class, () -> authService.login(emptyReg));
        assertThrows(BadRequestException.class, () -> authService.login(emptyPass));
        assertThrows(BadRequestException.class, () -> authService.login(nullPass));
    }

    @Test
    @DisplayName("5. Successful Student Registration creates account and issues JWT")
    void testSuccessfulStudentRegistration() {
        AuthDTO.RegisterRequest req = new AuthDTO.RegisterRequest();
        req.setRegNumber("RA2211003010999");
        req.setName("Devika Nair");
        req.setEmail("devika.nair@vibrance.edu");
        req.setPassword("securePassword123");
        req.setDepartment("SCOPE");

        when(userRepository.existsByRegNumber("RA2211003010999")).thenReturn(false);
        when(userRepository.existsByEmail("devika.nair@vibrance.edu")).thenReturn(false);
        when(passwordEncoder.encode("securePassword123")).thenReturn("$2a$10$encodedHashHere");

        User savedUser = new User();
        savedUser.setId(UUID.randomUUID());
        savedUser.setRegNumber("RA2211003010999");
        savedUser.setName("Devika Nair");
        savedUser.setEmail("devika.nair@vibrance.edu");
        savedUser.setPasswordHash("$2a$10$encodedHashHere");
        savedUser.setRole("student");
        savedUser.setDepartment("SCOPE");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserPrincipal principal = UserPrincipal.create(savedUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock.new.jwt");

        AuthDTO.AuthResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("mock.new.jwt", response.getToken());
        assertEquals("student", response.getUser().getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("6. Duplicate Registration by Registration Number throws ConflictException")
    void testDuplicateRegistrationByRegNumber() {
        AuthDTO.RegisterRequest req = new AuthDTO.RegisterRequest();
        req.setRegNumber("RA2111003010142");
        req.setName("Rahul Duplicate");
        req.setEmail("rahul.new@vibrance.edu");
        req.setPassword("password123");
        req.setDepartment("SCOPE");

        when(userRepository.existsByRegNumber("RA2111003010142")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("7. Duplicate Registration by Email throws ConflictException")
    void testDuplicateRegistrationByEmail() {
        AuthDTO.RegisterRequest req = new AuthDTO.RegisterRequest();
        req.setRegNumber("RA2211003010555");
        req.setName("Another Student");
        req.setEmail("rahul.sharma@vibrance.edu"); // existing email
        req.setPassword("password123");
        req.setDepartment("SCOPE");

        when(userRepository.existsByRegNumber("RA2211003010555")).thenReturn(false);
        when(userRepository.existsByEmail("rahul.sharma@vibrance.edu")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("8. Privileged Role Escalation Attempt on Public Registration throws BadRequestException")
    void testPrivilegedRoleEscalationRejected() {
        AuthDTO.RegisterRequest adminReq = new AuthDTO.RegisterRequest();
        adminReq.setRegNumber("ATTACKER-01");
        adminReq.setName("Attacker");
        adminReq.setEmail("attacker@hack.fest");
        adminReq.setPassword("password123");
        adminReq.setRole("admin");
        adminReq.setDepartment("Hacking");

        AuthDTO.RegisterRequest staffReq = new AuthDTO.RegisterRequest();
        staffReq.setRegNumber("ATTACKER-02");
        staffReq.setName("Attacker 2");
        staffReq.setEmail("attacker2@hack.fest");
        staffReq.setPassword("password123");
        staffReq.setRole("gate_staff");
        staffReq.setDepartment("Security");

        assertThrows(BadRequestException.class, () -> authService.register(adminReq));
        assertThrows(BadRequestException.class, () -> authService.register(staffReq));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("9. Registration with Invalid Email or Short Password throws BadRequestException")
    void testRegistrationValidationErrors() {
        AuthDTO.RegisterRequest badEmail = new AuthDTO.RegisterRequest();
        badEmail.setRegNumber("RA2211003010777");
        badEmail.setName("Test Student");
        badEmail.setEmail("invalid-email-format");
        badEmail.setPassword("password123");
        badEmail.setDepartment("SCOPE");

        AuthDTO.RegisterRequest shortPass = new AuthDTO.RegisterRequest();
        shortPass.setRegNumber("RA2211003010888");
        shortPass.setName("Test Student");
        shortPass.setEmail("test@vibrance.edu");
        shortPass.setPassword("123"); // only 3 chars
        shortPass.setDepartment("SCOPE");

        assertThrows(BadRequestException.class, () -> authService.register(badEmail));
        assertThrows(BadRequestException.class, () -> authService.register(shortPass));
    }
}
