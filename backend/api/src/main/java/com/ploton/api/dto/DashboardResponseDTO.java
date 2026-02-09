package com.ploton.api.dto;

import java.math.BigDecimal;

public record DashboardResponseDTO(
        BigDecimal totalReceitas,
        BigDecimal totalDespesas,
        BigDecimal saldo,
        BigDecimal totalInvestido
) {}