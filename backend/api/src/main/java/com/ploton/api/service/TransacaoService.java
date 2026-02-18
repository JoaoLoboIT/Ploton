package com.ploton.api.service;

import com.ploton.api.dto.TransacaoRequestDTO;
import com.ploton.api.model.TipoTransacao;
import com.ploton.api.model.Transacao;
import com.ploton.api.model.Usuario;
import com.ploton.api.repository.TransacaoRepository;
import com.ploton.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
public class TransacaoService {

    private final TransacaoRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;

    public TransacaoService(TransacaoRepository repository,
                            UsuarioRepository usuarioRepository,
                            UsuarioService usuarioService) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
    }

    @Transactional
    public void salvarTransacao(TransacaoRequestDTO dto) {
        Usuario usuario = usuarioService.buscarPorId(dto.usuarioId());
        int parcelas = (dto.totalParcelas() != null && dto.totalParcelas() > 0) ? dto.totalParcelas() : 1;
        BigDecimal valorParcela = dto.valor().divide(BigDecimal.valueOf(parcelas), 2, RoundingMode.HALF_UP);
        String grupoId = UUID.randomUUID().toString();

        for (int i = 0; i < parcelas; i++) {
            Transacao t = new Transacao();
            t.setUsuario(usuario);
            t.setNome(dto.nome());
            t.setDescricao(dto.nome());
            t.setValor(valorParcela);
            t.setTipo(TipoTransacao.valueOf(dto.tipo().toUpperCase()));
            t.setCategoria(dto.categoria());
            t.setMetodoPagamento(dto.metodoPagamento());
            t.setData(dto.data().plusMonths(i));
            t.setParcelaAtual(i + 1);
            t.setTotalParcelas(parcelas);
            t.setInstalamentoId(grupoId);

            this.repository.save(t);
        }
    }

    public List<Transacao> listarPorUsuario(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    @Transactional
    public void excluirTransacao(Long id, boolean excluirTudo) {
        Transacao t = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada"));

        if (excluirTudo && t.getInstalamentoId() != null) {
            repository.deleteByInstalamentoId(t.getInstalamentoId());
        } else {
            repository.delete(t);
        }
    }
}