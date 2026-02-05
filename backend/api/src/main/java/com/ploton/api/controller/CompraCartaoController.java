package com.ploton.api.controller;

import com.ploton.api.dto.CompraCartaoRequestDTO;
import com.ploton.api.model.CompraCartao;
import com.ploton.api.service.CompraCartaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compras-cartao")
@CrossOrigin(origins = "*")
public class CompraCartaoController {

    private final CompraCartaoService service;

    public CompraCartaoController(CompraCartaoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CompraCartao> registrar(@RequestBody CompraCartaoRequestDTO dto) {
        CompraCartao novaCompra = service.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaCompra);
    }
}