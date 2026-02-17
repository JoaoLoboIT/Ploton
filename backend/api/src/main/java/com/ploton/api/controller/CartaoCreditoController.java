package com.ploton.api.controller;

import com.ploton.api.dto.CartaoCreditoRequestDTO;
import com.ploton.api.model.CartaoCredito;
import com.ploton.api.service.CartaoCreditoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cartoes")
@CrossOrigin(origins = "*") // Libera acesso para o React
public class CartaoCreditoController {

    private final CartaoCreditoService service;

    public CartaoCreditoController(CartaoCreditoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CartaoCredito> cadastrar(@RequestBody CartaoCreditoRequestDTO dto) {
        CartaoCredito novoCartao = service.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCartao);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<CartaoCredito>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<CartaoCredito> cartoes = service.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(cartoes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}