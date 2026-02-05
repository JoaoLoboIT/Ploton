package com.ploton.api.service;

import com.ploton.api.dto.UsuarioRequestDTO;
import com.ploton.api.model.Usuario;
import com.ploton.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Usuario criarUsuario(UsuarioRequestDTO dados) {
        // Conversão manual de DTO para Entidade (Mapper)
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(dados.nome());
        novoUsuario.setEmail(dados.email());
        novoUsuario.setSenha(dados.senha()); // Obs: Implementaremos o Hash da senha ao configurar o Spring Security

        return repository.save(novoUsuario);
    }

    // Metodo auxiliar para ser reutilizado pelo TransacaoService
    public Usuario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }
}