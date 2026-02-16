package com.ploton.api.controller;

import com.ploton.api.dto.HistoricoMensalDTO;
import com.ploton.api.dto.PerformanceInvestimentoDTO;
import com.ploton.api.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/gastos-mensais/{usuarioId}")
    public ResponseEntity<List<HistoricoMensalDTO>> historicoGastos(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.getHistoricoGastos(usuarioId));
    }

    @GetMapping("/investimentos/{usuarioId}")
    public ResponseEntity<List<PerformanceInvestimentoDTO>> performanceInvestimentos(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.getPerformanceInvestimentos(usuarioId));
    }
}