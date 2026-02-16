package com.ploton.api.service;

import com.ploton.api.dto.DashboardResponseDTO;
import com.ploton.api.model.Usuario;
import com.ploton.api.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class DashboardService {

    private final TransacaoRepository transacaoRepository;
    private final InvestimentoRepository investimentoRepository;
    private final MetaRepository metaRepository;
    private final FaturaRepository faturaRepository;
    private final UsuarioRepository usuarioRepository;

    public DashboardService(TransacaoRepository transacaoRepository,
                            InvestimentoRepository investimentoRepository,
                            MetaRepository metaRepository,
                            FaturaRepository faturaRepository,
                            UsuarioRepository usuarioRepository) {
        this.transacaoRepository = transacaoRepository;
        this.investimentoRepository = investimentoRepository;
        this.metaRepository = metaRepository;
        this.faturaRepository = faturaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public DashboardResponseDTO buscarResumo(Long usuarioId) {
        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = hoje.withDayOfMonth(1);
        LocalDate fimMes = hoje.withDayOfMonth(hoje.lengthOfMonth());

        BigDecimal totalReceitas = transacaoRepository.calcularReceitasNoPeriodo(usuarioId, inicioMes, fimMes);
        BigDecimal totalDespesas = transacaoRepository.calcularDespesasNoPeriodo(usuarioId, inicioMes, fimMes);

        BigDecimal totalInvestido = investimentoRepository.calcularTotalAplicado(usuarioId);
        BigDecimal totalGuardado = metaRepository.calcularTotalGuardado(usuarioId);
        BigDecimal faturaAtual = faturaRepository.calcularTotalFaturasDoMes(usuarioId, hoje.getMonthValue(), hoje.getYear());

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return new DashboardResponseDTO(
                usuario.getSaldoManual(),
                totalReceitas,
                totalDespesas,
                faturaAtual,
                totalInvestido,
                totalGuardado
        );
    }
}