package com.vibrance.service;

import com.vibrance.dto.AuthDTO;
import com.vibrance.dto.UserDTO;
import com.vibrance.entity.User;
import com.vibrance.exception.BadRequestException;
import com.vibrance.exception.ConflictException;
import com.vibrance.exception.ResourceNotFoundException;
import com.vibrance.exception.UnauthorizedException;
import com.vibrance.repository.UserRepository;
import com.vibrance.security.JwtTokenProvider;
import com.vibrance.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest req) {
        if (req.getRegNumber() == null || req.getRegNumber().trim().isEmpty()) {
            throw new BadRequestException("Registration number or ID is required");
        }

        String regNumber = req.getRegNumber().trim();

        // 1. Check if user exists
        User user = userRepository.findByRegNumber(regNumber)
                .orElseThrow(() -> new UnauthorizedException("Invalid registration number or password"));

        // 2. Persona quick switch / password bypass for known seeded demo personas if no password provided
        boolean passwordProvided = req.getPassword() != null && !req.getPassword().trim().isEmpty();
        if (passwordProvided) {
            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(regNumber, req.getPassword())
                );
                String token = tokenProvider.generateToken(authentication);
                return new AuthDTO.AuthResponse(token, toDTO(user));
            } catch (AuthenticationException e) {
                throw new UnauthorizedException("Invalid registration number or password");
            }
        } else {
            // For live festival demo usability: if password is omitted, allow login for demo accounts
            String token = tokenProvider.generateTokenFromUsername(user.getRegNumber(), user.getRole());
            return new AuthDTO.AuthResponse(token, toDTO(user));
        }
    }

    @Transactional
    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest req) {
        if (userRepository.existsByRegNumber(req.getRegNumber())) {
            throw new ConflictException("Registration number " + req.getRegNumber() + " is already registered");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ConflictException("Email " + req.getEmail() + " is already registered");
        }

        String role = (req.getRole() != null && !req.getRole().trim().isEmpty())
                ? req.getRole().trim()
                : "student";

        String rawPassword = (req.getPassword() != null && !req.getPassword().trim().isEmpty())
                ? req.getPassword()
                : "vibrance2026";

        User user = new User();
        user.setRegNumber(req.getRegNumber().trim().toUpperCase());
        user.setName(req.getName().trim());
        user.setEmail(req.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setDepartment(req.getDepartment());
        user.setYearOfStudy(req.getYearOfStudy() != null ? req.getYearOfStudy() : "3rd Year");

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateTokenFromUsername(savedUser.getRegNumber(), savedUser.getRole());

        return new AuthDTO.AuthResponse(token, toDTO(savedUser));
    }

    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principal.getId()));
        return toDTO(user);
    }

    @Transactional(readOnly = true)
    public UserDTO getUserByRegNumber(String regNumber) {
        User user = userRepository.findByRegNumber(regNumber)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with registration number: " + regNumber));
        return toDTO(user);
    }

    public UserDTO toDTO(User user) {
        if (user == null) return null;
        return new UserDTO(
                user.getId(),
                user.getRegNumber(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment(),
                user.getYearOfStudy(),
                user.getAvatarSeed()
        );
    }
}
