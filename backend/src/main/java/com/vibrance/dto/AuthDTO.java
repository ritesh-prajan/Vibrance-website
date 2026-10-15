package com.vibrance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTO {

    public static class LoginRequest {
        @NotBlank(message = "Registration number or ID is required")
        private String regNumber;

        private String password;

        private String role; // optional role hint for quick persona switch
        private String name;
        private String department;

        public LoginRequest() {}

        public LoginRequest(String regNumber, String password) {
            this.regNumber = regNumber;
            this.password = password;
        }

        public String getRegNumber() { return regNumber; }
        public void setRegNumber(String regNumber) { this.regNumber = regNumber; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
    }

    public static class RegisterRequest {
        @NotBlank(message = "Registration number is required")
        @Size(max = 32)
        private String regNumber;

        @NotBlank(message = "Full name is required")
        @Size(max = 128)
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        private String password;

        private String role; // defaults to 'student'

        @NotBlank(message = "Department is required")
        private String department;

        private String yearOfStudy;

        public RegisterRequest() {}

        public String getRegNumber() { return regNumber; }
        public void setRegNumber(String regNumber) { this.regNumber = regNumber; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public String getYearOfStudy() { return yearOfStudy; }
        public void setYearOfStudy(String yearOfStudy) { this.yearOfStudy = yearOfStudy; }
    }

    public static class AuthResponse {
        private String token;
        private String tokenType = "Bearer";
        private UserDTO user;

        public AuthResponse() {}

        public AuthResponse(String token, UserDTO user) {
            this.token = token;
            this.user = user;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public String getTokenType() { return tokenType; }
        public void setTokenType(String tokenType) { this.tokenType = tokenType; }

        public UserDTO getUser() { return user; }
        public void setUser(UserDTO user) { this.user = user; }
    }
}
