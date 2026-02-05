package com.ploton.api.dto;

import com.ploton.api.model.TipoMovimentacao;
import java.math.BigDecimal;
import java.time.LocalDate;

public record MovimentacaoRequestDTO(
        Long investimentoId,
        BigDecimal valor,
        TipoMovimentacao tipo,
        LocalDate data // Opcional no frontend, mas importante se o usuário estiver registrando algo passado
) {}