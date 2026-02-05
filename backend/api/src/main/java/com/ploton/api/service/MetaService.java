package com.ploton.api.service;

import com.ploton.api.dto.MetaRequestDTO;
import com.ploton.api.model.Meta;
import com.ploton.api.model.Usuario;
import com.ploton.api.repository.MetaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MetaService {

    private final MetaRepository metaRepository;
    private final UsuarioService usuarioService;

    public MetaService(MetaRepository metaRepository, UsuarioService usuarioService) {
        this.metaRepository = metaRepository;
        this.usuarioService = usuarioService;
    }

    @Transactional
    public Meta criar(MetaRequestDTO dto) {
        Usuario dono = usuarioService.buscarPorId(dto.usuarioId());

        Meta novaMeta = new Meta();
        novaMeta.setNome(dto.nome());
        novaMeta.setDescricao(dto.descricao());
        novaMeta.setValorAlvo(dto.valorAlvo());
        novaMeta.setDataLimite(dto.dataLimite());
        novaMeta.setUsuario(dono);

        if (dto.valorAtual() != null) {
            novaMeta.setValorAtual(dto.valorAtual());
        } else {
            novaMeta.setValorAtual(BigDecimal.ZERO);
        }

        return metaRepository.save(novaMeta);
    }

    public List<Meta> listarPorUsuario(Long usuarioId) {
        return metaRepository.findByUsuarioIdOrderByDataLimiteAsc(usuarioId);
    }
}