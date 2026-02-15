package com.ploton.api.controller;

import com.ploton.api.dto.LoginDTO;
import com.ploton.api.dto.UsuarioRequestDTO;
import com.ploton.api.model.Usuario;
import com.ploton.api.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@RequestBody UsuarioRequestDTO dto) {
        Usuario novoUsuario = service.criarUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            Usuario usuarioLogado = service.fazerLogin(dto.email(), dto.senha());
            return ResponseEntity.ok(usuarioLogado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/saldo")
    public ResponseEntity<Usuario> atualizarSaldo(@PathVariable Long id, @RequestBody com.ploton.api.dto.UsuarioSaldoRequestDTO dto) {
        Usuario usuarioAtualizado = service.atualizarSaldoManual(id, dto.saldoManual());
        return ResponseEntity.ok(usuarioAtualizado);
    }
}