package com.ploton.api.service;

import com.ploton.api.dto.TransacaoRequestDTO;
import com.ploton.api.model.Transacao;
import com.ploton.api.model.Usuario;
import com.ploton.api.repository.TransacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransacaoService {

    private final TransacaoRepository repository;
    private final UsuarioService usuarioService;

    // Injeção de dependência de ambos os componentes necessários
    public TransacaoService(TransacaoRepository repository, UsuarioService usuarioService) {
        this.repository = repository;
        this.usuarioService = usuarioService;
    }

    @Transactional
    public Transacao registrar(TransacaoRequestDTO dados) {
        // Valida se o usuário existe antes de prosseguir
        Usuario usuario = usuarioService.buscarPorId(dados.usuarioId());

        Transacao novaTransacao = new Transacao();
        novaTransacao.setDescricao(dados.descricao());
        novaTransacao.setValor(dados.valor());
        novaTransacao.setData(dados.data());
        novaTransacao.setCategoria(dados.categoria());
        novaTransacao.setTipo(dados.tipo()); // Enum é atribuído diretamente
        novaTransacao.setUsuario(usuario);   // Vincula a FK (Foreign Key)

        return repository.save(novaTransacao);
    }

    public List<Transacao> listarPorUsuario(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }
}