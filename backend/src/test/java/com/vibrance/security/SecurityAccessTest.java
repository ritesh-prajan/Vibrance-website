package com.vibrance.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SecurityAccessTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("1. Anonymous request to protected /api/v1/auth/me returns 401 Unauthorized")
    void testAnonymousAccessToProtectedProfileReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("2. Anonymous request to /api/v1/audit/logs returns 401 Unauthorized")
    void testAnonymousAccessToAdminAuditReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/audit/logs"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "student_user", roles = {"STUDENT"})
    @DisplayName("3. STUDENT role accessing ADMIN endpoint (/api/v1/audit/logs) returns 403 Forbidden")
    void testStudentAccessToAdminAuditReturns403() throws Exception {
        mockMvc.perform(get("/api/v1/audit/logs"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "student_user", roles = {"STUDENT"})
    @DisplayName("4. STUDENT role accessing GATE_STAFF endpoint (/api/v1/scans/verify) returns 403 Forbidden")
    void testStudentAccessToGateScanReturns403() throws Exception {
        mockMvc.perform(post("/api/v1/scans/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\":\"VIB26-TEST\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "student_user", roles = {"STUDENT"})
    @DisplayName("5. STUDENT role accessing ADMIN concurrency simulation returns 403 Forbidden")
    void testStudentAccessToConcurrencySimulationReturns403() throws Exception {
        mockMvc.perform(post("/api/v1/concurrency/simulate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"strategy\":\"TWO_PHASE_LOCKING\",\"concurrencyLevel\":10}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "gate_officer", roles = {"GATE_STAFF"})
    @DisplayName("6. GATE_STAFF accessing ADMIN concurrency simulation returns 403 Forbidden")
    void testGateStaffAccessToAdminConcurrencyReturns403() throws Exception {
        mockMvc.perform(post("/api/v1/concurrency/simulate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"strategy\":\"TWO_PHASE_LOCKING\",\"concurrencyLevel\":10}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    @DisplayName("7. ADMIN role accessing ADMIN endpoint (/api/v1/audit/logs) returns 200 OK")
    void testAdminAccessToAdminAuditReturns200() throws Exception {
        mockMvc.perform(get("/api/v1/audit/logs"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("8. Public read endpoint (/api/v1/events) is accessible without credentials (200 OK)")
    void testPublicAccessToEventsCatalogReturns200() throws Exception {
        mockMvc.perform(get("/api/v1/events"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("9. Anonymous access to /api/v1/auth/persona/{regNumber} returns 401 Unauthorized")
    void testAnonymousAccessToPersonaReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/auth/persona/RA2111003010142"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "student_user", roles = {"STUDENT"})
    @DisplayName("10. STUDENT access to /api/v1/auth/persona/{regNumber} returns 403 Forbidden")
    void testStudentAccessToPersonaReturns403() throws Exception {
        mockMvc.perform(get("/api/v1/auth/persona/RA2111003010142"))
                .andExpect(status().isForbidden());
    }
}
