// api/src/main/java/com/ploton/api/controller/ExtratoController.java
package com.ploton.api.controller;

import com.ploton.api.dto.ExtratoResponseDTO;
import com.ploton.api.service.ExtratoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/extrato")
@CrossOrigin(origins = "*")
public class ExtratoController {

    private final ExtratoService service;

    public ExtratoController(ExtratoService service) {
        this.service = service;
    }

    // Ex: GET /api/extrato/usuario/2?mes=2&ano=2026
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ExtratoResponseDTO>> obterExtrato(
            @PathVariable Long usuarioId,
            @RequestParam int mes,
            @RequestParam int ano) {

        List<ExtratoResponseDTO> extrato = service.gerarExtratoMensal(usuarioId, mes, ano);
        return ResponseEntity.ok(extrato);
    }
}