package com.ploton.api.service;

import com.ploton.api.dto.OrcamentoRequestDTO;
import com.ploton.api.dto.OrcamentoResponseDTO;
import com.ploton.api.model.Orcamento;
import com.ploton.api.model.Transacao;
import com.ploton.api.model.Usuario;
import com.ploton.api.repository.OrcamentoRepository;
import com.ploton.api.repository.TransacaoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrcamentoService {

    private final OrcamentoRepository orcamentoRepository;
    private final TransacaoRepository transacaoRepository;
    private final UsuarioService usuarioService; // Essencial para resolver o símbolo!

    public OrcamentoService(OrcamentoRepository orcamentoRepository,
                            TransacaoRepository transacaoRepository,
                            UsuarioService usuarioService) {
        this.orcamentoRepository = orcamentoRepository;
        this.transacaoRepository = transacaoRepository;
        this.usuarioService = usuarioService;
    }

    public List<OrcamentoResponseDTO> listarProgressoMensal(Long usuarioId, Integer mes, Integer ano) {
        // 1. Busca todos os orçamentos definidos para o mês
        List<Orcamento> orcamentos = orcamentoRepository.findByUsuarioIdAndMesAndAno(usuarioId, mes, ano);

        return orcamentos.stream().map(orcamento -> {
            // 2. Calcula o total gasto naquela categoria específica
            BigDecimal gastoNaCategoria = calcularGastoCategoria(usuarioId, orcamento.getCategoria(), mes, ano);

            // 3. Cálculos de apoio
            BigDecimal restante = orcamento.getValorLimite().subtract(gastoNaCategoria);

            // Evita divisão por zero e calcula a porcentagem
            Double porcentagem = 0.0;
            if (orcamento.getValorLimite().compareTo(BigDecimal.ZERO) > 0) {
                porcentagem = gastoNaCategoria
                        .divide(orcamento.getValorLimite(), 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"))
                        .doubleValue();
            }

            return new OrcamentoResponseDTO(
                    orcamento.getId(),
                    orcamento.getCategoria(),
                    orcamento.getValorLimite(),
                    gastoNaCategoria,
                    restante,
                    porcentagem
            );
        }).collect(Collectors.toList());
    }

    private BigDecimal calcularGastoCategoria(Long usuarioId, String categoria, Integer mes, Integer ano) {
        // Lógica para filtrar transações do mês e somar apenas as DESPESAS da categoria
        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim = inicio.plusMonths(1).minusDays(1);

        List<Transacao> transacoes = transacaoRepository.findByUsuarioIdAndDataBetween(usuarioId, inicio, fim);

        return transacoes.stream()
                .filter(t -> t.getCategoria().equalsIgnoreCase(categoria) && t.getTipo().name().equals("DESPESA"))
                .map(Transacao::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional
    public Orcamento salvar(Long usuarioId, OrcamentoRequestDTO dto) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);

        Orcamento orcamento = new Orcamento();
        orcamento.setCategoria(dto.categoria());
        orcamento.setValorLimite(dto.valorLimite());
        orcamento.setMes(dto.mes());
        orcamento.setAno(dto.ano());
        orcamento.setUsuario(usuario);

        return orcamentoRepository.save(orcamento);
    }
}