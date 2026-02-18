package com.ploton.api.service;

import com.ploton.api.dto.CompraCartaoRequestDTO;
import com.ploton.api.model.*;
import com.ploton.api.repository.CompraCartaoRepository;
import com.ploton.api.repository.FaturaRepository;
import com.ploton.api.repository.ParcelaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Service
public class CompraCartaoService {

    private final CompraCartaoRepository compraRepository;
    private final ParcelaRepository parcelaRepository;
    private final FaturaRepository faturaRepository;
    private final CartaoCreditoService cartaoService;

    public CompraCartaoService(CompraCartaoRepository compraRepository, ParcelaRepository parcelaRepository, FaturaRepository faturaRepository, CartaoCreditoService cartaoService) {
        this.compraRepository = compraRepository;
        this.parcelaRepository = parcelaRepository;
        this.faturaRepository = faturaRepository;
        this.cartaoService = cartaoService;
    }

    @Transactional
    public CompraCartao registrar(CompraCartaoRequestDTO dto) {
        CartaoCredito cartao = cartaoService.buscarPorId(dto.cartaoId());

        CompraCartao compra = new CompraCartao();
        compra.setCartao(cartao);
        compra.setDescricao(dto.descricao());
        compra.setCategoria(dto.categoria());
        compra.setDataCompra(dto.dataCompra());
        compra.setValorTotal(dto.valorTotal());
        compra.setQuantidadeParcelas(dto.quantidadeParcelas());

        CompraCartao compraSalva = compraRepository.save(compra);

        BigDecimal valorParcela = dto.valorTotal().divide(
                BigDecimal.valueOf(dto.quantidadeParcelas()), 2, RoundingMode.HALF_EVEN
        );

        gerarParcelas(compraSalva, valorParcela, cartao);

        return compraSalva;
    }

    private void gerarParcelas(CompraCartao compra, BigDecimal valorParcela, CartaoCredito cartao) {
        LocalDate dataBase = compra.getDataCompra();

        if (dataBase.getDayOfMonth() >= cartao.getDiaFechamento()) {
            dataBase = dataBase.plusMonths(1);
        }

        for (int i = 0; i < compra.getQuantidadeParcelas(); i++) {
            LocalDate dataFatura = dataBase.plusMonths(i);

            Fatura fatura = obterOuCriarFatura(cartao, dataFatura.getMonthValue(), dataFatura.getYear());

            Parcela parcela = new Parcela();
            parcela.setCompra(compra);
            parcela.setFatura(fatura);
            parcela.setValor(valorParcela);
            parcela.setNumeroParcela(i + 1);

            parcelaRepository.save(parcela);

            fatura.setValorTotal(fatura.getValorTotal().add(valorParcela));
            faturaRepository.save(fatura);
        }
    }

    private Fatura obterOuCriarFatura(CartaoCredito cartao, Integer mes, Integer ano) {
        return faturaRepository.findByCartaoIdAndMesAndAno(cartao.getId(), mes, ano)
                .orElseGet(() -> {
                    Fatura novaFatura = new Fatura();
                    novaFatura.setCartao(cartao);
                    novaFatura.setMes(mes);
                    novaFatura.setAno(ano);
                    novaFatura.setStatus(StatusFatura.ABERTA);
                    novaFatura.setValorTotal(BigDecimal.ZERO);
                    return faturaRepository.save(novaFatura);
                });
    }
}