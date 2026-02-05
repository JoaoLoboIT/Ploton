package com.ploton.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CompraCartaoRequestDTO(
        Long cartaoId,
        String descricao,
        String categoria,
        BigDecimal valorTotal,
        Integer quantidadeParcelas,
        LocalDate dataCompra
) {}