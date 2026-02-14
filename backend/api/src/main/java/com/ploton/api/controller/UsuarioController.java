// api/src/main/java/com/ploton/api/controller/UsuarioController.java
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
@CrossOrigin(origins = "*") // ⚠️ SUPER IMPORTANTE PARA O REACT ACESSAR!
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

    // A NOVA ROTA DE LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            Usuario usuarioLogado = service.fazerLogin(dto.email(), dto.senha());
            // Se der certo, devolve o usuário (Status 200 OK)
            return ResponseEntity.ok(usuarioLogado);
        } catch (RuntimeException e) {
            // Se der erro (senha errada ou email não achou), devolve Status 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}