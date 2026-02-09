package com.ploton.api.service;

import com.ploton.api.dto.DashboardResponseDTO;
import com.ploton.api.repository.InvestimentoRepository;
import com.ploton.api.repository.TransacaoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    private final TransacaoRepository transacaoRepository;
    private final InvestimentoRepository investimentoRepository;

    public DashboardService(TransacaoRepository transacaoRepository, InvestimentoRepository investimentoRepository) {
        this.transacaoRepository = transacaoRepository;
        this.investimentoRepository = investimentoRepository;
    }

    public DashboardResponseDTO buscarResumo(Long usuarioId) {
        BigDecimal totalReceitas = transacaoRepository.calcularTotalReceitas(usuarioId);
        BigDecimal totalDespesas = transacaoRepository.calcularTotalDespesas(usuarioId);
        BigDecimal totalInvestido = investimentoRepository.calcularTotalAplicado(usuarioId);

        BigDecimal saldo = totalReceitas.subtract(totalDespesas);

        return new DashboardResponseDTO(
                totalReceitas,
                totalDespesas,
                saldo,
                totalInvestido
        );
    }
}