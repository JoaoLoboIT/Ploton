package com.ploton.api.service;

import com.ploton.api.dto.DashboardResponseDTO;
import com.ploton.api.model.Usuario;
import com.ploton.api.repository.FaturaRepository;
import com.ploton.api.repository.InvestimentoRepository;
import com.ploton.api.repository.MetaRepository;
import com.ploton.api.repository.TransacaoRepository;
import com.ploton.api.repository.UsuarioRepository;
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
        int mesAtual = hoje.getMonthValue();
        int anoAtual = hoje.getYear();

        BigDecimal totalReceitas = transacaoRepository.calcularTotalReceitas(usuarioId);
        BigDecimal totalDespesas = transacaoRepository.calcularTotalDespesas(usuarioId);
        BigDecimal totalInvestido = investimentoRepository.calcularTotalAplicado(usuarioId);
        BigDecimal totalGuardado = metaRepository.calcularTotalGuardado(usuarioId);
        BigDecimal faturaAtual = faturaRepository.calcularTotalFaturasDoMes(usuarioId, mesAtual, anoAtual);

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        BigDecimal saldoReal = usuario.getSaldoManual();

        return new DashboardResponseDTO(
                saldoReal,
                totalReceitas,
                totalDespesas,
                faturaAtual,
                totalInvestido,
                totalGuardado
        );
    }
}