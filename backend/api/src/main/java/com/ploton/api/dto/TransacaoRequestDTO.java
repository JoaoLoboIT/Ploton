package com.ploton.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransacaoRequestDTO(
        Long usuarioId,
        String nome,
        BigDecimal valor,
        String tipo, // "RECEITA" ou "DESPESA"
        String categoria,
        String metodoPagamento,
        LocalDate data,
        Integer totalParcelas
) {}