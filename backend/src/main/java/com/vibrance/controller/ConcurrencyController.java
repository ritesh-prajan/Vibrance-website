package com.vibrance.controller;

import com.vibrance.dto.ApiResponse;
import com.vibrance.dto.ConcurrencyDTO;
import com.vibrance.entity.ConcurrencySimRun;
import com.vibrance.service.ConcurrencyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/concurrency")
@Tag(name = "DBMS Concurrency & Isolation Lab")
public class ConcurrencyController {

    private final ConcurrencyService concurrencyService;

    public ConcurrencyController(ConcurrencyService concurrencyService) {
        this.concurrencyService = concurrencyService;
    }

    @PostMapping("/simulate")
    @Operation(summary = "Execute concurrency simulation run")
    public ResponseEntity<ApiResponse<ConcurrencyDTO.ConcurrencyRunResultDTO>> simulate(
            @RequestBody ConcurrencyDTO.ConcurrencySimRequest req) {
        return ResponseEntity.ok(ApiResponse.success(concurrencyService.runSimulation(req)));
    }

    @PostMapping("/side-by-side")
    @Operation(summary = "Run side-by-side comparative benchmark")
    public ResponseEntity<ApiResponse<ConcurrencyDTO.SideBySideResultDTO>> sideBySide(
            @RequestBody ConcurrencyDTO.SideBySideSimRequest req) {
        return ResponseEntity.ok(ApiResponse.success(concurrencyService.runSideBySideSimulation(req)));
    }

    @GetMapping("/runs")
    @Operation(summary = "Get historical simulation runs")
    public ResponseEntity<ApiResponse<List<ConcurrencySimRun>>> getRuns() {
        return ResponseEntity.ok(ApiResponse.success(concurrencyService.getAllSimRuns()));
    }
}
