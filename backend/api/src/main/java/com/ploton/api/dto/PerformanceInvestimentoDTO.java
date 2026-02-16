package com.ploton.api.dto;
import java.math.BigDecimal;

public record PerformanceInvestimentoDTO(
        String nomeAtivo,
        BigDecimal valorInvestido,
        BigDecimal valorMercado
) {}