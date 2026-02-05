package com.ploton.api.dto;

import com.ploton.api.model.TipoTransacao;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransacaoRequestDTO(
        String descricao,
        BigDecimal valor,
        LocalDate data,
        String categoria,
        TipoTransacao tipo,
        Long usuarioId
) {}