package com.ploton.api.dto;
import java.math.BigDecimal;
import java.time.LocalDate;

public record HistoricoInvestimentoRequestDTO(
        Long investimentoId,
        BigDecimal saldoTotalDoDia,
        LocalDate dataRegistro
) {}