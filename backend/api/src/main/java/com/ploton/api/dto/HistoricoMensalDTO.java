package com.ploton.api.dto;
import java.math.BigDecimal;

public record HistoricoMensalDTO(
        String mes,
        BigDecimal valorAVista,
        BigDecimal valorCredito
) {}