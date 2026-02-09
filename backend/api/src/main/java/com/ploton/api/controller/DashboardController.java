package com.ploton.api.controller;

import com.ploton.api.dto.DashboardResponseDTO;
import com.ploton.api.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<DashboardResponseDTO> buscarResumo(@PathVariable Long usuarioId) {
        DashboardResponseDTO resumo = dashboardService.buscarResumo(usuarioId);
        return ResponseEntity.ok(resumo);
    }
}