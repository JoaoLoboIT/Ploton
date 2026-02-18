package com.ploton.api.service;

import com.ploton.api.dto.ExtratoResponseDTO;
import com.ploton.api.model.Parcela;
import com.ploton.api.model.Transacao;
import com.ploton.api.repository.ParcelaRepository;
import com.ploton.api.repository.TransacaoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class ExtratoService {

    private final TransacaoRepository transacaoRepository;
    private final ParcelaRepository parcelaRepository;

    public ExtratoService(TransacaoRepository transacaoRepository, ParcelaRepository parcelaRepository) {
        this.transacaoRepository = transacaoRepository;
        this.parcelaRepository = parcelaRepository;
    }

    public List<ExtratoResponseDTO> gerarExtratoMensal(Long usuarioId, int mes, int ano) {
        List<ExtratoResponseDTO> extrato = new ArrayList<>();

        YearMonth anoMes = YearMonth.of(ano, mes);
        LocalDate inicioMes = anoMes.atDay(1);
        LocalDate fimMes = anoMes.atEndOfMonth();

        List<Transacao> transacoes = transacaoRepository.findByUsuarioIdAndDataBetween(usuarioId, inicioMes, fimMes);

        for (Transacao t : transacoes) {
            extrato.add(new ExtratoResponseDTO(
                    "T-" + t.getId(),
                    t.getData(),
                    t.getDescricao(),
                    t.getCategoria(),
                    t.getValor(),
                    t.getTipo().name(),
                    "A_VISTA",
                    "Conta Corrente"
            ));
        }

        List<Parcela> parcelas = parcelaRepository.findByUsuarioAndMesAndAno(usuarioId, mes, ano);

        for (Parcela p : parcelas) {
            String detalhes = p.getFatura().getCartao().getNome() +
                    " (" + p.getNumeroParcela() + "/" + p.getCompra().getQuantidadeParcelas() + ")";

            extrato.add(new ExtratoResponseDTO(
                    "P-" + p.getId(),
                    p.getCompra().getDataCompra(),
                    p.getCompra().getDescricao(),
                    p.getCompra().getCategoria(),
                    p.getValor(),
                    "DESPESA",
                    "CREDITO",
                    detalhes
            ));
        }

        extrato.sort(Comparator.comparing(ExtratoResponseDTO::data).reversed());

        return extrato;
    }
}