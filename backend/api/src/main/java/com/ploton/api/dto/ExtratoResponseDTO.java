package com.ploton.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExtratoResponseDTO(
        String idOrigem,
        LocalDate data,
        String descricao,
        String categoria,
        BigDecimal valor,
        String tipoFluxo,
        String formaPagamento,
        String detalhesExtra
) {}