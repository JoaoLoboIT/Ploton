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

    public Usuario fazerLogin(String email, String senha) {
        // 1. Busca o usuário pelo email
        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        // 2. Confere se a senha do banco é igual a senha digitada
        if (!usuario.getSenha().equals(senha)) {
            throw new RuntimeException("Senha incorreta.");
        }

        // 3. Se tudo deu certo, devolve o usuário
        return usuario;
    }

    // Metodo auxiliar para ser reutilizado pelo TransacaoService
    public Usuario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }
}