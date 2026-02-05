package com.ploton.api.controller;

import com.ploton.api.dto.UsuarioRequestDTO;
import com.ploton.api.model.Usuario;
import com.ploton.api.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@RequestBody UsuarioRequestDTO dto) {
        Usuario novoUsuario = service.criarUsuario(dto);
        // Retorna status 201 (Created) e o objeto criado no corpo
        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }
}