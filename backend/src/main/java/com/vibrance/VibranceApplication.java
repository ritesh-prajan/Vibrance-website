package com.vibrance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class VibranceApplication {

    public static void main(String[] args) {
        SpringApplication.run(VibranceApplication.class, args);
    }
}
