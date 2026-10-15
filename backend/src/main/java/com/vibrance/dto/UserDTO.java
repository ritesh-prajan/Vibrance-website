package com.vibrance.dto;

import java.util.UUID;

public class UserDTO {
    private UUID id;
    private String regNumber;
    private String name;
    private String email;
    private String role;
    private String department;
    private String yearOfStudy;
    private String avatarSeed;

    public UserDTO() {}

    public UserDTO(UUID id, String regNumber, String name, String email, String role, String department, String yearOfStudy, String avatarSeed) {
        this.id = id;
        this.regNumber = regNumber;
        this.name = name;
        this.email = email;
        this.role = role;
        this.department = department;
        this.yearOfStudy = yearOfStudy;
        this.avatarSeed = avatarSeed;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getRegNumber() { return regNumber; }
    public void setRegNumber(String regNumber) { this.regNumber = regNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(String yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getAvatarSeed() { return avatarSeed; }
    public void setAvatarSeed(String avatarSeed) { this.avatarSeed = avatarSeed; }
}
