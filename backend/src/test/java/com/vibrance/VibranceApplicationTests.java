package com.vibrance;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class VibranceApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the Spring ApplicationContext bootstraps cleanly with test profile
    }
}
