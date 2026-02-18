package com.ploton.api.service;

import com.ploton.api.dto.UsuarioRequestDTO;
import com.ploton.api.model.Usuario;
import com.ploton.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Usuario criarUsuario(UsuarioRequestDTO dados) {
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(dados.nome());
        novoUsuario.setEmail(dados.email());
        novoUsuario.setSenha(dados.senha());

        return repository.save(novoUsuario);
    }

    public Usuario fazerLogin(String email, String senha) {
        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (!usuario.getSenha().equals(senha)) {
            throw new RuntimeException("Senha incorreta.");
        }

        return usuario;
    }

    public Usuario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }

    @Transactional
    public Usuario atualizarSaldoManual(Long id, BigDecimal novoSaldo) {
        Usuario usuario = buscarPorId(id);
        usuario.setSaldoManual(novoSaldo);
        return repository.save(usuario);
    }
}