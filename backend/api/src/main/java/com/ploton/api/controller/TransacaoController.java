package com.ploton.api.controller;

import com.ploton.api.dto.TransacaoRequestDTO;
import com.ploton.api.model.Transacao;
import com.ploton.api.service.TransacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transacoes")
@CrossOrigin(origins = "*") // Necessário para o React acessar a API
public class TransacaoController {

    private final TransacaoService service;

    public TransacaoController(TransacaoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> criar(@RequestBody @Valid TransacaoRequestDTO dto) {
        // RESOLVE O ERRO: Alinhado com o nome definido no TransacaoService
        service.salvarTransacao(dto);
        return ResponseEntity.ok().build();
    }

    // Endpoint para listar transações de um usuário específico
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Transacao>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<Transacao> transacoes = service.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(transacoes);
    }
}