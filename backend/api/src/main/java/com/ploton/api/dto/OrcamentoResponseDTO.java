package com.ploton.api.dto;

import java.math.BigDecimal;

public record OrcamentoResponseDTO(
        Long id,
        String categoria,
        BigDecimal valorLimite,
        BigDecimal valorGasto,
        BigDecimal valorRestante,
        Double porcentagemConsumida
) {}