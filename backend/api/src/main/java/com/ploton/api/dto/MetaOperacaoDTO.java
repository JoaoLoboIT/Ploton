package com.ploton.api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record MetaOperacaoDTO(
        @NotNull(message = "O valor é obrigatório")
        @Positive(message = "O valor deve ser positivo")
        BigDecimal valor,

        @NotNull(message = "O tipo de operação é obrigatório (ADICIONAR ou REMOVER)")
        String tipo // Vamos aceitar "ADICIONAR" ou "REMOVER"
) {}