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

    @Transactional
    public Meta atualizarSaldo(Long metaId, BigDecimal valor, String tipo) {
        Meta meta = metaRepository.findById(metaId)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada com ID: " + metaId));

        if ("ADICIONAR".equalsIgnoreCase(tipo)) {
            meta.setValorAtual(meta.getValorAtual().add(valor));
        } else if ("REMOVER".equalsIgnoreCase(tipo)) {
            BigDecimal novoValor = meta.getValorAtual().subtract(valor);

            // Regra de Negócio: Não deixar o saldo ficar negativo
            if (novoValor.compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Saldo insuficiente na meta para realizar esta retirada.");
            }
            meta.setValorAtual(novoValor);
        } else {
            throw new RuntimeException("Operação inválida. Use ADICIONAR ou REMOVER.");
        }

        return metaRepository.save(meta);
    }

    @Transactional
    public Meta atualizar(Long id, MetaRequestDTO dto) {
        Meta meta = metaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada com ID: " + id));

        // Atualizamos os dados cadastrais
        meta.setNome(dto.nome());
        meta.setDescricao(dto.descricao());
        meta.setValorAlvo(dto.valorAlvo());
        meta.setDataLimite(dto.dataLimite());

        if (dto.valorAtual() != null) {
            meta.setValorAtual(dto.valorAtual());
        }

        return metaRepository.save(meta);
    }

    @Transactional
    public void deletar(Long id) {
        if (!metaRepository.existsById(id)) {
            throw new RuntimeException("Meta não encontrada com ID: " + id);
        }
        metaRepository.deleteById(id);
    }
    @Transactional
    public Meta salvar(MetaRequestDTO dto) {
        Usuario usuario = usuarioService.buscarPorId(dto.usuarioId());

        Meta meta = new Meta();
        meta.setNome(dto.nome());
        meta.setDescricao(dto.descricao());
        meta.setValorAlvo(dto.valorAlvo());
        meta.setValorAtual(dto.valorAtual() != null ? dto.valorAtual() : BigDecimal.ZERO);
        meta.setDataLimite(dto.dataLimite());

        // Novos campos mapeados
        meta.setPrioridade(dto.prioridade());
        meta.setTipoPeriodo(dto.tipoPeriodo());
        meta.setEhWishlist(dto.ehWishlist());

        meta.setUsuario(usuario);

        return metaRepository.save(meta);
    }

}