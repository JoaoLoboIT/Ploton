package com.ploton.api.dto;

import java.math.BigDecimal;

public record CartaoCreditoRequestDTO(
        String nome,
        Integer diaFechamento,
        Integer diaVencimento,
        BigDecimal limiteTotal,
        Long usuarioId
) {}