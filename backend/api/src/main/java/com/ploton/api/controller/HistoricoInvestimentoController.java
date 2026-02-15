package com.ploton.api.controller;

import com.ploton.api.dto.HistoricoInvestimentoRequestDTO;
import com.ploton.api.model.HistoricoInvestimento;
import com.ploton.api.service.HistoricoInvestimentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico-investimentos")
@CrossOrigin(origins = "*")
public class HistoricoInvestimentoController {

    private final HistoricoInvestimentoService service;

    public HistoricoInvestimentoController(HistoricoInvestimentoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<HistoricoInvestimento> registrar(@RequestBody HistoricoInvestimentoRequestDTO dto) {
        HistoricoInvestimento salvo = service.registrarSnapshotDiario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping("/investimento/{investimentoId}")
    public ResponseEntity<List<HistoricoInvestimento>> listarPorInvestimento(@PathVariable Long investimentoId) {
        return ResponseEntity.ok(service.buscarHistoricoDoInvestimento(investimentoId));
    }
}