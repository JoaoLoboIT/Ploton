package com.ploton.api.dto;

import java.math.BigDecimal;

public record OrcamentoRequestDTO(
        String categoria,
        BigDecimal valorLimite,
        Integer mes,
        Integer ano
) {}