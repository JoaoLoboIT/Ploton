package com.ploton.api.service;

import com.ploton.api.dto.HistoricoMensalDTO;
import com.ploton.api.dto.PerformanceInvestimentoDTO;
import com.ploton.api.model.Investimento;
import com.ploton.api.repository.InvestimentoRepository;
import com.ploton.api.repository.TransacaoRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final TransacaoRepository transacaoRepository;
    private final InvestimentoRepository investimentoRepository;

    public AnalyticsService(TransacaoRepository transacaoRepository, InvestimentoRepository investimentoRepository) {
        this.transacaoRepository = transacaoRepository;
        this.investimentoRepository = investimentoRepository;
    }

    public List<HistoricoMensalDTO> getHistoricoGastos(Long usuarioId) {
        // Agora usa a query de projeção futura
        List<Object[]> resultados = transacaoRepository.buscarResumoHibrido(usuarioId);

        return resultados.stream().map(row -> {
            BigDecimal aVista = row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO;
            BigDecimal credito = row[2] != null ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO;
            return new HistoricoMensalDTO((String) row[0], aVista, credito);
        }).collect(java.util.stream.Collectors.toList());
    }

    public List<PerformanceInvestimentoDTO> getPerformanceInvestimentos(Long usuarioId) {
        List<Investimento> investimentos = investimentoRepository.findByUsuarioId(usuarioId);

        return investimentos.stream().map(inv -> new PerformanceInvestimentoDTO(
                inv.getNome(),
                inv.getValorInvestido(),
                inv.getSaldo()
        )).collect(Collectors.toList());
    }
}