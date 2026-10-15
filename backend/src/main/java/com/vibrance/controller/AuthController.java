package com.vibrance.controller;

import com.vibrance.dto.ApiResponse;
import com.vibrance.dto.AuthDTO;
import com.vibrance.dto.UserDTO;
import com.vibrance.security.UserPrincipal;
import com.vibrance.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication & Persona Switcher", description = "Endpoints for user login, registration, and student/staff/admin persona access")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user or quick-switch persona")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> login(@Valid @RequestBody AuthDTO.LoginRequest req) {
        return ResponseEntity.ok(ApiResponse.success(authService.login(req)));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new attendee account")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> register(@Valid @RequestBody AuthDTO.RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(authService.register(req)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated profile")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(authService.getCurrentUser(principal)));
    }

    @GetMapping("/persona/{regNumber}")
    @Operation(summary = "Get persona details by registration number")
    public ResponseEntity<ApiResponse<UserDTO>> getPersonaByRegNumber(@PathVariable String regNumber) {
        return ResponseEntity.ok(ApiResponse.success(authService.getUserByRegNumber(regNumber)));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users in festival registry (Admin/Staff)")
    public ResponseEntity<ApiResponse<java.util.List<UserDTO>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(authService.getAllUsers()));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user account (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable java.util.UUID id) {
        authService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }
}
