package com.ploton.api.service;

import com.ploton.api.dto.HistoricoInvestimentoRequestDTO;
import com.ploton.api.model.HistoricoInvestimento;
import com.ploton.api.model.Investimento;
import com.ploton.api.repository.HistoricoInvestimentoRepository;
import com.ploton.api.repository.InvestimentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HistoricoInvestimentoService {

    private final HistoricoInvestimentoRepository historicoRepository;
    private final InvestimentoRepository investimentoRepository;

    public HistoricoInvestimentoService(HistoricoInvestimentoRepository historicoRepository, InvestimentoRepository investimentoRepository) {
        this.historicoRepository = historicoRepository;
        this.investimentoRepository = investimentoRepository;
    }

    @Transactional
    public HistoricoInvestimento registrarSnapshotDiario(HistoricoInvestimentoRequestDTO dto) {
        Investimento investimento = investimentoRepository.findById(dto.investimentoId())
                .orElseThrow(() -> new RuntimeException("Investimento não encontrado"));

        HistoricoInvestimento historico = new HistoricoInvestimento(
                dto.dataRegistro(),
                dto.saldoTotalDoDia(),
                investimento
        );

        investimento.setSaldo(dto.saldoTotalDoDia());
        investimentoRepository.save(investimento);

        return historicoRepository.save(historico);
    }

    public List<HistoricoInvestimento> buscarHistoricoDoInvestimento(Long investimentoId) {
        return historicoRepository.findByInvestimentoIdOrderByDataRegistroAsc(investimentoId);
    }
}