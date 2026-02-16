package com.ploton.api.controller;

import com.ploton.api.dto.OrcamentoResponseDTO;
import com.ploton.api.model.Orcamento;
import com.ploton.api.service.OrcamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orcamentos")
@CrossOrigin(origins = "*")
public class OrcamentoController {

    private final OrcamentoService service;

    public OrcamentoController(OrcamentoService service) {
        this.service = service;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<OrcamentoResponseDTO>> obterProgresso(
            @PathVariable Long usuarioId,
            @RequestParam Integer mes,
            @RequestParam Integer ano) {
        return ResponseEntity.ok(service.listarProgressoMensal(usuarioId, mes, ano));
    }

    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<Orcamento> criar(@PathVariable Long usuarioId, @RequestBody com.ploton.api.dto.OrcamentoRequestDTO dto) {
        return ResponseEntity.ok(service.salvar(usuarioId, dto));
    }
}