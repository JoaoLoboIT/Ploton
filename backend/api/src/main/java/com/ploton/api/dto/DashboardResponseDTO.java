// api/src/main/java/com/ploton/api/dto/DashboardResponseDTO.java
package com.ploton.api.dto;

import java.math.BigDecimal;

public record DashboardResponseDTO(
        BigDecimal saldoAtual,
        BigDecimal totalReceitas,
        BigDecimal totalDespesas,
        BigDecimal faturaAtual,
        BigDecimal totalInvestido,
        BigDecimal totalGuardadoMetas
) {}